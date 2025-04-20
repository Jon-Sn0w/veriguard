// SPDX-License-Identifier: MIT
// NFT Scanning Logic for ERC-721 and ERC-1155 Tokens

import { ethersLib } from './ethersSetup.js';
import { NFT_ABI, ERC721_INTERFACE_ID, ERC721_ENUMERABLE_INTERFACE_ID, ERC1155_INTERFACE_ID } from './nftABIs.js';

// Helper function for delay
async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Get explorer URL based on network
function getExplorerUrl(provider) {
    return provider.connection.url.includes('songbird') 
        ? "https://songbird-explorer.flare.network"
        : "https://flare-explorer.flare.network";
}

// NFT Standard Detection
async function detectNFTStandard(collectionType, contractAddress, provider) {
    console.log(`Detecting standard for ${contractAddress} with hint: ${collectionType}`);
    const normalizedHint = typeof collectionType === 'string' ? collectionType.replace("-", "").toUpperCase() : "";
    console.log(`Normalized hint: "${normalizedHint}"`);
    if (!normalizedHint || normalizedHint.includes("ERC20")) {
        console.log(`${contractAddress} skipped as non-NFT (hint: ${collectionType})`);
        return null;
    }

    if (!ethersLib || !ethersLib.Contract) {
        console.error("Ethers library not fully initialized");
        return null;
    }

    const contract = new ethersLib.Contract(contractAddress, [
        'function supportsInterface(bytes4 interfaceId) view returns (bool)',
        'function ownerOf(uint256 tokenId) view returns (address)',
        'function balanceOf(address owner) view returns (uint256)',
        'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
    ], provider);
    try {
        // Check if contract is callable
        const code = await provider.getCode(contractAddress);
        if (code === '0x' || code === '0x0') {
            console.warn(`${contractAddress} has no code, likely not a contract`);
            return null;
        }

        const supports1155 = await contract.supportsInterface(ERC1155_INTERFACE_ID).catch(() => false);
        console.log(`Supports ERC-1155: ${supports1155}`);
        if (supports1155) return "ERC1155";

        const supports721 = await contract.supportsInterface(ERC721_INTERFACE_ID).catch(() => false);
        console.log(`Supports ERC-721: ${supports721}`);
        if (supports721) {
            const supportsEnumerable = await contract.supportsInterface(ERC721_ENUMERABLE_INTERFACE_ID).catch(() => false);
            console.log(`Supports ERC-721 Enumerable: ${supportsEnumerable}`);
            return supportsEnumerable ? "ERC721Enumerable" : "ERC721";
        }

        console.log(`${contractAddress} does not match ERC-721 or ERC-1155, checking hint`);
        return normalizedHint.includes("ERC721") ? "ERC721" : null;
    } catch (error) {
        console.warn(`Error detecting NFT standard for ${contractAddress}:`, error);
        console.log(`Falling back to hint: "${normalizedHint}"`);
        return normalizedHint.includes("ERC721") ? "ERC721" : null;
    }
}

// Fetch user balance and circulating supply from Blockscout API
async function fetchHolderData(walletAddress, contractAddress, explorerUrl) {
    const pageSize = 50; // API limit per page
    let page = 1;
    let userBalance = 0;
    let totalSupply = 0;

    try {
        while (true) {
            const url = `${explorerUrl}/api?module=token&action=getTokenHolders&contractaddress=${contractAddress}&page=${page}&offset=${pageSize}`;
            console.log(`Fetching token holders for ${contractAddress}, page ${page}: ${url}`);
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            const data = await response.json();

            if (!data.result || data.result.length === 0) break;

            data.result.forEach(holder => {
                const balance = parseInt(holder.value);
                totalSupply += balance;
                if (holder.address.toLowerCase() === walletAddress.toLowerCase()) {
                    userBalance = balance;
                }
            });

            if (data.result.length < pageSize) break;
            page++;
            await delay(500); // Rate limiting precaution
        }

        console.log(`User balance for ${contractAddress}: ${userBalance}, Total supply: ${totalSupply}`);
        return { userBalance, totalSupply: totalSupply > 0 ? totalSupply : 10000 }; // Default to 10000 if no holders
    } catch (error) {
        console.error(`Error fetching holder data for ${contractAddress}:`, error);
        return { userBalance: 0, totalSupply: 10000 }; // Fallback to default
    }
}

