const { ethers } = require('ethers');
require('dotenv').config();

const ERC1155_ABI = [
    "function balanceOf(address account, uint256 id) view returns (uint256)",
    "function balanceOfBatch(address[] accounts, uint256[] ids) view returns (uint256[])"
];

const ERC721_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function ownerOf(uint256 tokenId) view returns (address)",
    "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)"
];

async function getTokenBalances(nftContract, userAddress, isERC1155, expectedCount, nftVerificationContract, nftAddress) {
    let foundTokens = [];
    
    try {
        // First check if this is a mapped NFT
        const nftMapping = await nftVerificationContract.nftMappings(nftAddress);
        if (!nftMapping.isERC1155 && isERC1155) {
            console.log('WARNING: Contract type mismatch - registered as non-ERC1155 but detected as ERC1155');
            return foundTokens;
        }

        if (isERC1155) {
            console.log(`Checking ERC1155 balances for ${expectedCount} tokens`);
            // For ERC1155, try batch balance check first
            try {
                // Create arrays for batch check
                const tokenIds = Array.from({ length: expectedCount }, (_, i) => i + 1);
                const accounts = Array(expectedCount).fill(userAddress);
                
                const balances = await nftContract.balanceOfBatch(accounts, tokenIds);
                
                for (let i = 0; i < balances.length; i++) {
                    if (balances[i].gt(0)) {
                        foundTokens.push({
                            tokenId: tokenIds[i],
                            balance: balances[i].toNumber()
                        });
                        console.log(`Found ERC1155 token ${tokenIds[i]} with balance ${balances[i].toString()}`);
                    }
                }
            } catch (batchError) {
                console.log('Batch balance check failed, falling back to individual checks');
                // Fall back to individual balance checks
                for (let tokenId = 1; tokenId <= expectedCount; tokenId++) {
                    try {
                        const balance = await nftContract.balanceOf(userAddress, tokenId);
                        if (balance.gt(0)) {
                            foundTokens.push({
                                tokenId,
                                balance: balance.toNumber()
                            });
                            console.log(`Found ERC1155 token ${tokenId} with balance ${balance.toString()}`);
                        }
                    } catch (error) {
                        continue;
                    }
                }
            }
        } else {
            // ERC721 handling
            let foundCount = 0;
            
            // Try enumeration first
            try {
                const balance = await nftContract.balanceOf(userAddress);
                for (let i = 0; i < Math.min(balance.toNumber(), expectedCount); i++) {
                    try {
                        const tokenId = await nftContract.tokenOfOwnerByIndex(userAddress, i);
                        foundTokens.push({
                            tokenId: tokenId.toNumber(),
                            balance: 1
                        });
                        foundCount++;
                        console.log(`Found ERC721 token ${tokenId} via enumeration`);
                    } catch (enumError) {
                        break;
                    }
                }
            } catch (error) {
                console.log('ERC721 enumeration not supported');
            }
            
            // If enumeration didn't find everything, try sequential checks
            if (foundCount < expectedCount) {
                for (let tokenId = 1; tokenId <= 100 && foundCount < expectedCount; tokenId++) {
                    try {
                        const owner = await nftContract.ownerOf(tokenId);
                        if (owner.toLowerCase() === userAddress.toLowerCase()) {
                            foundTokens.push({
                                tokenId,
                                balance: 1
                            });
                            foundCount++;
                            console.log(`Found ERC721 token ${tokenId} via ownerOf`);
                        }
                    } catch {
                        continue;
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error getting token balances:', error);
    }
    
    return foundTokens;
}

async function assignRolesBasedOnValue(nftVerificationContract, userAddress, nftAddress, count) {
    try {
        console.log(`Checking NFT mappings for address: ${nftAddress}`);
        const nftMapping = await nftVerificationContract.nftMappings(nftAddress);
        if (!nftMapping || !nftMapping.nftAddress) {
            console.log(`NFT ${nftAddress} not mapped in contract`);
            return { hasValueRole: false };
        }

        const mappedTokenId = nftMapping.tokenId;
        console.log(`Mapped token ID: ${mappedTokenId}, Is ERC1155: ${nftMapping.isERC1155}`);

        // Get value role configuration
        console.log(`Fetching value roles for NFT Address: ${nftAddress}`);
        try {
            const valueRoles = await nftVerificationContract.nftValueRoles(nftAddress, mappedTokenId);
            if (!valueRoles || !valueRoles.roleName) {
                console.log(`No value roles configured for NFT ${nftAddress}`);
                return { hasValueRole: false };
            }

            console.log(`Role Name: ${valueRoles.roleName}`);
            console.log(`Required Value: ${valueRoles.requiredValue}`);

            // Initialize NFT contract
            const nftContract = new ethers.Contract(
                nftAddress,
                nftMapping.isERC1155 ? ERC1155_ABI : ERC721_ABI,
                nftVerificationContract.provider
            );

            // Get owned tokens
            const ownedTokens = await getTokenBalances(
                nftContract, 
                userAddress, 
                nftMapping.isERC1155, 
                count,
                nftVerificationContract,
                nftAddress
            );
            console.log(`Found ${ownedTokens.length} owned tokens`);

            // Calculate total value
            let totalValue = 0;
            for (const token of ownedTokens) {
                try {
                    const tokenValue = await nftVerificationContract.nftValueMappings(nftAddress, token.tokenId);
                    if (tokenValue.gt(0)) {
                        const value = tokenValue.mul(token.balance).toNumber();
                        totalValue += value;
                        console.log(`Token ${token.tokenId}: Count=${token.balance}, Value=${tokenValue}, Total=${value}`);
                    }
                } catch (error) {
                    console.log(`No value mapping for token ${token.tokenId}`);
                    continue;
                }
            }

            console.log(`Final total value: ${totalValue}, Required: ${valueRoles.requiredValue}`);

            return {
                hasValueRole: true,
                roleName: valueRoles.roleName,
                requiredValue: valueRoles.requiredValue.toNumber(),
                totalValue,
                isEligible: totalValue >= valueRoles.requiredValue.toNumber()
            };

        } catch (error) {
            if (error.message.includes('execution reverted')) {
                console.log('No value roles registered for this NFT');
                return { hasValueRole: false };
            }
            throw error;
        }

    } catch (error) {
        console.error('Error checking value roles:', error);
        return { hasValueRole: false, error: error.message };
    }
}

module.exports = {
    assignRolesBasedOnValue
};
