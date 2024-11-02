const { ethers } = require('ethers');

async function verifyERC721Ownership(walletAddress, nftAddress, provider) {
    console.log(`Starting direct ERC721 verification for wallet ${walletAddress} and NFT ${nftAddress}`);
    
    try {
        // Create contract instance for direct ERC721 interaction
        const erc721Interface = new ethers.utils.Interface([
            'function balanceOf(address) view returns (uint256)',
            'function ownerOf(uint256) view returns (address)',
            'function totalSupply() view returns (uint256)'
        ]);
        
        const nftContract = new ethers.Contract(nftAddress, erc721Interface, provider);
        const walletAddressLower = walletAddress.toLowerCase();
        
        // Get balance first
        const balance = await nftContract.balanceOf(walletAddress);
        console.log('ERC721 balance check result:', balance.toString());
        
        if (balance.eq(0)) {
            return [false, '0', []];
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

        // Process a range of token IDs
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

        // Run 4 parallel searches
        const searchPromises = [
            // Forward searches from 0
            checkTokenRange(0, 5000, 'F1', 1),
            checkTokenRange(5000, 10000, 'F2', 1),
            // Backward searches from max
            checkTokenRange(maxTokenId.toNumber(), maxTokenId.toNumber() - 5000, 'B1', -1),
            checkTokenRange(maxTokenId.toNumber() - 5000, maxTokenId.toNumber() - 10000, 'B2', -1)
        ];

        await Promise.all(searchPromises);

        const foundTokensArray = Array.from(foundTokens);
        const success = foundTokensArray.length > 0;
        
        console.log(`ERC721 verification ${success ? 'successful' : 'failed'}. Found ${foundTokensArray.length}/${targetBalance} tokens`);
        return [success, balance.toString(), foundTokensArray];

    } catch (error) {
        console.error('Error in ERC721 verification:', error);
        throw error;
    }
}

async function verifyContractOwnership(walletAddress, nftAddress, nftVerificationContract) {
    try {
        const [isOwner, count] = await nftVerificationContract.verifyOwnershipWithCount(walletAddress, nftAddress);
        
        if (!isOwner && count.toString() === '0') {
            throw new Error('Contract verification returned no ownership - using fallback');
        }
        
        return [isOwner, count];
    } catch (error) {
        throw error;
    }
}

async function verifyNFTOwnership(walletAddress, nftAddress, chain, provider, nftVerificationContract) {
    console.log(`Verifying NFT ownership for ${walletAddress} on ${chain}`);

    try {
        // Try primary contract verification first
        try {
            const [isOwner, count] = await verifyContractOwnership(walletAddress, nftAddress, nftVerificationContract);
            console.log('Contract verification result:', { isOwner, count: count.toString() });
            
            return {
                isOwner,
                count: count.toString(),
                method: 'contract',
                ownedTokenIds: []
            };
        } catch (contractError) {
            console.log('Contract verification unsuccessful, trying ERC721 fallback:', contractError.message);

            // Try direct ERC721 verification
            const [isOwner, count, tokenIds] = await verifyERC721Ownership(
                walletAddress,
                nftAddress,
                provider
            );
            
            console.log('ERC721 fallback verification result:', { isOwner, count, tokenIds });
            
            return {
                isOwner,
                count,
                method: 'erc721_fallback',
                ownedTokenIds: tokenIds
            };
        }
    } catch (error) {
        console.error('All verification methods failed:', error);
        throw error;
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
    transferOwnershipVerification,
    verifyRoleEligibility
};