async function getTotalSupply(contractAddress, provider, collectionType) {
    const contract = new ethersLib.Contract(contractAddress, NFT_ABI, provider);
    try {
        if (collectionType === "ERC721Enumerable") {
            const supply = await contract.totalSupply();
            return supply.toNumber();
        }
        return 10000; // Default fallback for non-enumerable or ERC-1155
    } catch (error) {
        console.warn(`Failed to fetch totalSupply for ${contractAddress}:`, error);
        return 10000; // Fallback
    }
}

// Main fetchTokens function
export async function fetchTokens(walletAddress, totalSupply, batchSize, provider, contractAddress, tokenType, updateProgress) {
    try {
        const contract = new ethersLib.Contract(
            contractAddress,
            tokenType === 'ERC-721' ? ['function balanceOf(address) view returns (uint256)', 'function tokenOfOwnerByIndex(address, uint256) view returns (uint256)'] : ['function balanceOf(address, uint256) view returns (uint256)'],
            provider
        );

        const tokenIds = [];
        if (tokenType === 'ERC-721') {
            const balance = await contract.balanceOf(walletAddress);
            console.log(`Balance for ${walletAddress} on ${contractAddress}: ${balance}`);
            for (let i = 0; i < balance; i += batchSize) {
                const batchPromises = [];
                for (let j = i; j < Math.min(i + batchSize, balance); j++) {
                    batchPromises.push(contract.tokenOfOwnerByIndex(walletAddress, j));
                }
                const batchResults = await Promise.all(batchPromises);
                tokenIds.push(...batchResults.map(id => id.toString()));
                updateProgress(Math.round((i / balance) * 100));
            }
        } else {
            // ERC-1155
            for (let i = 0; i < totalSupply; i += batchSize) {
                const batchIds = Array.from({ length: Math.min(batchSize, totalSupply - i) }, (_, idx) => i + idx);
                const balances = await contract.balanceOf(walletAddress, batchIds);
                batchIds.forEach((id, idx) => {
                    if (balances[idx].gt(0)) tokenIds.push(id.toString());
                });
                updateProgress(Math.round((i / totalSupply) * 100));
            }
        }

        return tokenIds;
    } catch (error) {
        console.error(`Error fetching tokens for ${contractAddress}:`, error);
        throw error;
    }
}

