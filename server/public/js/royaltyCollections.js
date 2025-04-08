// SPDX-License-Identifier: MIT
// royaltyCollections.js

import { ethers as ethersLib } from 'ethers'; // Use ethers@5.7.2
import { ROYALTY_ABI, COLLECTION_REGISTRY_ABI, NFT_ABI, FACTORY_ABI } from './nftABIs.js';
import { detectNFTStandard, fetchTokens, fetchHolderData } from './nftScanning.js';

const RoyaltyApp = window.RoyaltyApp || {};
window.RoyaltyApp = RoyaltyApp;

console.log('Ethers.js initialized from import:', ethersLib);

function initializeWithEthers(ethersInstance) {
 console.log('Initialized with ethers via initializeWithEthers:', ethersInstance);
}

RoyaltyApp.initializeWithEthers = initializeWithEthers;
console.log('RoyaltyApp.initializeWithEthers defined:', RoyaltyApp.initializeWithEthers);

// Global configuration and variables
const ETH_ADDRESS = "0x0000000000000000000000000000000000000000";
const SMALL_BATCH_SIZE = 5;
const RETRY_DELAY = 2000;
const MAX_RETRIES = 3;
const ITEMS_PER_PAGE = 20;
const BATCH_SIZE = 500;

const RPC_URL = 'https://songbird-api.flare.network/ext/bc/C/rpc';
const EXPLORER_URL = "https://songbird-explorer.flare.network";
const FACTORY_ADDRESS = "0xa3439487D3243a9Ff1F2D3a4f3bE9e95b235197B";
const COLLECTION_REGISTRY_ADDRESS = "0x77cF0ce459f7C83807b5850a857a27bBC5F1bc6a";
const SERVER_URL = 'https://veriguardnft.xyz';
const claimedTokens = new Set();

// Helper Functions
async function delay(ms) {
 return new Promise(resolve => setTimeout(resolve, ms));
}

async function initializeContract(contractAddress, provider = null) {
 if (!provider) {
 if (window.ethereum) {
 provider = new ethersLib.providers.Web3Provider(window.ethereum);
 await provider.send("eth_requestAccounts", []);
 } else {
 throw new Error("No Web3 provider detected. Please install a wallet like MetaMask.");
 }
 }
 const signer = provider.getSigner();
 return new ethersLib.Contract(contractAddress, ROYALTY_ABI, signer);
}

// Global State Management
const NFTState = {
    data: null,
    storageKey: 'nftState',
    tokenStorageKey: 'userTokens',
   
    initialize() {
    try {
    const savedState = this.loadFromStorage();
    const savedTokens = this.loadTokensFromStorage();
    if (savedState && savedTokens) {
    savedState.collections = this.mergeTokensWithCollections(savedState.collections, savedTokens);
    this.data = savedState;
    console.log("Restored NFT state and tokens from storage");
    } else {
    this.data = this.getInitialState();
    console.log("Initialized fresh NFT state");
    }
    return this.data;
    } catch (error) {
    console.error("Error initializing NFT state:", error);
    this.data = this.getInitialState();
    return this.data;
    }
    },
   
    getInitialState() {
    return {
    collections: new Map(),
    tokens: [],
    totalTokens: 0,
    eligibleTokens: [],
    lastUpdated: null,
    walletAddress: null
    };
    },
   
    getData() {
    if (!this.data) return this.initialize();
    return this.data;
    },
   
    setData(nftData, walletAddress = null) {
    try {
    if (!nftData) {
    console.error("Attempted to set null NFT data");
    return null;
    }
    this.data = {
    ...nftData,
    lastUpdated: Date.now(),
    walletAddress: walletAddress?.toLowerCase() || this.data?.walletAddress
    };
    this.saveToStorage();
    console.log("NFT State Updated:", this.data);
    return this.data;
    } catch (error) {
    console.error("Error setting NFT state:", error);
    return null;
    }
    },
   
    mergeTokensWithCollections(collections, savedTokens) {
    try {
    const mergedCollections = new Map(collections);
    if (!savedTokens || !this.data?.walletAddress) return mergedCollections;
   
    // Only merge tokens for the current wallet address
    const walletTokens = savedTokens[this.data.walletAddress] || {};
    for (const [address, tokenData] of Object.entries(walletTokens)) {
    if (mergedCollections.has(address)) {
    const collection = mergedCollections.get(address);
    collection.tokenIds = tokenData.tokenIds;
    collection.totalBalance = tokenData.tokenIds.length;
    collection.lastScanned = tokenData.lastScanned;
    collection.isScanned = true;
    mergedCollections.set(address, collection);
    }
    }
    return mergedCollections;
    } catch (error) {
    console.error("Error merging tokens with collections:", error);
    return collections;
    }
    },
   
    saveToStorage() {
    try {
    if (!this.data) return;
    const serializedData = {
    ...this.data,
    collections: Array.from(this.data.collections.entries()),
    lastUpdated: Date.now()
    };
    localStorage.setItem(this.storageKey, JSON.stringify(serializedData));
    console.log("NFT state saved to storage");
    } catch (error) {
    console.error("Error saving NFT state:", error);
    }
    },
   
    loadFromStorage() {
    try {
    const saved = localStorage.getItem(this.storageKey);
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    return {
    ...parsed,
    collections: new Map(parsed.collections)
    };
    } catch (error) {
    console.error("Error loading NFT state:", error);
    return null;
    }
    },
   
    saveTokens(contractAddress, tokenIds) {
    try {
    if (!contractAddress || !tokenIds || !this.data?.walletAddress) {
    console.error("Invalid parameters for saveTokens or walletAddress not set");
    return;
    }
    const savedTokens = this.loadTokensFromStorage() || {};
    // Initialize wallet-specific storage if it doesn't exist
    if (!savedTokens[this.data.walletAddress]) {
    savedTokens[this.data.walletAddress] = {};
    }
    savedTokens[this.data.walletAddress][contractAddress] = {
    tokenIds: tokenIds,
    lastScanned: Date.now(),
    walletAddress: this.data.walletAddress
    };
    localStorage.setItem(this.tokenStorageKey, JSON.stringify(savedTokens));
    console.log(`Saved ${tokenIds.length} tokens for contract ${contractAddress} for wallet ${this.data.walletAddress}`);
    } catch (error) {
    console.error("Error saving tokens:", error);
    }
    },
   
    loadTokensFromStorage() {
    try {
    const saved = localStorage.getItem(this.tokenStorageKey);
    if (!saved) return null;
    const tokens = JSON.parse(saved);
    return tokens;
    } catch (error) {
    console.error("Error loading tokens:", error);
    return null;
    }
    },
   
    clearStorage() {
    try {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.tokenStorageKey);
    this.data = this.getInitialState();
    console.log("NFT state and tokens cleared from storage");
    } catch (error) {
    console.error("Error clearing NFT storage:", error);
    }
    },
   
    updateCollection(contractAddress, collectionData) {
    try {
    if (!this.data || !contractAddress || !collectionData) return;
    const collections = this.data.collections;
    collections.set(contractAddress.toLowerCase(), collectionData);
    this.setData({ ...this.data, collections });
    } catch (error) {
    console.error("Error updating collection:", error);
    }
    },
   
    getCollection(contractAddress) {
    try {
    if (!this.data || !contractAddress) return null;
    return this.data.collections.get(contractAddress.toLowerCase()) || null;
    } catch (error) {
    console.error("Error getting collection:", error);
    return null;
    }
    },
   
    // New method to clear token data for a specific wallet
    clearTokensForWallet(walletAddress) {
    try {
    const savedTokens = this.loadTokensFromStorage() || {};
    if (savedTokens[walletAddress]) {
    delete savedTokens[walletAddress];
    localStorage.setItem(this.tokenStorageKey, JSON.stringify(savedTokens));
    console.log(`Cleared token data for wallet ${walletAddress}`);
    }
    // Reset token-related fields in collections
    if (this.data && this.data.collections) {
    this.data.collections.forEach(collection => {
    collection.tokenIds = [];
    collection.totalBalance = 'Not scanned';
    collection.isScanned = false;
    collection.lastScanned = null;
    });
    this.setData(this.data);
    }
    } catch (error) {
    console.error("Error clearing tokens for wallet:", error);
    }
    }
   };

   const scanProgress = {
    current: 0,
    total: 100,
    update(percentage) {
    try {
    const newValue = Math.round(percentage); // Ensure integer values
    if (newValue > this.current) { // Only update if progress increases
    this.current = newValue;
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-percentage');
    if (progressBar && progressText) {
    progressBar.style.width = `${this.current}%`;
    progressText.textContent = `${this.current}%`;
    }
    }
    } catch (error) {
    console.error('Error updating progress:', error);
    }
    }
   };


const eligibilityCache = new Map();

async function getDistributorAddress(provider, contractAddress) {
 const contract = new ethersLib.Contract(COLLECTION_REGISTRY_ADDRESS, COLLECTION_REGISTRY_ABI, provider);
 try {
 return await contract.getDistributor(contractAddress);
 } catch (error) {
 console.warn(`Failed to fetch distributor for ${contractAddress}:`, error);
 return "0x0000000000000000000000000000000000000000";
 }
}

async function isCollectionRegistered(provider, collectionAddress) {
 try {
 const registryContract = new ethersLib.Contract(COLLECTION_REGISTRY_ADDRESS, COLLECTION_REGISTRY_ABI, provider);
 const isRegistered = await registryContract.isRegistered(collectionAddress);
 console.log(`Is ${collectionAddress} registered on Songbird? ${isRegistered}`);
 return isRegistered;
 } catch (error) {
 console.error(`Error checking registration for ${collectionAddress}:`, error);
 return false;
 }
}

async function initializeApp() {
 console.log("Initializing NFT scanner...");
 try {
 const state = NFTState.getData();
 if (!state.collections.size) {
 NFTState.initialize();
 console.log("Initialized fresh NFT state in initializeApp");
 } else {
 const savedTokens = NFTState.loadTokensFromStorage();
 if (savedTokens) {
 for (const [contractAddr, tokenData] of Object.entries(savedTokens)) {
 const collection = state.collections.get(contractAddr.toLowerCase());
 if (collection && tokenData.walletAddress === state.walletAddress) {
 collection.tokenIds = tokenData.tokenIds;
 collection.totalBalance = tokenData.tokenIds.length;
 collection.isScanned = true;
 state.collections.set(contractAddr.toLowerCase(), collection);
 }
 }
 NFTState.setData(state);
 }
 console.log("Using existing NFT state with cached balances:", state);
 }
 setupNotificationSystem();
 console.log("NFT scanner initialization complete");
 } catch (error) {
 console.error("Error during app initialization:", error);
 showNotification("Failed to initialize application: " + error.message, "error");
 }
}

