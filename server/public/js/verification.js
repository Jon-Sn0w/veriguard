const { ethers } = require('ethers');

async function verifyERC721Ownership(walletAddress, nftAddress, provider) {
    console.log(`Starting direct ERC721 verification for wallet ${walletAddress} and NFT ${nftAddress}`);
    
    try {
        const erc721Interface = new ethers.utils.Interface([
            'function balanceOf(address) view returns (uint256)',
            'function ownerOf(uint256) view returns (address)',
            'function totalSupply() view returns (uint256)'
        ]);
        
        const nftContract = new ethers.Contract(nftAddress, erc721Interface, provider);
        const walletAddressLower = walletAddress.toLowerCase();
        
        const balance = await nftContract.balanceOf(walletAddress);
        console.log('ERC721 balance check result:', balance.toString());
        
        if (balance.eq(0)) {
            return { isOwner: false, count: '0', ownedTokenIds: [] };
        }

        const targetBalance = balance.toNumber();
        const foundTokens = new Set();
        let maxTokenId;

        try {
            maxTokenId = await nftContract.totalSupply();
            console.log('Total supply found:', maxTokenId.toString());
        } catch {
            maxTokenId = ethers.BigNumber.from('20000'); // Default to 20k max
            console.log('Using default max range:', maxTokenId.toString());
        }

        async function checkTokenRange(startId, endId, searchId, direction = 1) {
            console.log(`[Search ${searchId}] Checking range ${startId} to ${endId}`);
            const batchSize = 100;
            let currentId = startId;

            while ((direction > 0 && currentId < endId) || (direction < 0 && currentId > endId)) {
                if (foundTokens.size >= targetBalance) break;

                const batchPromises = [];
                const batchEnd = direction > 0 ?
                    Math.min(currentId + batchSize, endId) :
                    Math.max(currentId - batchSize, endId);

                for (let id = currentId; 
                    direction > 0 ? id < batchEnd : id > batchEnd; 
                    id += direction
                ) {
                    batchPromises.push((async () => {
                        try {
                            const owner = await nftContract.ownerOf(id);
                            if (owner.toLowerCase() === walletAddressLower) {
                                foundTokens.add(id.toString());
                                console.log(`[Search ${searchId}] Found token ${id}`);
                                if (foundTokens.size >= targetBalance) return;
                            }
                        } catch (e) {
                            // Skip invalid tokens silently
                        }
                    })());
                }

                await Promise.all(batchPromises);
                currentId = batchEnd;
            }
        }

        const searchPromises = [
            checkTokenRange(0, 5000, 'F1', 1),
            checkTokenRange(5000, 10000, 'F2', 1),
            checkTokenRange(maxTokenId.toNumber(), maxTokenId.toNumber() - 5000, 'B1', -1),
            checkTokenRange(maxTokenId.toNumber() - 5000, maxTokenId.toNumber() - 10000, 'B2', -1)
        ];

        await Promise.all(searchPromises);

        const foundTokensArray = Array.from(foundTokens);
        const success = foundTokensArray.length > 0;
        
        console.log(`ERC721 verification ${success ? 'successful' : 'failed'}. Found ${foundTokensArray.length}/${targetBalance} tokens`);
        return { isOwner: success, count: balance.toString(), ownedTokenIds: foundTokensArray };

    } catch (error) {
        console.error('ERC721 verification failed:', error);
        throw error;
    }
}