async function fetchERC721EnumerableTokenIds(walletAddress, contractAddress, provider, updateProgressCallback) {
    if (!ethersLib || !ethersLib.Contract) {
        console.error("Ethers library not initialized properly");
        return [];
    }

    try {
        // Use provided ABI for Flare contract 0x998d984ecef10f632d0437c771e6c46f60623f4d
        const contractAbi = contractAddress.toLowerCase() === '0x998d984ecef10f632d0437c771e6c46f60623f4d' 
            ? [
                'function balanceOf(address owner) view returns (uint256)',
                'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
                'function supportsInterface(bytes4 interfaceId) view returns (bool)'
              ]
            : NFT_ABI;
        const contract = new ethersLib.Contract(contractAddress, contractAbi, provider);

        const supportsEnumerable = await contract.supportsInterface(ERC721_ENUMERABLE_INTERFACE_ID).catch(() => false);
        if (!supportsEnumerable) {
            console.warn(`Contract ${contractAddress} does not support ERC-721 Enumerable; falling back to non-enumerable scanning`);
            return await fetchERC721TokenIds(walletAddress, contractAddress, provider, 10000, 500, updateProgressCallback, null, getExplorerUrl(provider));
        }

        let balance;
        try {
            balance = await contract.balanceOf(walletAddress);
            console.log(`Balance for ${walletAddress} in ${contractAddress}: ${balance.toString()}`);
        } catch (error) {
            console.warn(`Failed to fetch balanceOf for ${contractAddress}:`, error);
            return await fetchERC721TokenIdsFromExplorer(walletAddress, contractAddress, getExplorerUrl(provider), provider);
        }

        if (!balance || typeof balance.toNumber !== 'function') {
            console.error(`Invalid balance response for ${contractAddress}:`, balance);
            return [];
        }
        const totalBalance = balance.toNumber();
        if (totalBalance === 0) {
            console.log(`No tokens owned by ${walletAddress} in ${contractAddress}`);
            return [];
        }

        const tokenIds = [];
        for (let i = 0; i < totalBalance; i++) {
            try {
                const tokenId = await contract.tokenOfOwnerByIndex(walletAddress, i);
                tokenIds.push(tokenId.toString());
                console.log(`Fetched token ${tokenId} at index ${i} for ${contractAddress}`);
                const progress = Math.round(((i + 1) / totalBalance) * 100);
                if (updateProgressCallback) updateProgressCallback(progress);
            } catch (error) {
                console.error(`Error fetching token at index ${i} for ${contractAddress}:`, error);
            }
            await delay(50);
        }

        console.log(`Fetched ${tokenIds.length} ERC-721 enumerable tokens for ${contractAddress} via on-chain`);
        return tokenIds;
    } catch (error) {
        console.error(`Error fetching ERC-721 enumerable tokens for ${contractAddress}:`, error);
        return [];
    }
}

async function fetchERC721TokenIds(walletAddress, contractAddress, provider, totalSupply, batchSize, updateProgressCallback, userBalance, explorerUrl) {
    const contract = new ethersLib.Contract(contractAddress, NFT_ABI, provider);
    const tokenIds = [];

    const { userBalance: apiBalance } = await fetchHolderData(walletAddress, contractAddress, explorerUrl);
    const effectiveBalance = userBalance !== null ? userBalance : apiBalance;
    if (effectiveBalance === 0) {
        console.log(`No tokens owned by ${walletAddress} in ${contractAddress}`);
        return tokenIds;
    }

    const effectiveTotalSupply = totalSupply > 0 ? totalSupply : 10000;
    const effectiveBatchSize = batchSize || 500;
    const totalBatches = Math.ceil(effectiveTotalSupply / effectiveBatchSize);

    for (let batch = 0; batch < totalBatches && tokenIds.length < effectiveBalance; batch++) {
        const startId = batch * effectiveBatchSize;
        const endId = Math.min(startId + effectiveBatchSize - 1, effectiveTotalSupply - 1);
        const ownerPromises = [];

        for (let tokenId = startId; tokenId <= endId && tokenIds.length < effectiveBalance; tokenId++) {
            ownerPromises.push(
                contract.ownerOf(tokenId)
                    .then(owner => ({ tokenId, owner }))
                    .catch(() => ({ tokenId, owner: null }))
            );
        }

        const results = await Promise.all(ownerPromises);
        for (const { tokenId, owner } of results) {
            if (owner && owner.toLowerCase() === walletAddress.toLowerCase()) {
                tokenIds.push(tokenId.toString());
                if (tokenIds.length >= effectiveBalance) break;
            }
        }

        const progress = Math.round((tokenIds.length / effectiveBalance) * 100);
        if (updateProgressCallback) updateProgressCallback(progress > 100 ? 100 : progress);
        if (batch < totalBatches - 1) await delay(100);
    }

    console.log(`Scanned ${tokenIds.length} ERC-721 tokens for ${contractAddress} (target balance: ${effectiveBalance})`);
    return tokenIds;
}