async function handleWalletConnection(provider, accounts) {
    const network = await provider.getNetwork();
    if (network.chainId !== 19) {
    showNotification("Please switch to Songbird network to use this app", "error");
    return;
    }
    const walletDisplay = document.getElementById("wallet-display");
    const connectedWallet = document.getElementById("connected-wallet");
    const connectButton = document.getElementById("connect-wallet");
    const royaltySection = document.getElementById("royalty-section");
    const heroArt = document.querySelector('.hero-art');
   
    if (accounts.length > 0) {
    const walletAddress = accounts[0].toLowerCase();
    const currentWallet = NFTState.getData()?.walletAddress;
   
    // Check if the wallet has changed
    if (currentWallet && currentWallet !== walletAddress) {
    console.log(`Wallet changed from ${currentWallet} to ${walletAddress}, clearing token data`);
    NFTState.clearTokensForWallet(currentWallet);
    }
   
    connectedWallet.textContent = walletAddress;
    walletDisplay.classList.remove("hidden");
    connectButton.classList.add("hidden");
    heroArt.classList.add('no-text');
    await loadCollections(walletAddress, EXPLORER_URL, provider);
    royaltySection.classList.add("scanned");
    initializeEventListeners(provider);
    } else {
    walletDisplay.classList.add("hidden");
    connectButton.classList.remove("hidden");
    royaltySection.classList.remove("scanned");
    }
   }

   async function connectWallet() {
    console.log("Setting up wallet connection...");
    const connectButton = document.getElementById("connect-wallet");
    const connectSpinner = document.getElementById("connect-spinner");
   
    if (!connectButton || !connectSpinner) {
    console.error("Required DOM elements not found");
    return;
    }
   
    const connectHandler = async () => {
    console.log("Connect wallet button clicked");
    connectSpinner.classList.add('active');
    let provider;
    try {
    if (!window.ethereum) {
    showNotification("No Web3 provider detected. Please install a wallet like MetaMask.", "error");
    return;
    }
   
    console.log("Browser wallet detected, using MetaMask...");
    provider = new ethersLib.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const network = await provider.getNetwork();
    if (network.chainId !== 19) {
    try {
    await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0x13' }],
    });
    } catch (switchError) {
    if (switchError.code === 4902) {
    // Chain not added, add Songbird
    await window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [{
    chainId: '0x13',
    chainName: 'Songbird',
    nativeCurrency: {
    name: 'Songbird',
    symbol: 'SGB',
    decimals: 18
    },
    rpcUrls: ['https://songbird-api.flare.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://songbird-explorer.flare.network']
    }],
    });
    } else {
    throw switchError;
    }
    }
    }
   
    const accounts = await provider.send("eth_accounts", []);
    console.log("Connected accounts:", accounts);
    await handleWalletConnection(provider, accounts);
    } catch (error) {
    console.error("Wallet connection error:", error);
    showNotification("Wallet connection failed: " + error.message, "error");
    } finally {
    connectSpinner.classList.remove('active');
    }
    };
   
    connectButton.addEventListener("click", () => {
    console.log("Button clicked, triggering connectHandler");
    connectHandler().catch(error => console.error("Connect handler error:", error));
    });
    console.log("Listener attached to connect-wallet button");
   
    try {
    if (window.ethereum) {
    let provider = new ethersLib.providers.Web3Provider(window.ethereum); // Declare provider with let
    const accounts = await provider.send("eth_accounts", []);
    if (accounts.length > 0) {
    console.log("Auto-connecting with existing wallet...");
    await handleWalletConnection(provider, accounts);
    }
    }
    } catch (error) {
    console.error("Auto-connect failed:", error);
    }
   }

   async function loadCollections(walletAddress, explorerUrl, provider) {
    const status = document.getElementById("scan-status");
    const scanProgressDiv = document.getElementById("scan-progress");
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-percentage");
    
    if (status) status.textContent = "Fetching NFT collections from explorer...";
    if (scanProgressDiv) scanProgressDiv.classList.remove("hidden");
    if (progressBar && progressText) {
    progressBar.style.width = "0%";
    progressText.textContent = "0%";
    }
    
    try {
    let allCollections = new Map();
    let totalCollections = 0;
    let pagesProcessed = 0;
    let totalTokensProcessed = 0;
    let totalTokensEstimate = 0;
    
    const pageSize = 100;
    let page = 1;
    let previousCollectionCount = 0;
    
    while (true) {
    const fetchPhaseMax = 30;
    const tokenListUrl = `${explorerUrl}/api?module=account&action=tokenlist&address=${walletAddress}&page=${page}&offset=${pageSize}`;
    console.log(`Fetching token list: ${tokenListUrl}`);
    scanProgress.update(Math.round((pagesProcessed / (pagesProcessed + 1)) * fetchPhaseMax)); // Incremental fetch progress
    const response = await fetch(tokenListUrl);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const tokenData = await response.json();
    
    if (tokenData.status !== "1" || !Array.isArray(tokenData.result)) {
    console.warn("Invalid token list response:", tokenData);
    break;
    }
    
    const tokensInPage = tokenData.result.length;
    console.log(`Total tokens in page ${page}: ${tokensInPage}`);
    pagesProcessed++;
    totalTokensProcessed += tokensInPage;
    
    if (page === 1 && tokensInPage > 0) {
    totalTokensEstimate = tokensInPage * 10;
    console.log(`Estimated total tokens: ${totalTokensEstimate}`);
    }
    
    const fetchProgress = Math.min(fetchPhaseMax, Math.round((pagesProcessed / Math.max(1, page)) * fetchPhaseMax));
    scanProgress.update(fetchProgress);
    console.log(`Sub-step 1: Fetch Progress ${fetchProgress}% (Page ${page})`);
    
    const filterPhaseMin = 30;
    const filterPhaseMax = 60;
    let nftCount = 0;
    const nftTokens = tokenData.result.filter(token => {
    const type = token.type || "";
    const isNFT = type === "ERC-721" || type === "ERC-1155";
    if (!isNFT) console.log(`Skipping ${token.contractAddress} (type: ${type})`);
    else console.log(`Found NFT: ${token.contractAddress} (type: ${type}, name: ${token.name || "Unnamed"})`);
    nftCount += isNFT ? 1 : 0;
    
    // Incremental filter progress
    const filterProgress = Math.round(filterPhaseMin + (nftCount / tokensInPage) * (filterPhaseMax - filterPhaseMin));
    if (nftCount % Math.max(1, Math.ceil(tokensInPage / 10)) === 0) {
    scanProgress.update(Math.min(filterPhaseMax, filterProgress));
    console.log(`Sub-step 2: Filter Progress ${filterProgress}% (Filtered ${nftCount}/${tokensInPage} tokens)`);
    }
    return isNFT;
    });
    console.log(`NFT tokens in page ${page}: ${nftTokens.length}`);
    
    const finalFilterProgress = Math.round(filterPhaseMin + (totalTokensProcessed / totalTokensEstimate) * (filterPhaseMax - filterPhaseMin));
    scanProgress.update(Math.min(filterPhaseMax, finalFilterProgress));
    console.log(`Sub-step 2: Filter Complete ${finalFilterProgress}% (Page ${page})`);
    
    const buildPhaseMin = 60;
    const buildPhaseMax = 70;
    let newCollections = 0;
    for (const token of nftTokens) {
    const contractAddr = token.contractAddress.toLowerCase();
    if (allCollections.has(contractAddr)) continue;
    
    const name = token.name || `Collection ${contractAddr.slice(0, 6)}`;
    const type = token.type === "ERC-721" ? "ERC-721" : "ERC-1155";
    const isRegistered = await isCollectionRegistered(provider, contractAddr);
    const distributorAddress = isRegistered ? await getDistributorAddress(provider, contractAddr) : "0x0000000000000000000000000000000000000000";
    
    allCollections.set(contractAddr, {
    name,
    contractAddress: contractAddr,
    totalSupply: token.totalSupply ? parseInt(token.totalSupply) : 1000,
    type,
    distributorAddress,
    isRegistered,
    tokenIds: [],
    totalBalance: 'Not scanned',
    isScanned: false
    });
    
    totalCollections++;
    newCollections++;
    
    // Incremental build progress
    const buildProgress = Math.round(buildPhaseMin + (newCollections / nftTokens.length) * (buildPhaseMax - buildPhaseMin));
    scanProgress.update(Math.min(buildPhaseMax, buildProgress));
    console.log(`Sub-step 3: Build Progress ${buildProgress}% (Added collection ${contractAddr}, Total: ${totalCollections})`);
    }
    
    console.log(`Processed page ${page}, total NFT collections so far: ${allCollections.size}`);
    if (allCollections.size === previousCollectionCount) {
    console.log("No new collections found, stopping pagination.");
    break;
    }
    previousCollectionCount = allCollections.size;
    
    if (tokenData.result.length < pageSize) {
    console.log("Fewer tokens than page size, assuming end of list.");
    break;
    }
    page++;
    await delay(500);
    }
    
    const savePhaseMin = 70;
    const savePhaseMax = 90;
    scanProgress.update(savePhaseMin);
    console.log("Phase 2 : Save Start 70%");
    
    const nftData = {
    totalTokens: 0,
    tokens: [],
    collections: allCollections,
    eligibleTokens: []
    };
    
    NFTState.setData(nftData, walletAddress);
    scanProgress.update(savePhaseMax);
    console.log("Phase 2: Save Complete 90%");
    
    scanProgress.update(90);
    console.log("Phase 3: Display Start 90%");
    console.log("Displaying NFT collections...");
    await displayEnhancedNFTs(nftData, provider);
    scanProgress.update(100);
    console.log("Phase 3: Display Complete 100%");
    
    if (status) status.textContent = `Found ${allCollections.size} NFT collection${allCollections.size !== 1 ? 's' : ''}`;
    } catch (error) {
    console.error("Error loading collections:", error);
    if (status) {
    status.textContent = `Error loading collections: ${error.message}`;
    status.classList.add("text-red-400");
    }
    showNotification("Failed to load NFT collections: " + error.message, "error");
    } finally {
    scanProgress.update(100);
    setTimeout(() => {
    if (scanProgressDiv) scanProgressDiv.classList.add("hidden");
    if (progressBar && progressText) {
    progressBar.style.width = "0%";
    progressText.textContent = "0%";
    }
    }, 2000);
    }
   }
   