async function verifyERC1155Ownership(walletAddress, nftAddress, provider) {
    console.log(`Starting ERC-1155 verification for wallet ${walletAddress} and NFT ${nftAddress}`);
    
    try {
        const erc1155Interface = new ethers.utils.Interface([
            'function balanceOf(address account, uint256 id) view returns (uint256)',
            'function balanceOfBatch(address[] accounts, uint256[] ids) view returns (uint256[])'
        ]);
        
        const nftContract = new ethers.Contract(nftAddress, erc1155Interface, provider);
        const walletAddressLower = walletAddress.toLowerCase();
        
        // Check a reasonable range of token IDs (e.g., 0 to 99) since ERC-1155 can have many IDs
        const tokenIdsToCheck = Array.from({ length: 100 }, (_, i) => i); // Check IDs 0-99
        const accounts = tokenIdsToCheck.map(() => walletAddress);
        
        const balances = await nftContract.balanceOfBatch(accounts, tokenIdsToCheck);
        console.log('ERC-1155 batch balance check result:', balances.map(b => b.toString()));

        let totalCount = ethers.BigNumber.from(0);
        const ownedTokenIds = [];

        balances.forEach((balance, index) => {
            if (balance.gt(0)) {
                totalCount = totalCount.add(balance);
                ownedTokenIds.push({ id: tokenIdsToCheck[index].toString(), balance: balance.toString() });
            }
        });

        const isOwner = totalCount.gt(0);
        console.log(`ERC-1155 verification ${isOwner ? 'successful' : 'failed'}. Total count: ${totalCount.toString()}`);
        return { isOwner, count: totalCount.toString(), ownedTokenIds: ownedTokenIds.map(item => item.id) };

    } catch (error) {
        console.error('ERC-1155 verification failed:', error);
        throw error;
    }
}

async function verifyContractOwnership(walletAddress, nftAddress, nftVerificationContract) {
    try {
        const [isOwner, count] = await nftVerificationContract.verifyOwnershipWithCount(walletAddress, nftAddress);
        
        if (!isOwner && count.toString() === '0') {
            throw new Error('Contract verification returned no ownership - using fallback');
        }
        
        return { isOwner, count: count.toString(), ownedTokenIds: [] };
    } catch (error) {
        throw error;
    }
}

async function verifyNFTOwnership(walletAddress, nftAddress, chain, provider, nftVerificationContract) {
    console.log(`Verifying NFT ownership for ${walletAddress} on ${chain} at ${nftAddress}`);

    try {
        // Try primary contract verification first
        try {
            const result = await verifyContractOwnership(walletAddress, nftAddress, nftVerificationContract);
            console.log('Contract verification result:', result);
            return { ...result, method: 'contract' };
        } catch (contractError) {
            console.log('Contract verification unsuccessful, trying ERC-721 fallback:', contractError.message);

            // Try ERC-721 verification
            try {
                const result = await verifyERC721Ownership(walletAddress, nftAddress, provider);
                console.log('ERC-721 fallback result:', result);
                return { ...result, method: 'erc721_fallback' };
            } catch (erc721Error) {
                console.log('ERC-721 verification unsuccessful, trying ERC-1155 fallback:', erc721Error.message);

                // Try ERC-1155 verification
                const result = await verifyERC1155Ownership(walletAddress, nftAddress, provider);
                console.log('ERC-1155 fallback result:', result);
                return { ...result, method: 'erc1155_fallback' };
            }
        }
    } catch (error) {
        console.error('All verification methods failed for', nftAddress, ':', error);
        return { isOwner: false, count: '0', ownedTokenIds: [], method: 'failed', error: error.message };
    }
}

async function transferOwnershipVerification(from, to, tokenId, nftAddress, nftVerificationContract) {
    try {
        await nftVerificationContract.verifyTransfer(from, to, tokenId, nftAddress);
        return true;
    } catch (error) {
        console.error('Transfer verification failed:', error);
        return false;
    }
}

async function verifyRoleEligibility(walletAddress, nftAddress, roleId, nftVerificationContract) {
    try {
        return await nftVerificationContract.verifyRoleEligibility(walletAddress, nftAddress, roleId);
    } catch (error) {
        console.error('Role eligibility verification failed:', error);
        return false;
    }
}

module.exports = {
    verifyNFTOwnership,
    verifyERC721Ownership,
    verifyERC1155Ownership, // Export for testing if needed
    transferOwnershipVerification,
    verifyRoleEligibility
};