async function fetchERC721TokenIdsFromExplorer(walletAddress, contractAddress, explorerUrl, provider) {
    let tokenIds = new Set();
    let page = 1;
    const pageSize = 100;
    const maxPages = 10; // Limit to prevent excessive pagination

    // Primary method: tokennfttx
    try {
        while (page <= maxPages) {
            const url = `${explorerUrl}/api?module=account&action=tokennfttx&address=${walletAddress}&contractaddress=${contractAddress}&page=${page}&offset=${pageSize}`;
            console.log(`Fetching ERC-721 token transfers for ${contractAddress}, page ${page}: ${url}`);
            const response = await fetch(url);
            const data = await response.json();
            if (data.status !== "1") throw new Error(`API error: ${data.message}`);

            const transfers = data.result || [];
            console.log(`Fetched ${transfers.length} transfers for page ${page}`);

            transfers.forEach(tx => {
                const tokenId = tx.tokenID;
                const fromAddr = tx.from.toLowerCase();
                const toAddr = tx.to.toLowerCase();
                const walletLower = walletAddress.toLowerCase();

                if (toAddr === walletLower) {
                    tokenIds.add(tokenId);
                    console.log(`Added token ${tokenId} (Transfer to ${walletAddress})`);
                } else if (fromAddr === walletLower) {
                    tokenIds.delete(tokenId);
                    console.log(`Removed token ${tokenId} (Transfer from ${walletAddress})`);
                }
            });

            if (transfers.length < pageSize) break;
            page++;
            await delay(500);
        }

        tokenIds = Array.from(tokenIds);
        console.log(`Fetched ${tokenIds.length} ERC-721 tokens via tokennfttx for ${contractAddress}:`, tokenIds);

        // Verify ownership on-chain
        if (tokenIds.length > 0) {
            const contract = new ethersLib.Contract(contractAddress, [
                'function ownerOf(uint256 tokenId) view returns (address)',
            ], provider);
            const verifiedTokens = [];
            for (let i = 0; i < tokenIds.length; i++) {
                const tokenId = tokenIds[i];
                try {
                    const owner = await contract.ownerOf(tokenId);
                    if (owner.toLowerCase() === walletAddress.toLowerCase()) {
                        verifiedTokens.push(tokenId);
                        console.log(`Token ${tokenId} verified as owned by ${walletAddress}`);
                    } else {
                        console.log(`Token ${tokenId} not owned by ${walletAddress} (Owner: ${owner})`);
                    }
                } catch (error) {
                    console.warn(`Failed to verify ownership of token ${tokenId} for ${contractAddress}:`, error);
                }
            }
            tokenIds = verifiedTokens;
            console.log(`Verified ${tokenIds.length} tokens for ${contractAddress}:`, tokenIds);
        }

        if (tokenIds.length > 0) {
            return tokenIds;
        }
    } catch (error) {
        console.warn(`tokennfttx API failed for ${contractAddress}:`, error);
    }

    // Fallback: tokenlist (limited to maxPages)
    page = 1;
    try {
        while (page <= maxPages) {
            const url = `${explorerUrl}/api?module=account&action=tokenlist&address=${walletAddress}&page=${page}&offset=${pageSize}`;
            console.log(`Fetching token list for ${contractAddress}, page ${page}: ${url}`);
            const response = await fetch(url);
            const data = await response.json();
            if (data.status !== "1") throw new Error(`API error: ${data.message}`);

            const tokens = data.result || [];
            console.log(`Fetched ${tokens.length} tokens for page ${page}`);
            for (const token of tokens) {
                if (token.contractAddress.toLowerCase() === contractAddress.toLowerCase()) {
                    const balance = parseInt(token.balance);
                    if (balance > 0) {
                        console.log(`Found balance ${balance} for ${contractAddress}, proceeding to on-chain scan`);
                        return []; // Trigger on-chain fallback
                    }
                }
            }

            if (tokens.length < pageSize) break;
            page++;
            await delay(500);
        }
    } catch (error) {
        console.warn(`tokenlist API failed for ${contractAddress}:`, error);
    }

    console.log(`No tokens found via explorer for ${contractAddress}, falling back to on-chain`);
    return [];
}