async function displayEnhancedNFTs(nftData, provider) {
    const royaltyList = document.getElementById("royalty-list");
    if (!royaltyList) {
        console.error("royalty-list element not found");
        return;
    }
    
    royaltyList.innerHTML = "";
    if (nftData.collections.size === 0) {
        royaltyList.innerHTML = '<div class="text-gray-400">No NFT collections found.</div>';
        console.log("No collections to display");
        return;
    }
    
    // Convert Map to array and sort: registered collections first
    const sortedCollections = Array.from(nftData.collections.entries())
        .sort((a, b) => {
            const [addrA, collectionA] = a;
            const [addrB, collectionB] = b;
            // Sort by isRegistered (true comes first), then by name alphabetically if desired
            if (collectionA.isRegistered === collectionB.isRegistered) {
                return collectionA.name.localeCompare(collectionB.name); // Optional: sort by name within groups
            }
            return collectionB.isRegistered - collectionA.isRegistered; // true (1) sorts before false (0)
        });

    // Render sorted collections
    sortedCollections.forEach(([contractAddress, collection]) => {
        const collectionElement = document.createElement("div");
        collectionElement.className = "collection-container bg-gray-800 p-4 rounded-lg mb-4";
        collectionElement.dataset.contractAddress = contractAddress;
        collectionElement.innerHTML = `
            <div class="flex justify-between items-center">
                <div>
                    <h3 class="text-lg font-semibold text-white">${collection.name}</h3>
                    <p class="text-sm text-gray-400">Contract: ${contractAddress}</p>
                    <p class="text-sm text-gray-400">Total Balance: ${collection.totalBalance || 'Not scanned'}</p>
                    <p class="text-sm text-gray-400">Distributor: ${collection.distributorAddress}</p>
                </div>
                <div class="flex gap-2">
                    <button class="scan-tokens bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors">Scan Tokens</button>
                    <button class="rescan-tokens hidden bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded text-sm transition-colors">Rescan</button>
                    <button class="toggle-tokens hidden bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors">Show Tokens</button>
                    ${collection.isRegistered ? '<span class="registered-badge text-green-500 ml-2">Registered</span>' : '<span class="unregistered-badge text-red-500 ml-2">Not registered</span>'}
                </div>
            </div>
            <div id="tokens-${contractAddress}" class="tokens-container hidden mt-4">
                <div class="claim-interface mt-4 p-4 bg-gray-900 rounded">
                    <div class="flex justify-between items-center mb-4">
                        <div class="flex space-x-2">
                            <button class="claim-selected-btn bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors hidden">Claim Selected</button>
                            <button class="claim-all-btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors ${collection.distributorAddress !== '0x0000000000000000000000000000000000000000' ? '' : 'hidden'}">Claim All</button>
                        </div>
                    </div>
                    <div class="claim-progress hidden">
                        <div class="flex justify-between mb-1">
                            <span class="text-sm text-gray-300">Claiming Progress</span>
                            <span class="text-sm text-gray-300 progress-percentage">0%</span>
                        </div>
                        <div class="w-full bg-gray-700 rounded-full h-2.5">
                            <div class="bg-green-600 h-2.5 rounded-full transition-all duration-300 progress-bar" style="width: 0%"></div>
                        </div>
                    </div>
                </div>
                <div class="token-list mt-4"></div>
                <div class="pagination flex justify-between items-center mt-4">
                    <button class="prev-page bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm transition-colors">Previous</button>
                    <span class="text-sm text-gray-300">Page <span class="current-page">1</span> of <span class="total-pages">1</span></span>
                    <button class="next-page bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm transition-colors">Next</button>
                </div>
            </div>
        `;
        royaltyList.appendChild(collectionElement);
        
        const scanButton = collectionElement.querySelector('.scan-tokens');
        const rescanButton = collectionElement.querySelector('.rescan-tokens');
        const toggleButton = collectionElement.querySelector('.toggle-tokens');
        
        scanButton.addEventListener('click', async () => {
            await scanCollectionTokens(contractAddress, collection, collectionElement, provider);
            rescanButton.classList.remove('hidden');
            toggleButton.classList.remove('hidden');
        });
        
        rescanButton.addEventListener('click', async () => {
            await rescanCollectionTokens(contractAddress, collection, collectionElement, provider);
        });
        
        toggleButton.addEventListener('click', async () => {
            await toggleTokenDisplay(contractAddress, provider);
        });
        
        if (collection.isScanned) {
            scanButton.classList.add('hidden');
            rescanButton.classList.remove('hidden');
            toggleButton.classList.remove('hidden');
            updateCollectionUI(collection, collectionElement);
        }
    });
    
    console.log(`Displayed ${sortedCollections.length} collection cards in royalty-list`);
}

async function scanCollectionTokens(contractAddress, collection, collectionElement, provider) {
    const scanButton = collectionElement.querySelector('.scan-tokens');
    const rescanButton = collectionElement.querySelector('.rescan-tokens');
    const toggleButton = collectionElement.querySelector('.toggle-tokens');

    scanButton.disabled = true;
    scanButton.textContent = "Scanning...";

    const progressContainer = document.createElement('div');
    progressContainer.className = 'scan-progress hidden mt-2';
    progressContainer.innerHTML = `
        <div class="flex justify-between mb-1">
            <span class="text-sm text-gray-300">Scanning Progress</span>
            <span class="text-sm text-gray-300 progress-percentage">0%</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-2.5">
            <div class="bg-green-600 h-2.5 rounded-full transition-all duration-300 progress-bar" style="width: 0%"></div>
        </div>
    `;
    collectionElement.appendChild(progressContainer);
    progressContainer.classList.remove('hidden');

    const updateProgress = (percent) => {
        const progressBar = progressContainer.querySelector('.progress-bar');
        const progressText = progressContainer.querySelector('.progress-percentage');
        progressBar.style.width = `${percent}%`;
        progressText.textContent = `${percent}%`; // Fixed: Changed "text Content" to "textContent"
    };

    try {
        const savedTokens = NFTState.loadTokensFromStorage();
        const currentWallet = (await provider.getSigner().getAddress()).toLowerCase();
        const walletTokens = savedTokens?.[currentWallet] || {};
        const tokenData = walletTokens[contractAddress];

        const CACHE_EXPIRATION_MS = 30 * 60 * 1000;
        if (tokenData && 
            tokenData.walletAddress === currentWallet && 
            Date.now() - tokenData.lastScanned < CACHE_EXPIRATION_MS) {
            
            collection.tokenIds = tokenData.tokenIds;
            collection.totalBalance = tokenData.tokenIds.length;
            collection.lastScanned = tokenData.lastScanned;
            collection.isScanned = true;

            updateCollectionUI(collection, collectionElement);
            showNotification(`Loaded ${tokenData.tokenIds.length} tokens from cache`, 'success');
        } else {
            const walletAddress = await provider.getSigner().getAddress();

            const tokenIds = await fetchTokens(
                walletAddress,
                collection.totalSupply,
                BATCH_SIZE,
                provider,
                contractAddress,
                collection.type,
                updateProgress
            );

            collection.tokenIds = tokenIds;
            collection.totalBalance = tokenIds.length;
            collection.lastScanned = Date.now();
            collection.isScanned = true;

            NFTState.saveTokens(contractAddress, tokenIds);
            updateCollectionUI(collection, collectionElement);
            showNotification(`Found ${tokenIds.length} tokens for ${collection.name}`, 'success');
        }

        scanButton.classList.add('hidden');
        rescanButton.classList.remove('hidden');
        toggleButton.classList.remove('hidden');

        const nftData = NFTState.getData();
        nftData.collections.set(contractAddress.toLowerCase(), collection);
        NFTState.setData(nftData);
    } catch (error) {
        console.error('Error scanning collection:', error);
        showNotification('Error scanning collection: ' + error.message, 'error');
        scanButton.disabled = false;
        scanButton.textContent = 'Retry Scan';
    } finally {
        scanButton.disabled = false;
        scanButton.textContent = 'Scan Tokens';
        setTimeout(() => {
            progressContainer.classList.add('hidden');
            const progressBar = progressContainer.querySelector('.progress-bar');
            const progressText = progressContainer.querySelector('.progress-percentage');
            if (progressBar && progressText) {
                progressBar.style.width = '0%';
                progressText.textContent = '0%';
            }
        }, 2000);
    }
}

async function rescanCollectionTokens(contractAddress, collection, collectionElement, provider) {
    const rescanButton = collectionElement.querySelector('.rescan-tokens');
    const toggleButton = collectionElement.querySelector('.toggle-tokens');

    rescanButton.disabled = true;
    rescanButton.textContent = "Rescanning...";

    const progressContainer = document.createElement('div');
    progressContainer.className = 'scan-progress hidden mt-2';
    progressContainer.innerHTML = `
        <div class="flex justify-between mb-1">
            <span class="text-sm text-gray-300">Rescanning Progress</span>
            <span class="text-sm text-gray-300 progress-percentage">0%</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-2.5">
            <div class="bg-green-600 h-2.5 rounded-full transition-all duration-300 progress-bar" style="width: 0%"></div>
        </div>
    `;
    collectionElement.appendChild(progressContainer);
    progressContainer.classList.remove('hidden');

    const updateProgress = (percent) => {
        const progressBar = progressContainer.querySelector('.progress-bar');
        const progressText = progressContainer.querySelector('.progress-percentage');
        progressBar.style.width = `${percent}%`;
        progressText.textContent = `${percent}%`; // Fixed: Ensure "textContent" is used
    };

    try {
        const walletAddress = (await provider.getSigner().getAddress()).toLowerCase();
        const currentWallet = NFTState.getData()?.walletAddress;

        // Ensure the wallet address matches the current wallet in NFTState
        if (currentWallet !== walletAddress) {
            console.log(`Wallet mismatch during rescan: expected ${currentWallet}, got ${walletAddress}. Clearing token data.`);
            NFTState.clearTokensForWallet(currentWallet);
            NFTState.setData(NFTState.getData(), walletAddress);
        }

        // Reset collection token data before rescanning
        collection.tokenIds = [];
        collection.totalBalance = 0;
        collection.isScanned = false;

        const tokenIds = await fetchTokens(
            walletAddress,
            collection.totalSupply,
            BATCH_SIZE,
            provider,
            contractAddress,
            collection.type,
            updateProgress
        );

        if (collection.type === "ERC-1155") {
            collection.tokenIds = tokenIds;
            collection.totalBalance = tokenIds.length;
        } else {
            collection.tokenIds = tokenIds;
            collection.totalBalance = tokenIds.length;
        }

        collection.lastScanned = Date.now();
        collection.isScanned = true;

        updateCollectionUI(collection, collectionElement);
        showNotification(`Rescanned ${collection.name}: Found ${tokenIds.length} tokens`, 'success');

        const nftData = NFTState.getData();
        nftData.collections.set(contractAddress.toLowerCase(), collection);
        NFTState.setData(nftData);
        NFTState.saveTokens(contractAddress, tokenIds);

        const tokenContainer = document.getElementById(`tokens-${contractAddress}`);
        if (tokenContainer && !tokenContainer.classList.contains('hidden')) {
            await displayTokenPage(contractAddress, 1, provider);
        }
    } catch (error) {
        console.error('Error rescanning collection:', error);
        showNotification('Error rescanning collection: ' + error.message, 'error');
        rescanButton.textContent = 'Retry Rescan';
    } finally {
        rescanButton.disabled = false;
        rescanButton.textContent = 'Rescan';
        setTimeout(() => {
            progressContainer.classList.add('hidden');
            const progressBar = progressContainer.querySelector('.progress-bar');
            const progressText = progressContainer.querySelector('.progress-percentage');
            if (progressBar && progressText) {
                progressBar.style.width = '0%';
                progressText.textContent = '0%';
            }
        }, 2000);
    }
}

async function toggleTokenDisplay(contractAddr, provider) {
    const nftData = NFTState.getData();
    const tokenContainer = document.getElementById(`tokens-${contractAddr}`);
    if (!tokenContainer) {
        console.error("Token container not found for:", contractAddr);
        return;
    }

    const button = tokenContainer.parentElement.querySelector('.toggle-tokens');
    const isHidden = tokenContainer.classList.contains('hidden');
    
    if (isHidden) {
        tokenContainer.classList.remove('hidden');
        button.textContent = 'Hide Tokens';
        const currentPage = parseInt(tokenContainer.dataset.currentPage) || 1;

        const collection = nftData.collections.get(contractAddr.toLowerCase());
        if (!collection) {
            console.error(`Collection not found for ${contractAddr}`);
            return;
        }

        if (collection.distributorAddress && collection.distributorAddress !== "0x0000000000000000000000000000000000000000") {
            try {
                console.log(`Initializing contract for ${collection.distributorAddress}`);
                const contract = await initializeContract(collection.distributorAddress, provider);

                // Fetch and process ERC20 payments (if applicable)
                const paymentTokens = await contract.getSupportedPaymentTokens();
                const validPaymentTokens = paymentTokens.filter(token => token !== ETH_ADDRESS);
                if (validPaymentTokens.length > 0) {
                    const tx = await contract.processAccumulatedERC20Payments(validPaymentTokens, { gasLimit: 1000000 });
                    console.log(`Transaction submitted: ${tx.hash}`);
                    await tx.wait();
                    console.log(`ERC20 state refreshed successfully for ${contractAddr}`);
                    showNotification('ERC20 payment data processed successfully', 'success');
                } else {
                    console.log(`No ERC20 tokens to process for ${contractAddr}`);
                }
            } catch (error) {
                console.error(`Error processing ERC20 payments for ${contractAddr}:`, error);
                showNotification(`Failed to process ERC20 payments: ${error.message}`, 'error');
                return;
            }
        } else {
            console.log(`No valid distributor address for ${contractAddr}, skipping ERC20 processing`);
            showNotification('No distributor contract associated with this collection', 'info');
        }

        // Always fetch fresh data
        await displayTokenPage(contractAddr, currentPage, provider);
    } else {
        tokenContainer.classList.add('hidden');
        button.textContent = 'Show Tokens';
    }
}

function updateCollectionUI(collection, collectionElement) {
 const balanceText = collectionElement.querySelector('p');
 balanceText.textContent = `Total Balance: ${collection.totalBalance}`;
 collectionElement.querySelector('.scan-tokens').classList.add('hidden');
 collectionElement.querySelector('.toggle-tokens').classList.remove('hidden');
 
 if (collection.lastScanned) {
 const lastScanned = new Date(collection.lastScanned).toLocaleString();
 const timeInfoSpan = document.createElement('span');
 timeInfoSpan.className = 'text-sm text-gray-400 ml-2';
 timeInfoSpan.textContent = `Last scanned: ${lastScanned}`;
 balanceText.appendChild(timeInfoSpan);
 }
}

async function getCurrentWallet(provider) {
 const signer = provider.getSigner();
 return await signer.getAddress();
}

async function displayTokenPage(contractAddr, page, provider) {
    const nftData = NFTState.getData();
    if (!nftData || !nftData.collections) {
        console.error("NFT data not initialized");
        return;
    }

    const collection = nftData.collections.get(contractAddr.toLowerCase());
    if (!collection) {
        console.error("Collection not found:", contractAddr);
        return;
    }

    const tokens = collection.tokenIds || [];
    const totalTokens = tokens.length;
    const totalPages = Math.ceil(totalTokens / ITEMS_PER_PAGE);
    page = Math.max(1, Math.min(page, totalPages));
    
    const startIdx = (page - 1) * ITEMS_PER_PAGE;
    const endIdx = Math.min(startIdx + ITEMS_PER_PAGE, totalTokens);
    const pageTokens = tokens.slice(startIdx, endIdx);

    const tokenContainer = document.getElementById(`tokens-${contractAddr}`);
    if (!tokenContainer) {
        console.error("Token container not found");
        return;
    }

    const tokenList = tokenContainer.querySelector('.token-list');
    
    if (!collection.distributorAddress || collection.distributorAddress === "0x0000000000000000000000000000000000000000") {
        tokenList.innerHTML = '<p class="text-gray-400 text-center">No RoyaltyDistributor associated with this collection</p>';
        return;
    }

    try {
        const contract = await initializeContract(collection.distributorAddress, provider);
        const erc721Token = await contract.erc721Token();
        if (erc721Token === "0x0000000000000000000000000000000000000000") {
            tokenList.innerHTML = '<p class="text-red-400 text-center">ERC721 token contract not set in RoyaltyDistributor.</p>';
            return;
        }

        const walletAddress = await provider.getSigner().getAddress();
        const paymentTokens = await contract.getSupportedPaymentTokens();
        if (paymentTokens.length === 0) {
            tokenList.innerHTML = '<p class="text-red-400 text-center">No supported payment tokens available.</p>';
            return;
        }

        const tokenSymbols = new Map();
        const validPaymentTokens = [];
        const actualBalances = new Map();
        for (const token of paymentTokens) {
            const isSupported = await contract.supportedPaymentTokens(token);
            if (isSupported) {
                validPaymentTokens.push(token);
                if (token === ETH_ADDRESS) {
                    tokenSymbols.set(token, "SGB");
                    const ethBalance = await provider.getBalance(collection.distributorAddress);
                    actualBalances.set(token, ethBalance);
                } else {
                    try {
                        const erc20Contract = new ethersLib.Contract(
                            token,
                            ["function symbol() view returns (string)", "function balanceOf(address) view returns (uint256)", "function decimals() view returns (uint8)"],
                            provider
                        );
                        const symbol = await erc20Contract.symbol();
                        const balance = await erc20Contract.balanceOf(collection.distributorAddress);
                        tokenSymbols.set(token, symbol);
                        actualBalances.set(token, balance);
                    } catch (error) {
                        console.warn(`Failed to fetch symbol or balance for ERC20 ${token}:`, error);
                        tokenSymbols.set(token, `${token.slice(0, 6)}...${token.slice(-4)}`);
                        actualBalances.set(token, ethersLib.BigNumber.from(0));
                    }
                }
            }
        }

        if (validPaymentTokens.length === 0) {
            tokenList.innerHTML = '<p class="text-red-400 text-center">No valid supported payment tokens available.</p>';
            return;
        }

        const currentEpochs = await Promise.all(validPaymentTokens.map(token => contract.epochCounter(token)));

        // Clear existing contract balances and any previous claim tip
        const existingBalances = tokenContainer.querySelector('.contract-balances');
        if (existingBalances) existingBalances.remove();
        const existingClaimTip = tokenContainer.querySelector('.claim-tip');
        if (existingClaimTip) existingClaimTip.remove();

        // Add the new claim tip message
        const claimTipHTML = '<div class="claim-tip text-yellow-400 text-sm mb-2">If claim fails, try claiming fewer token IDs at a time</div>';
        tokenList.insertAdjacentHTML('beforebegin', claimTipHTML);

        // Display only the latest balances
        let balanceHTML = '<div class="contract-balances text-gray-300 mb-4"><p>Contract Balances:</p>';
        let hasNonZeroBalance = false;
        for (const token of validPaymentTokens) {
            const balance = actualBalances.get(token);
            const symbol = tokenSymbols.get(token);
            let formattedBalance;
            if (token === ETH_ADDRESS) {
                formattedBalance = ethersLib.utils.formatEther(balance);
            } else {
                try {
                    const erc20Contract = new ethersLib.Contract(
                        token,
                        ["function decimals() view returns (uint8)"],
                        provider
                    );
                    const decimals = await erc20Contract.decimals();
                    formattedBalance = ethersLib.utils.formatUnits(balance, decimals);
                } catch (error) {
                    console.warn(`Failed to fetch decimals for ERC20 ${token}:`, error);
                    formattedBalance = ethersLib.utils.formatEther(balance) + " (unknown decimals)";
                }
            }
            if (parseFloat(formattedBalance) > 0) {
                hasNonZeroBalance = true;
            }
            balanceHTML += `<p>${symbol}: ${formattedBalance}</p>`;
        }

        balanceHTML += hasNonZeroBalance ? '</div>' : '<div class="contract-balances text-gray-300 mb-4"><p>No balances available</p></div>';
        tokenList.insertAdjacentHTML('beforebegin', balanceHTML);

        // Rest of the token display logic (unchanged)
        const tokenClaimStatuses = await Promise.all(
            pageTokens.map(async (token) => {
                const tokenId = token.id ? token.id : token;
                const lastClaimed = await Promise.all(
                    validPaymentTokens.map(async (token) => {
                        try {
                            return await contract.lastClaimedEpoch(tokenId, token);
                        } catch (error) {
                            console.warn(`Failed to fetch lastClaimedEpoch for token ${tokenId}, payment ${token}:`, error);
                            return ethersLib.BigNumber.from(0);
                        }
                    })
                );
                return { tokenId, lastClaimed };
            })
        );

        let tokenContent = '<div class="grid grid-cols-2 sm:grid-cols-3 gap-2">';
        if (pageTokens.length === 0) {
            tokenContent += '<p class="text-gray-400 text-center col-span-full">No tokens on this page</p>';
        } else {
            pageTokens.forEach((token) => {
                const tokenId = token.id ? token.id : token;
                const balanceText = token.balance ? ` (Balance: ${token.balance})` : "";
                const tokenStatus = tokenClaimStatuses.find(status => status.tokenId === tokenId);
                let claimTypes = [];
                for (let i = 0; i < validPaymentTokens.length; i++) {
                    if (currentEpochs[i].gt(tokenStatus.lastClaimed[i])) {
                        const tokenAddr = validPaymentTokens[i];
                        claimTypes.push(tokenSymbols.get(tokenAddr));
                    }
                }
                const isEligible = claimTypes.length > 0;

                let statusText = isEligible 
                    ? `<div class="text-green-400 text-xs text-center mt-1">Unclaimed (${claimTypes.join(', ')})</div>`
                    : '<div class="text-red-400 text-xs text-center mt-1">Claimed</div>';

                tokenContent += `
                    <div class="token-item bg-gray-900 p-3 rounded text-sm cursor-pointer hover:bg-gray-800 border border-gray-800 hover:border-blue-500" data-token-id="${tokenId}">
                        <div class="font-mono text-yellow-400 text-center">Token ID: ${tokenId}${balanceText}</div>
                        ${statusText}
                    </div>
                `;
            });
        }
        tokenContent += '</div>';

        tokenList.innerHTML = tokenContent;

        updatePagination(tokenContainer, page, totalPages);
        setupTokenHandlers(tokenContainer, contractAddr, page, totalPages, provider);
    } catch (error) {
        console.error("Error displaying token page for contract:", contractAddr, error);
        tokenList.innerHTML = `
            <p class="text-red-400 text-center">Failed to load tokens: ${error.message}</p>
            <button class="retry-btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm mt-2">Retry</button>
        `;
        tokenList.querySelector('.retry-btn').addEventListener('click', () => displayTokenPage(contractAddr, page, provider));
    }
}