async function fetchERC721Tokens(walletAddress, totalSupply, batchSize, provider, contractAddress, updateProgressCallback) {
    const contract = new ethersLib.Contract(contractAddress, NFT_ABI, provider);
    const tokenIds = [];
    const totalBatches = Math.ceil(totalSupply / batchSize);

    for (let batch = 0; batch < totalBatches; batch++) {
        const startId = batch * batchSize;
        const endId = Math.min(startId + batchSize - 1, totalSupply - 1);
        const ownerPromises = [];

        for (let tokenId = startId; tokenId <= endId; tokenId++) {
            ownerPromises.push(
                contract.ownerOf(tokenId)
                    .then(owner => ({ tokenId, owner }))
                    .catch(() => ({ tokenId, owner: null }))
            );
        }

        const results = await Promise.all(ownerPromises);
        for (const { tokenId, owner } of results) {
            if (owner && owner.toLowerCase() === walletAddress.toLowerCase()) {
                tokenIds.push(tokenId.toString());
            }
        }

        const progress = Math.round(((batch + 1) / totalBatches) * 100);
        if (updateProgressCallback) updateProgressCallback(progress);
        if (batch < totalBatches - 1) await delay(100);
    }

    console.log(`Scanned ${tokenIds.length} ERC-721 tokens for ${contractAddress} on-chain`);
    return tokenIds;
}

async function fetchERC1155Tokens(walletAddress, totalSupply, batchSize, provider, contractAddress, updateProgressCallback) {
    const contract = new ethersLib.Contract(contractAddress, NFT_ABI, provider);
    const tokenIds = [];
    const effectiveTotalSupply = totalSupply > 0 ? totalSupply : 10000;
    const effectiveBatchSize = batchSize || 500;
    const totalBatches = Math.ceil(effectiveTotalSupply / effectiveBatchSize);

    for (let batch = 0; batch < totalBatches; batch++) {
        const startId = batch * effectiveBatchSize + 1;
        const endId = Math.min(startId + effectiveBatchSize - 1, effectiveTotalSupply);
        const ids = Array.from({ length: endId - startId + 1 }, (_, i) => startId + i);
        const accounts = Array(ids.length).fill(walletAddress);

        let retries = 3;
        while (retries > 0) {
            try {
                const balances = await contract.balanceOfBatch(accounts, ids);
                balances.forEach((balance, index) => {
                    if (balance.gt(0)) {
                        tokenIds.push({ id: ids[index].toString(), balance: balance.toString() });
                    }
                });
                break;
            } catch (error) {
                console.error(`Error fetching batch ${batch} for ${contractAddress} (retry ${4 - retries}):`, error);
                retries--;
                if (retries === 0) {
                    console.warn(`Falling back to individual balance checks for batch ${batch}`);
                    for (const id of ids) {
                        try {
                            const balance = await contract.balanceOf(walletAddress, id);
                            if (balance.gt(0)) {
                                tokenIds.push({ id: id.toString(), balance: balance.toString() });
                            }
                        } catch (innerError) {
                            console.error(`Error fetching balance for token ${id}:`, innerError);
                        }
                    }
                }
                await delay(1000);
            }
        }

        const progress = Math.round(((batch + 1) / totalBatches) * 100);
        if (updateProgressCallback) updateProgressCallback(progress);
        if (batch < totalBatches - 1) await delay(100);
    }

    console.log(`Fetched ${tokenIds.length} ERC-1155 tokens for ${contractAddress} on-chain`);
    return tokenIds;
}

// Export all necessary functions, excluding fetchTokens (already exported)
export {
    detectNFTStandard,
    fetchHolderData,
    fetchERC721EnumerableTokenIds,
    fetchERC721TokenIds,
    fetchERC1155Tokens,
    fetchERC721TokenIdsFromExplorer
};