// Helper function to get a readable label for ERC20 tokens
function getTokenLabel(tokenAddress) {
    return tokenAddress.slice(0, 6) + '...' + tokenAddress.slice(-4);
}

function updatePagination(container, currentPage, totalPages) {
 const prevButton = container.querySelector('.prev-page');
 const nextButton = container.querySelector('.next-page');
 const currentPageSpan = container.querySelector('.current-page');
 const totalPagesSpan = container.querySelector('.total-pages');

 if (prevButton) prevButton.disabled = currentPage <= 1;
 if (nextButton) nextButton.disabled = currentPage >= totalPages;
 if (currentPageSpan) currentPageSpan.textContent = currentPage;
 if (totalPagesSpan) totalPagesSpan.textContent = totalPages;

 container.dataset.currentPage = currentPage;
 container.dataset.totalPages = totalPages;
}

function setupTokenHandlers(container, contractAddr, page, totalPages, provider) {
 const prevButton = container.querySelector('.prev-page');
 const nextButton = container.querySelector('.next-page');

 if (prevButton) prevButton.onclick = () => page > 1 && displayTokenPage(contractAddr, page - 1, provider);
 if (nextButton) nextButton.onclick = () => page < totalPages && displayTokenPage(contractAddr, page + 1, provider);

 container.querySelectorAll('.token-item').forEach(token => {
 token.onclick = () => {
 token.classList.toggle('selected');
 updateClaimButtonVisibility(container);
 };
 });

 const claimSelectedBtn = container.querySelector('.claim-selected-btn');
 const claimAllBtn = container.querySelector('.claim-all-btn');

 if (claimSelectedBtn) {
 claimSelectedBtn.onclick = async () => {
 const selectedTokens = Array.from(container.querySelectorAll('.token-item.selected'))
 .map(token => token.dataset.tokenId)
 .filter(id => id);
 if (selectedTokens.length > 0) {
 console.log(`Claiming selected tokens: ${selectedTokens}`);
 await handleClaim(selectedTokens, container, contractAddr, provider);
 } else {
 showNotification("No tokens selected to claim", "info");
 }
 };
 }

 if (claimAllBtn) {
 claimAllBtn.onclick = async () => {
 const nftData = NFTState.getData();
 const collection = nftData.collections.get(contractAddr.toLowerCase());
 if (collection && collection.tokenIds.length > 0) {
 const startIdx = (page - 1) * ITEMS_PER_PAGE;
 const endIdx = Math.min(startIdx + ITEMS_PER_PAGE, collection.tokenIds.length);
 const pageTokens = collection.tokenIds.slice(startIdx, endIdx);
 const tokenIdsToClaim = pageTokens.map(token => token.id ? token.id : token);
 console.log(`Claiming all tokens on page ${page}: ${tokenIdsToClaim}`);
 await handleClaim(tokenIdsToClaim, container, contractAddr, provider);
 }
 };
 }
}

function updateClaimButtonVisibility(container) {
 const claimSelectedBtn = container.querySelector('.claim-selected-btn');
 const hasSelected = container.querySelectorAll('.token-item.selected').length > 0;
 if (claimSelectedBtn) claimSelectedBtn.classList.toggle('hidden', !hasSelected);
}

async function processBatch(tokenIds, contract, provider) {
    try {
        console.log("Processing batch of tokens:", tokenIds);
        const walletAddress = await contract.signer.getAddress();

        // Fetch all supported payment tokens dynamically
        const paymentTokens = await contract.getSupportedPaymentTokens();
        const validPaymentTokens = [];
        for (const token of paymentTokens) {
            const isSupported = await contract.supportedPaymentTokens(token);
            if (isSupported) {
                validPaymentTokens.push(token);
            } else {
                console.warn(`Payment token ${token} is not supported by the contract`);
            }
        }

        if (validPaymentTokens.length === 0) {
            throw new Error("No supported payment tokens available for this contract");
        }

        console.log("Valid payment tokens for claiming:", validPaymentTokens);

        // Fetch claimable tokens for all valid payment tokens
        const claimableTokens = await contract.getClaimableTokens(walletAddress, tokenIds);
        console.log("Claimable tokens:", claimableTokens);

        if (claimableTokens.length === 0) {
            console.log("No claimable tokens available");
            return false;
        }

        // Fetch lastKnownBalance for each payment token
        const balances = {};
        for (const token of validPaymentTokens) {
            const balance = await contract.lastKnownBalance(token);
            balances[token] = balance;
            console.log(`Contract balance for ${token}: ${balance.toString()}`);
        }

        // Fetch epochCounter and lastClaimedEpoch for each tokenId and payment token
        const epochData = {};
        for (const tokenId of tokenIds) {
            epochData[tokenId] = {};
            for (const token of validPaymentTokens) {
                const epochCounter = await contract.epochCounter(token);
                const lastClaimedEpoch = await contract.lastClaimedEpoch(tokenId, token);
                epochData[tokenId][token] = { epochCounter, lastClaimedEpoch };
                console.log(`Token ${tokenId}, Payment ${token} - Epoch: ${epochCounter}, Last Claimed: ${lastClaimedEpoch}`);
            }
        }

        // Verify ownership (assuming ERC721 for now; adjust if ERC1155 is needed)
        const erc721ContractAddress = await contract.erc721Token();
        const erc721Contract = new ethersLib.Contract(erc721ContractAddress, NFT_ABI, provider);
        for (const tokenId of tokenIds) {
            const owner = await erc721Contract.ownerOf(tokenId);
            if (owner.toLowerCase() !== walletAddress.toLowerCase()) {
                throw new Error(`Token ${tokenId} not owned by ${walletAddress}`);
            }
        }

        // Claim rewards for claimable tokens
        const formattedTokenIds = tokenIds.map(id => ethersLib.BigNumber.from(id));
        const tx = await contract.claimRewards(formattedTokenIds, claimableTokens); // Remove gasLimit

        console.log("Transaction submitted:", tx.hash);
        const receipt = await tx.wait();

        if (receipt.status === 1) {
            console.log("Claim successful!");
            tokenIds.forEach(id => {
                claimableTokens.forEach(token => eligibilityCache.delete(`${id}_${token}`));
                claimedTokens.add(id.toString());
            });
            localStorage.setItem('claimedTokens', JSON.stringify([...claimedTokens]));
            return true;
        } else {
            console.error("Claim failed with receipt:", receipt);
            return false;
        }
    } catch (error) {
        console.error("Detailed error in processBatch:", {
            message: error.message,
            reason: error.reason,
            data: error.data,
            txHash: error.transactionHash
        });
        throw error;
    }
}

async function handleClaim(tokenIds, container, contractAddr, provider) {
    const progressBar = container.querySelector('.progress-bar');
    const progressPercentage = container.querySelector('.progress-percentage');
    const progressContainer = container.querySelector('.claim-progress');

    try {
        progressContainer.classList.remove('hidden');
        progressBar.style.width = '10%';
        progressPercentage.textContent = '10%';

        const nftData = NFTState.getData();
        const collection = nftData.collections.get(contractAddr.toLowerCase());
        if (!collection || !collection.distributorAddress) throw new Error("No RoyaltyDistributor contract associated with this collection");

        const contract = await initializeContract(collection.distributorAddress, provider);
        console.log("Contract initialized for claiming:", collection.distributorAddress);

        // Batch token IDs to avoid gas limit issues
        const BATCH_SIZE = 10; // Conservative batch size
        let success = false;
        for (let i = 0; i < tokenIds.length; i += BATCH_SIZE) {
            const batch = tokenIds.slice(i, i + BATCH_SIZE);
            const batchSuccess = await processBatch(batch, contract, provider);
            success = success || batchSuccess;
            const progress = Math.min(100, ((i + batch.length) / tokenIds.length) * 100);
            progressBar.style.width = `${progress}%`;
            progressPercentage.textContent = `${progress}%`;
        }

        if (success) {
            showNotification(`Successfully claimed rewards for ${tokenIds.length} token${tokenIds.length > 1 ? 's' : ''}!`, "success");
            await displayTokenPage(contractAddr, parseInt(container.dataset.currentPage) || 1, provider);
        } else {
            showNotification("No new rewards available or claim failed", "info");
        }
    } catch (error) {
        console.error("Claim error:", error);
        let errorMessage = "Failed to claim rewards";
        if (error.message.includes("execution reverted")) {
            errorMessage = error.message.includes("No rewards available") 
                ? "No rewards available for the selected tokens"
                : "Transaction reverted: " + (error.reason || "unknown reason");
        } else if (error.reason) {
            errorMessage = error.reason;
        }
        showNotification(errorMessage, "error");
        progressBar.classList.add('bg-red-600');
    } finally {
        setTimeout(() => {
            progressContainer.classList.add('hidden');
            progressBar.style.width = '0%';
            progressPercentage.textContent = '0%';
            progressBar.classList.remove('bg-red-600');
        }, 3000);
    }
}

function initializeEventListeners(provider) {
 const nftData = NFTState.getData();
 if (!nftData || !nftData.collections) return;

 for (const [contractAddr, collection] of nftData.collections) {
 if (collection.distributorAddress && collection.distributorAddress !== "0x0000000000000000000000000000000000000000") {
 const contract = new ethersLib.Contract(collection.distributorAddress, ROYALTY_ABI, provider);
 contract.on('RoyaltyReceived', (token, amount, epoch) => {
 console.log(`Royalties received: ${amount} for ${token} at epoch ${epoch}`);
 const tokenContainer = document.getElementById(`tokens-${contractAddr}`);
 if (tokenContainer && !tokenContainer.classList.contains('hidden')) {
 const currentPage = parseInt(tokenContainer.dataset.currentPage) || 1;
 displayTokenPage(contractAddr, currentPage, provider);
 }
 });
 }
 }
}

function showNotification(message, type = 'info', txHash = null) {
 const notification = document.getElementById('notification');
 if (!notification) return;

 const messageEl = notification.querySelector('.message') || notification.querySelector('.notification-content');
 const txLinkEl = notification.querySelector('.tx-link');
 if (!messageEl) return;

 messageEl.textContent = message;

 if (txHash && txLinkEl) {
 const explorerUrl = EXPLORER_URL;
 txLinkEl.href = `${explorerUrl}/tx/${txHash}`;
 txLinkEl.textContent = 'View Transaction';
 txLinkEl.classList.remove('hidden');
 } else if (txLinkEl) {
 txLinkEl.classList.add('hidden');
 }

 notification.className = `notification ${
 type === 'error' ? 'bg-red-500' : 
 type === 'success' ? 'bg-green-500' : 
 'bg-blue-500'
 }`;

 notification.classList.add('show');
 setTimeout(() => notification.classList.remove('show'), 5000);
}

function handleError(error, context) {
 console.error(`${context} error:`, error);
 const status = document.getElementById("scan-status");
 if (status) {
 status.textContent = `Error: ${error.message}`;
 if (error.message.includes("rejected") || error.message.includes("User denied")) {
 status.textContent = "Connection rejected. Please approve the wallet connection to continue.";
 }
 status.classList.remove("text-green-400");
 status.classList.add("text-red-400");
 }
 showNotification(error.message, "error");
}

function setupNotificationSystem() {
 const notificationContainer = document.createElement('div');
 notificationContainer.id = 'notification';
 notificationContainer.className = 'notification hidden';
 notificationContainer.innerHTML = `
 <div class="notification-content"></div>
 <button class="notification-close absolute top-1 right-2 text-lg">×</button>
 `;
 document.body.appendChild(notificationContainer);
 
 const closeButton = notificationContainer.querySelector('.notification-close');
 if (closeButton) closeButton.addEventListener('click', () => notificationContainer.classList.remove('show'));
}

async function manageContractAction(contractAddress, functionName, args, provider) {
    console.log(`Executing ${functionName} on contract ${contractAddress} with args:`, args);
    try {
        const signer = provider.getSigner();
        const contract = new ethersLib.Contract(contractAddress, ROYALTY_ABI, signer);
        const owner = await contract.owner();
        const userAddress = await signer.getAddress();
        console.log(`Contract owner: ${owner}, User address: ${userAddress}`);
        if (owner.toLowerCase() !== userAddress.toLowerCase()) {
            throw new Error("Only the contract owner can perform this action");
        }

        let tx;
        if (functionName === "delegateToFTSO") {
            await delegateToFTSO(provider, contractAddress, args[0]);
            return;
        } else if (functionName === "claimFTSORewards") {
            tx = await contract.claimFTSORewards(); // Remove gasLimit
        } else if (functionName === "setFtsoRewardManager") {
            tx = await contract.setFtsoRewardManager(args[0]);
        } else if (functionName === "undelegateAll") {
            tx = await contract.undelegateAll();
        } else if (functionName === "setExecutor") {
            tx = await contract.setExecutor(args[0]);
        } else {
            tx = await contract[functionName](...args);
        }
        console.log(`Transaction submitted: ${tx.hash}`);
        await tx.wait();
        console.log(`${functionName} executed successfully on ${contractAddress}`);
        showNotification(`${functionName} executed successfully on ${contractAddress}`, 'success');
    } catch (error) {
        console.error(`Error executing ${functionName}:`, error);
        if (functionName === "claimFTSORewards" && 
            error.message.includes("execution reverted")) {
            showNotification("No FTSO rewards available to claim at this time", "info");
        } else {
            handleError(error, `Failed to execute ${functionName}`);
        }
        throw error; // Propagate error for caller to handle
    }
}

async function showAddCollectionForm(contractAddress, provider) {
    const addForm = document.createElement('div');
    addForm.className = 'bg-gray-800 p-6 rounded-lg mb-6';
    addForm.innerHTML = `
        <h2 class="text-lg font-bold mb-2">Add Collection to Contract</h2>
        <form id="add-collection-form">
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-300" for="collection-name">Collection Name</label>
                <input type="text" id="collection-name" class="w-full p-2 rounded bg-gray-700 text-white" required>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-300" for="collection-address">Collection Address</label>
                <input type="text" id="collection-address" class="w-full p-2 rounded bg-gray-700 text-white" required>
            </div>
            <div class="mb-4 text-yellow-400 text-sm" id="registration-info">
                <p><strong>Important:</strong> After registration, you must register all ERC-20 tokens in the RoyaltyDistributor contract (via "Manage Contracts") to be accepted as payment or distributed. Unregistered ERC-20 deposits won’t increment the epoch counter, leaving a stale balance. Native tokens (FLR or SGB) are pre-registered by default.</p>
            </div>
            <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Add Collection
            </button>
        </form>
    `;

    const deployForm = document.getElementById('deploy-form');
    const container = document.querySelector('.container.mx-auto.px-4.py-8.max-w-3xl') || document.body;
    if (deployForm) deployForm.insertAdjacentElement('afterend', addForm);
    else container.appendChild(addForm);

    addForm.querySelector('#add-collection-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const collectionName = document.getElementById('collection-name').value;
        const collectionAddress = document.getElementById('collection-address').value;

        try {
            const signer = provider.getSigner();
            const royaltyContract = new ethersLib.Contract(contractAddress, ROYALTY_ABI, signer);
            const tx1 = await royaltyContract.setTokenContract(collectionAddress);
            await tx1.wait();
            showNotification(`Token contract set on RoyaltyDistributor: ${collectionAddress}`, 'success');

            const registryContract = new ethersLib.Contract(COLLECTION_REGISTRY_ADDRESS, COLLECTION_REGISTRY_ABI, signer);
            const isRegistered = await registryContract.isRegistered(collectionAddress);
            if (!isRegistered) {
                const tx2 = await registryContract.registerCollection(collectionAddress, contractAddress);
                await tx2.wait();
                showNotification(`Collection registered on CollectionRegistry: ${collectionAddress}`, 'success');
            } else {
                showNotification(`Collection ${collectionAddress} already registered, updating distributor`, 'info');
                const tx2 = await registryContract.updateDistributor(collectionAddress, contractAddress);
                await tx2.wait();
                showNotification(`Distributor updated for ${collectionAddress}`, 'success');
            }

            await registerCollectionOnServer(collectionName, collectionAddress, contractAddress, "ERC721");
            showNotification('Collection registered on server', 'success');

            addForm.remove();
            await loadCollections(await signer.getAddress(), EXPLORER_URL, provider);
        } catch (error) {
            handleError(error, 'collection registration');
        }
    });
}

async function delegateToFTSO(provider, contractAddress, ftsoProviderAddress) {
    console.log(`Attempting to delegate to FTSO provider ${ftsoProviderAddress} for contract ${contractAddress}`);
    try {
        const signer = provider.getSigner();
        const royaltyContract = new ethersLib.Contract(contractAddress, ROYALTY_ABI, signer);
        const tx = await royaltyContract.setFtsoProvider(ftsoProviderAddress);
        console.log(`Transaction submitted: ${tx.hash}`);
        await tx.wait();
        console.log(`Delegated 100% WSGB to FTSO provider ${ftsoProviderAddress} for contract ${contractAddress}`);
        showNotification(`Delegated 100% WSGB to ${ftsoProviderAddress}`, "success");
    } catch (error) {
        console.error("Error delegating to FTSO:", error);
        showNotification("Failed to delegate WSGB: " + error.message, "error");
        throw error; // Propagate error for caller to handle
    }
}

function showManageContractsForm(provider) {
    console.log("Showing Manage Contracts form with provider:", provider);
    const existingForm = document.querySelector('.manage-contracts-form-container');
    if (existingForm) existingForm.remove();

    const manageForm = document.createElement('div');
    manageForm.className = 'manage-contracts-form-container bg-gray-800 p-6 rounded-lg mb-6';
    manageForm.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-bold">Manage Royalty Distributor Contracts</h2>
            <button id="close-manage-form" class="text-gray-400 hover:text-white">×</button>
        </div>
        <form id="manage-contracts-form">
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-300" for="contract-address">Royalty Distributor Address</label>
                <input type="text" id="contract-address" class="w-full p-2 rounded bg-gray-700 text-white" placeholder="Enter RoyaltyDistributor address">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-300">Actions</label>
                <div class="flex flex-wrap gap-2 mt-2">
                    <button type="button" id="add-payment-token-btn" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Payment Token</button>
                    <button type="button" id="remove-payment-token-btn" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Remove Payment Token</button>
                    <button type="button" id="withdraw-btn" class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">Emergency Withdrawal</button>
                    <button type="button" id="update-emergency-wallet-btn" class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">Update Emergency Wallet</button>
                    <button type="button" id="pause-btn" class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">Pause</button>
                    <button type="button" id="unpause-btn" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Unpause</button>
                    <button type="button" id="renounce-btn" class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">Renounce Ownership</button>
                    <button type="button" id="unregister-collection-btn" class="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded">Unregister Collection</button>
                    <button type="button" id="delegate-ftso-btn" class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded">Delegate to FTSO</button>
                    <button type="button" id="claim-ftso-rewards-btn" class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Claim FTSO Rewards</button>
                    <button type="button" id="set-reward-manager-btn" class="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded">Set Reward Manager</button>
                    <button type="button" id="undelegate-btn" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Undelegate</button>
                    <button type="button" id="set-executor-btn" class="bg-teal-600 hover:bg-teal-800 text-white font-bold py-2 px-4 rounded">Set Executor</button>
                </div>
            </div>
            <div id="payment-token-input" class="mb-4 hidden">
                <label class="block text-sm font-medium text-gray-300" for="payment-token">Payment Token Address</label>
                <input type="text" id="payment-token" class="w-full p-2 rounded bg-gray-700 text-white" placeholder="Enter ERC20 token address">
                <div id="wsgb-info" class="mt-2 text-yellow-400 text-sm hidden">
                    <p>If you wish to delegate WSGB or accept WSGB as payments, use this address: <strong>0x02f0826ef6aD107Cfc861152B32B52fD11BaB9ED</strong></p>
                </div>
            </div>
            <div id="emergency-wallet-input" class="mb-4 hidden">
                <label class="block text-sm font-medium text-gray-300" for="emergency-wallet-address">New Emergency Wallet Address</label>
                <input type="text" id="emergency-wallet-address" class="w-full p-2 rounded bg-gray-700 text-white" placeholder="Enter new emergency wallet address">
            </div>
            <div id="collection-address-input" class="mb-4 hidden">
                <label class="block text-sm font-medium text-gray-300" for="collection-address">NFT Collection Address</label>
                <input type="text" id="collection-address" class="w-full p-2 rounded bg-gray-700 text-white" placeholder="Enter NFT collection address to unregister">
            </div>
            <div id="ftso-provider-input" class="mb-4 hidden">
                <label class="block text-sm font-medium text-gray-300" for="ftso-provider">FTSO Provider Address</label>
                <input type="text" id="ftso-provider" class="w-full p-2 rounded bg-gray-700 text-white" placeholder="Enter FTSO provider address">
            </div>
            <div id="reward-manager-input" class="mb-4 hidden">
                <label class="block text-sm font-medium text-gray-300" for="reward-manager-address">New Reward Manager Address</label>
                <input type="text" id="reward-manager-address" class="w-full p-2 rounded bg-gray-700 text-white" placeholder="Enter new FTSO reward manager address">
            </div>
            <div id="executor-input" class="mb-4 hidden">
                <label class="block text-sm font-medium text-gray-300" for="executor-address">Executor Address</label>
                <input type="text" id="executor-address" class="w-full p-2 rounded bg-gray-700 text-white" placeholder="Enter executor address">
            </div>
            <div id="remove-token-warning" class="mb-4 hidden text-yellow-400 text-sm">
                <p><strong>Warning:</strong> Removing a payment token with a non-zero balance is not recommended. If the token is re-added later, it could result in double spends for users who have already claimed rewards. Ensure the token balance is empty before removal.</p>
            </div>
        </form>
    `;

    const deployForm = document.getElementById('deploy-form');
    const container = document.querySelector('.container.mx-auto.px-4.py-8.max-w-3xl') || document.body;
    if (deployForm) deployForm.insertAdjacentElement('afterend', manageForm);
    else container.insertBefore(manageForm, container.firstChild);

    const closeButton = manageForm.querySelector('#close-manage-form');
    if (closeButton) {
        console.log("Close button found, attaching listener");
        closeButton.addEventListener('click', () => manageForm.remove());
    } else {
        console.warn("Close button not found in manage form");
    }

    const form = manageForm.querySelector('#manage-contracts-form');
    if (!form) {
        console.error("Manage contracts form not found in DOM");
        return;
    }

    const contractAddressInput = form.querySelector('#contract-address');
    const paymentTokenInput = form.querySelector('#payment-token');
    const paymentTokenDiv = form.querySelector('#payment-token-input');
    const emergencyWalletInput = form.querySelector('#emergency-wallet-address');
    const emergencyWalletDiv = form.querySelector('#emergency-wallet-input');
    const collectionAddressInput = form.querySelector('#collection-address');
    const collectionAddressDiv = form.querySelector('#collection-address-input');
    const ftsoProviderInput = form.querySelector('#ftso-provider');
    const ftsoProviderDiv = form.querySelector('#ftso-provider-input');
    const rewardManagerInput = form.querySelector('#reward-manager-address');
    const rewardManagerDiv = form.querySelector('#reward-manager-input');
    const executorInput = form.querySelector('#executor-address');
    const executorInputDiv = form.querySelector('#executor-input');
    const removeTokenWarningDiv = form.querySelector('#remove-token-warning');
    const wsgbInfoDiv = form.querySelector('#wsgb-info');

    const setupSubmitButton = (buttonText, buttonClass, action) => {
        console.log(`Setting up submit button: ${buttonText}`);
        const existingSubmit = form.querySelector('button[type="submit"]');
        if (existingSubmit) existingSubmit.remove();
        
        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.className = `${buttonClass} text-white font-bold py-2 px-4 rounded mt-2`;
        submitBtn.textContent = buttonText;
        form.appendChild(submitBtn);

        form.onsubmit = async (e) => {
            e.preventDefault();
            const contractAddr = contractAddressInput.value.trim();
            console.log(`Form submitted for contract: ${contractAddr}`);
            if (!ethersLib.utils.isAddress(contractAddr)) {
                showNotification("Please enter a valid RoyaltyDistributor address", "error");
                return;
            }
            await action(contractAddr);
            submitBtn.remove();
            paymentTokenDiv.classList.add('hidden');
            emergencyWalletDiv.classList.add('hidden');
            collectionAddressDiv.classList.add('hidden');
            ftsoProviderDiv.classList.add('hidden');
            rewardManagerDiv.classList.add('hidden');
            executorInputDiv.classList.add('hidden');
            removeTokenWarningDiv.classList.add('hidden');
            wsgbInfoDiv.classList.add('hidden');
        };
    };

    form.querySelector('#add-payment-token-btn').addEventListener('click', () => {
        console.log("Add Payment Token button clicked");
        paymentTokenDiv.classList.remove('hidden');
        emergencyWalletDiv.classList.add('hidden');
        collectionAddressDiv.classList.add('hidden');
        ftsoProviderDiv.classList.add('hidden');
        rewardManagerDiv.classList.add('hidden');
        executorInputDiv.classList.add('hidden');
        removeTokenWarningDiv.classList.add('hidden');
        wsgbInfoDiv.classList.remove('hidden');
        paymentTokenInput.value = '';
        paymentTokenInput.focus();
        setupSubmitButton('Confirm Add Token', 'bg-blue-500 hover:bg-blue-700', async (contractAddr) => {
            const tokenAddr = paymentTokenInput.value.trim();
            if (!ethersLib.utils.isAddress(tokenAddr)) {
                showNotification("Please enter a valid ERC20 token address", "error");
                return;
            }
            await manageContractAction(contractAddr, 'addPaymentToken', [tokenAddr], provider);
        });
    });

    form.querySelector('#remove-payment-token-btn').addEventListener('click', () => {
        console.log("Remove Payment Token button clicked");
        paymentTokenDiv.classList.remove('hidden');
        emergencyWalletDiv.classList.add('hidden');
        collectionAddressDiv.classList.add('hidden');
        ftsoProviderDiv.classList.add('hidden');
        rewardManagerDiv.classList.add('hidden');
        executorInputDiv.classList.add('hidden');
        removeTokenWarningDiv.classList.remove('hidden');
        wsgbInfoDiv.classList.add('hidden');
        paymentTokenInput.value = '';
        paymentTokenInput.focus();
        setupSubmitButton('Confirm Remove Token', 'bg-red-500 hover:bg-red-700', async (contractAddr) => {
            const tokenAddr = paymentTokenInput.value.trim();
            if (!ethersLib.utils.isAddress(tokenAddr)) {
                showNotification("Please enter a valid ERC20 token address", "error");
                return;
            }
            await manageContractAction(contractAddr, 'removePaymentToken', [tokenAddr], provider);
        });
    });

    form.querySelector('#withdraw-btn').addEventListener('click', () => {
        console.log("Withdraw button clicked");
        paymentTokenDiv.classList.add('hidden');
        emergencyWalletDiv.classList.add('hidden');
        collectionAddressDiv.classList.add('hidden');
        ftsoProviderDiv.classList.add('hidden');
        rewardManagerDiv.classList.add('hidden');
        executorInputDiv.classList.add('hidden');
        removeTokenWarningDiv.classList.add('hidden');
        wsgbInfoDiv.classList.add('hidden');
        setupSubmitButton('Confirm Withdrawal', 'bg-yellow-500 hover:bg-yellow-700', async (contractAddr) => {
            await manageContractAction(contractAddr, 'executeEmergencyWithdrawal', [], provider);
        });
    });

    form.querySelector('#update-emergency-wallet-btn').addEventListener('click', () => {
        console.log("Update Emergency Wallet button clicked");
        paymentTokenDiv.classList.add('hidden');
        emergencyWalletDiv.classList.remove('hidden');
        collectionAddressDiv.classList.add('hidden');
        ftsoProviderDiv.classList.add('hidden');
        rewardManagerDiv.classList.add('hidden');
        executorInputDiv.classList.add('hidden');
        removeTokenWarningDiv.classList.add('hidden');
        wsgbInfoDiv.classList.add('hidden');
        emergencyWalletInput.value = '';
        emergencyWalletInput.focus();
        setupSubmitButton('Confirm Update Wallet', 'bg-purple-500 hover:bg-purple-700', async (contractAddr) => {
            const newWalletAddr = emergencyWalletInput.value.trim();
            if (!ethersLib.utils.isAddress(newWalletAddr)) {
                showNotification("Please enter a valid emergency wallet address", "error");
                return;
            }
            await manageContractAction(contractAddr, 'updateEmergencyWallet', [newWalletAddr], provider);
        });
    });

    form.querySelector('#pause-btn').addEventListener('click', () => {
        console.log("Pause button clicked");
        paymentTokenDiv.classList.add('hidden');
        emergencyWalletDiv.classList.add('hidden');
        collectionAddressDiv.classList.add('hidden');
        ftsoProviderDiv.classList.add('hidden');
        rewardManagerDiv.classList.add('hidden');
        executorInputDiv.classList.add('hidden');
        removeTokenWarningDiv.classList.add('hidden');
        wsgbInfoDiv.classList.add('hidden');
        setupSubmitButton('Confirm Pause', 'bg-orange-500 hover:bg-orange-700', async (contractAddr) => {
            await manageContractAction(contractAddr, 'pause', [], provider);
        });
    });

    form.querySelector('#unpause-btn').addEventListener('click', () => {
        console.log("Unpause button clicked");
        paymentTokenDiv.classList.add('hidden');
        emergencyWalletDiv.classList.add('hidden');
        collectionAddressDiv.classList.add('hidden');
        ftsoProviderDiv.classList.add('hidden');
        rewardManagerDiv.classList.add('hidden');
        executorInputDiv.classList.add('hidden');
        removeTokenWarningDiv.classList.add('hidden');
        wsgbInfoDiv.classList.add('hidden');
        setupSubmitButton('Confirm Unpause', 'bg-green-500 hover:bg-green-700', async (contractAddr) => {
            await manageContractAction(contractAddr, 'unpause', [], provider);
        });
    });

    form.querySelector('#renounce-btn').addEventListener('click', () => {
        console.log("Renounce button clicked");
        paymentTokenDiv.classList.add('hidden');
        emergencyWalletDiv.classList.add('hidden');
        collectionAddressDiv.classList.add('hidden');
        ftsoProviderDiv.classList.add('hidden');
        rewardManagerDiv.classList.add('hidden');
        executorInputDiv.classList.add('hidden');
        removeTokenWarningDiv.classList.add('hidden');
        wsgbInfoDiv.classList.add('hidden');
        setupSubmitButton('Confirm Renounce', 'bg-gray-500 hover:bg-gray-600', async (contractAddr) => {
            await manageContractAction(contractAddr, 'renounceOwnership', [], provider);
        });
    });

    form.querySelector('#unregister-collection-btn').addEventListener('click', () => {
        console.log("Unregister Collection button clicked");
        paymentTokenDiv.classList.add('hidden');
        emergencyWalletDiv.classList.add('hidden');
        collectionAddressDiv.classList.remove('hidden');
        ftsoProviderDiv.classList.add('hidden');
        rewardManagerDiv.classList.add('hidden');
        executorInputDiv.classList.add('hidden');
        removeTokenWarningDiv.classList.add('hidden');
        wsgbInfoDiv.classList.add('hidden');
        collectionAddressInput.value = '';
        collectionAddressInput.focus();
        setupSubmitButton('Confirm Unregister', 'bg-pink-500 hover:bg-pink-700', async (distributorAddr) => {
            const collectionAddr = collectionAddressInput.value.trim();
            if (!ethersLib.utils.isAddress(collectionAddr)) {
                showNotification("Please enter a valid NFT collection address", "error");
                return;
            }
            try {
                const signer = provider.getSigner();
                const registryContract = new ethersLib.Contract(COLLECTION_REGISTRY_ADDRESS, COLLECTION_REGISTRY_ABI, signer);
                
                const isRegistered = await registryContract.isRegistered(collectionAddr);
                if (!isRegistered) {
                    showNotification("This collection is not registered", "error");
                    return;
                }
                const currentDistributor = await registryContract.getDistributor(collectionAddr);
                if (currentDistributor.toLowerCase() !== distributorAddr.toLowerCase()) {
                    showNotification("Distributor address does not match the collection's registered distributor", "error");
                    return;
                }

                const tx = await registryContract.removeCollection(collectionAddr);
                await tx.wait();
                showNotification(`Collection ${collectionAddr} unregistered successfully`, 'success');

                const walletAddress = await signer.getAddress();
                await loadCollections(walletAddress, EXPLORER_URL, provider);
            } catch (error) {
                handleError(error, 'collection unregistration');
            }
        });
    });

    form.querySelector('#delegate-ftso-btn').addEventListener('click', () => {
        console.log("Delegate to FTSO button clicked");
        paymentTokenDiv.classList.add('hidden');
        emergencyWalletDiv.classList.add('hidden');
        collectionAddressDiv.classList.add('hidden');
        ftsoProviderDiv.classList.remove('hidden');
        rewardManagerDiv.classList.add('hidden');
        executorInputDiv.classList.add('hidden');
        removeTokenWarningDiv.classList.add('hidden');
        wsgbInfoDiv.classList.add('hidden');
        ftsoProviderInput.value = '';
        ftsoProviderInput.focus();
        setupSubmitButton('Confirm Delegation', 'bg-teal-500 hover:bg-teal-700', async (contractAddr) => {
            console.log("Delegate form submitted with contract:", contractAddr);
            const ftsoProvider = ftsoProviderInput.value.trim();
            if (!ethersLib.utils.isAddress(ftsoProvider)) {
                showNotification("Please enter a valid FTSO provider address", "error");
                return;
            }
            await manageContractAction(contractAddr, 'delegateToFTSO', [ftsoProvider], provider);
        });
    });

    form.querySelector('#claim-ftso-rewards-btn').addEventListener('click', () => {
        console.log("Claim FTSO Rewards button clicked");
        paymentTokenDiv.classList.add('hidden');
        emergencyWalletDiv.classList.add('hidden');
        collectionAddressDiv.classList.add('hidden');
        ftsoProviderDiv.classList.add('hidden');
        rewardManagerDiv.classList.add('hidden');
        executorInputDiv.classList.add('hidden');
        removeTokenWarningDiv.classList.add('hidden');
        wsgbInfoDiv.classList.add('hidden');
        setupSubmitButton('Confirm Claim', 'bg-indigo-500 hover:bg-indigo-700', async (contractAddr) => {
            console.log("Claim FTSO Rewards form submitted with contract:", contractAddr);
            await manageContractAction(contractAddr, 'claimFTSORewards', [], provider);
        });
    });

    form.querySelector('#set-reward-manager-btn').addEventListener('click', () => {
        console.log("Set Reward Manager button clicked");
        paymentTokenDiv.classList.add('hidden');
        emergencyWalletDiv.classList.add('hidden');
        collectionAddressDiv.classList.add('hidden');
        ftsoProviderDiv.classList.add('hidden');
        rewardManagerDiv.classList.remove('hidden');
        executorInputDiv.classList.add('hidden');
        removeTokenWarningDiv.classList.add('hidden');
        wsgbInfoDiv.classList.add('hidden');
        rewardManagerInput.value = '';
        rewardManagerInput.focus();
        setupSubmitButton('Confirm Reward Manager', 'bg-cyan-500 hover:bg-cyan-700', async (contractAddr) => {
            console.log("Set Reward Manager form submitted with contract:", contractAddr);
            const newManager = rewardManagerInput.value.trim();
            if (!ethersLib.utils.isAddress(newManager)) {
                showNotification("Please enter a valid reward manager address", "error");
                return;
            }
            await manageContractAction(contractAddr, 'setFtsoRewardManager', [newManager], provider);
        });
    });

    form.querySelector('#undelegate-btn').addEventListener('click', () => {
        console.log("Undelegate button clicked");
        paymentTokenDiv.classList.add('hidden');
        emergencyWalletDiv.classList.add('hidden');
        collectionAddressDiv.classList.add('hidden');
        ftsoProviderDiv.classList.add('hidden');
        rewardManagerDiv.classList.add('hidden');
        executorInputDiv.classList.add('hidden');
        removeTokenWarningDiv.classList.add('hidden');
        wsgbInfoDiv.classList.add('hidden');
        setupSubmitButton('Confirm Undelegate', 'bg-gray-600 hover:bg-gray-700', async (contractAddr) => {
            console.log("Undelegate form submitted with contract:", contractAddr);
            await manageContractAction(contractAddr, 'undelegateAll', [], provider);
        });
    });

    form.querySelector('#set-executor-btn').addEventListener('click', () => {
        console.log("Set Executor button clicked");
        paymentTokenDiv.classList.add('hidden');
        emergencyWalletDiv.classList.add('hidden');
        collectionAddressDiv.classList.add('hidden');
        ftsoProviderDiv.classList.add('hidden');
        rewardManagerDiv.classList.add('hidden');
        executorInputDiv.classList.remove('hidden');
        removeTokenWarningDiv.classList.add('hidden');
        wsgbInfoDiv.classList.add('hidden');
        executorInput.value = '';
        executorInput.focus();
        setupSubmitButton('Confirm Executor', 'bg-teal-600 hover:bg-teal-800', async (contractAddr) => {
            console.log("Set Executor form submitted with contract:", contractAddr);
            const executorAddr = executorInput.value.trim();
            if (!ethersLib.utils.isAddress(executorAddr)) {
                showNotification("Please enter a valid executor address", "error");
                return;
            }
            await manageContractAction(contractAddr, 'setExecutor', [executorAddr], provider);
        });
    });
}

async function registerCollectionOnServer(collectionName, collectionAddress, contractAddress, tokenType) {
 try {
 const response = await fetch(`${SERVER_URL}/api/register-collection`, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ collectionName, collectionAddress, contractAddress, tokenType })
 });
 const data = await response.json();
 if (!response.ok) throw new Error(data.error || 'Failed to register collection');
 showNotification('Collection registered on server', 'success');
 } catch (error) {
 console.error('Error registering collection on server:', error);
 showNotification('Failed to register collection on server', 'error');
 }
}

// DOM Initialization
(async () => {
 console.log('RoyaltyApp.initializeWithEthers defined:', RoyaltyApp.initializeWithEthers);
 
 document.addEventListener('DOMContentLoaded', async () => {
 console.log('DOM fully loaded, starting initialization');
 document.body.classList.remove('loading');
 
 let provider;
 try {
 if (window.ethereum) {
 provider = new ethersLib.providers.Web3Provider(window.ethereum);
 const accounts = await provider.send("eth_accounts", []);
 await handleWalletConnection(provider, accounts);
 } else {
 console.log("No browser wallet detected, relying on manual connect");
 }
 } catch (error) {
 handleError(error, "wallet connection");
 showNotification("Wallet connection failed: " + error.message, "error");
 }
 
 if (provider && window.ethereum) {
 window.ethereum.on('accountsChanged', async (accounts) => {
 await handleWalletConnection(provider, accounts);
 });
 window.ethereum.on('chainChanged', () => {
 window.location.reload();
 });
 }
 
 await connectWallet();
 
 const deployContractBtn = document.getElementById('deploy-contract-btn');
 if (deployContractBtn) {
 deployContractBtn.addEventListener('click', () => {
 const deployForm = document.getElementById('deploy-form');
 if (deployForm) deployForm.classList.toggle('hidden');
 else console.error('Deploy form not found in DOM');
 });
 }
 
 const manageContractsBtn = document.getElementById('manage-contracts-btn');
 if (manageContractsBtn) {
 manageContractsBtn.addEventListener('click', (e) => {
 e.preventDefault();
 showManageContractsForm(provider);
 });
 }
 
 const deployForm = document.getElementById('deploy-contract-form');
 if (deployForm) {
 console.log('Deploy Contract form found, attaching event listener');
 deployForm.addEventListener('submit', async (e) => {
 e.preventDefault();
 const emergencyWallet = document.getElementById('emergency-wallet').value;
 const totalTokenSupply = document.getElementById('total-token-supply').value;
 
 try {
 if (!provider) throw new Error("No provider available");
 const signer = provider.getSigner();
 const network = await provider.getNetwork();
 const factoryAddress = FACTORY_ADDRESS;
 
 if (!factoryAddress) {
 throw new Error(`No factory address defined for chainId ${network.chainId}`);
 }
 
 const factoryContract = new ethersLib.Contract(factoryAddress, FACTORY_ABI, signer);
 console.log(`Deploying RoyaltyDistributor on chain ${network.chainId} using factory ${factoryAddress}`);
 
 const tx = await factoryContract.deployRoyaltyDistributor(totalTokenSupply, emergencyWallet);
 const receipt = await tx.wait();
 const deployedAddress = receipt.events.find(e => e.event === 'DistributorDeployed').args.distributorAddress;
 
 showNotification(`Contract deployed at: ${deployedAddress} on Songbird`, 'success');
 showAddCollectionForm(deployedAddress, provider);
 } catch (error) {
 handleError(error, 'contract deployment');
 showNotification(`Failed to deploy contract: ${error.message}`, 'error');
 }
 });
 } else {
 console.warn('Deploy Contract form not found');
 }
 
 await initializeApp();
 });
})();
