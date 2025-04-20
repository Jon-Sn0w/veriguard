// Contract ABI
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ERC721IncorrectOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ERC721InsufficientApproval",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC721InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "ERC721InvalidOperator",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ERC721InvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC721InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC721InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ERC721NonexistentToken",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "burn",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "cancelChallenge",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "generateChallenge",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "answer",
				"type": "uint256"
			}
		],
		"name": "mintWithChallenge",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "newTokenURI",
				"type": "string"
			}
		],
		"name": "setTokenURI",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "initialOwner",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "_challenges",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTokenURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "hasMinted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

// Chain configurations
const chainConfig = {
 songbird: {
 chainId: '0x13', // Songbird chain ID (19 in decimal)
 name: 'Songbird',
 },
 flare: {
 chainId: '0xe', // Flare chain ID (14 in decimal)
 name: 'Flare',
 },
 basechain: {
 chainId: '0x2105', // Base chain ID (8453 in decimal)
 name: 'Base',
 },
};

// Initialize provider and contract
let provider;
let signer;
let contract;
let env;
let currentNetwork;

// Fetch environment variables
async function fetchEnv() {
 try {
 const envResponse = await fetch('/api/env');
 if (!envResponse.ok) {
 throw new Error(`Failed to fetch environment variables: ${envResponse.statusText}`);
 }
 env = await envResponse.json();
 if (!env.SONGBIRD_NFT_MINTER_ADDRESS || !env.FLARE_NFT_MINTER_ADDRESS || !env.BASECHAIN_NFT_MINTER_ADDRESS) {
 throw new Error('Missing required NFT minter addresses in environment variables.');
 }
 if (!env.SONGBIRD_RPC_URL || !env.FLARE_RPC_URL || !env.BASECHAIN_RPC_URL) {
 throw new Error('Missing required RPC URLs in environment variables.');
 }
 return true;
 } catch (error) {
 console.error('Error fetching environment variables:', error);
 displayMessage(false, null, 'Failed to load environment variables. Please try again later.');
 return false;
 }
}

// Get contract address based on network
async function getContractAddress(network) {
 if (!env) throw new Error('Environment variables not loaded.');
 if (network === 'songbird') return env.SONGBIRD_NFT_MINTER_ADDRESS;
 else if (network === 'flare') return env.FLARE_NFT_MINTER_ADDRESS;
 else if (network === 'basechain') return env.BASECHAIN_NFT_MINTER_ADDRESS;
 else throw new Error('Invalid network selected');
}

// Get RPC URL based on network
async function getRpcUrl(network) {
 if (!env) throw new Error('Environment variables not loaded.');
 if (network === 'songbird') return env.SONGBIRD_RPC_URL;
 else if (network === 'flare') return env.FLARE_RPC_URL;
 else if (network === 'basechain') return env.BASECHAIN_RPC_URL;
 else throw new Error('Invalid network selected');
}

// Detect the user's current chain
async function detectUserChain() {
 try {
 if (!window.ethereum) throw new Error('MetaMask is not installed.');
 const chainId = await window.ethereum.request({ method: 'eth_chainId' });
 for (const [network, config] of Object.entries(chainConfig)) {
 if (config.chainId === chainId) return network;
 }
 return null;
 } catch (error) {
 console.error('Error detecting user chain:', error);
 return null;
 }
}

// Initialize contract based on selected network
async function initializeContract(network, forceSwitch = false) {
 try {
 const contractAddress = await getContractAddress(network);
 const rpcUrl = await getRpcUrl(network);
 const chainId = chainConfig[network].chainId;

 if (!contractAddress) throw new Error(`Contract address for ${network} is undefined.`);

 if (forceSwitch) {
 try {
 await window.ethereum.request({
 method: 'wallet_switchEthereumChain',
 params: [{ chainId }],
 });
 } catch (switchError) {
 if (switchError.code === 4902) {
 await window.ethereum.request({
 method: 'wallet_addEthereumChain',
 params: [{
 chainId: chainId,
 chainName: chainConfig[network].name,
 rpcUrls: [rpcUrl],
 nativeCurrency: {
 name: chainConfig[network].name,
 symbol: network === 'songbird' ? 'SGB' : network === 'flare' ? 'FLR' : 'ETH',
 decimals: 18,
 },
 blockExplorerUrls: [
 network === 'songbird' ? 'https://songbird-explorer.flare.network' :
 network === 'flare' ? 'https://flare-explorer.flare.network' :
 'https://basescan.org',
 ],
 }],
 });
 } else {
 throw switchError;
 }
 }
 }

 provider = new ethers.providers.Web3Provider(window.ethereum);
 signer = provider.getSigner();
 contract = new ethers.Contract(contractAddress, contractABI, signer);

 const totalSupply = await contract.totalSupply();
 document.getElementById('totalSupply').textContent = `Total Supply: ${totalSupply.toString()}`;
 } catch (error) {
 console.error('Error initializing contract:', error);
 displayMessage(false, null, `Failed to initialize contract. Please ensure you are on the ${chainConfig[network].name} network.`);
 }
}

// Display wallet status and messages
function displayMessage(isConnected, address, message = null) {
 const messageContainer = document.getElementById('messageContainer');
 const walletStatus = document.getElementById('walletStatus');
 const walletAddress = document.getElementById('walletAddress');
 const generateChallengeButton = document.getElementById('generateChallengeButton');
 const cancelChallengeButton = document.getElementById('cancelChallengeButton');
 
 messageContainer.classList.remove('hidden');
 
 if (isConnected) {
 walletStatus.textContent = message || 'Wallet connected successfully!';
 walletStatus.classList.remove('text-red-500');
 walletStatus.classList.add('text-green-500');
 walletAddress.textContent = address ? `Address: ${address}` : '';
 messageContainer.classList.add('bg-black', 'bg-opacity-80');
 messageContainer.classList.remove('bg-red-900', 'bg-opacity-80');
 generateChallengeButton.classList.remove('hidden');
 cancelChallengeButton.classList.remove('hidden'); // Show Cancel Challenge button always when connected
 } else {
 walletStatus.textContent = message || 'Failed to connect wallet.';
 walletStatus.classList.remove('text-green-500');
 walletStatus.classList.add('text-red-500');
 walletAddress.textContent = '';
 messageContainer.classList.add('bg-red-900', 'bg-opacity-80');
 messageContainer.classList.remove('bg-black', 'bg-opacity-80');
 generateChallengeButton.classList.add('hidden');
 cancelChallengeButton.classList.add('hidden'); // Hide Cancel Challenge button when not connected
 }
}

// Connect wallet
async function connectWallet() {
 try {
 if (!window.ethereum) throw new Error('Please install MetaMask to use this app.');

 const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
 const account = accounts[0];
 displayMessage(true, account);

 if (!currentNetwork) {
 displayMessage(false, null, 'Unsupported network detected. Please switch to Songbird, Flare, or Base to continue.');
 return;
 }

 await initializeContract(currentNetwork);
 } catch (error) {
 console.error('Failed to connect wallet:', error);
 displayMessage(false, null, error.message);
 }
}

// Generate challenge
async function generateChallenge() {
 try {
 if (!contract || !signer) throw new Error('Wallet not connected. Please connect your wallet first.');

 const tx = await contract.generateChallenge();
 await tx.wait();

 const userAddress = await signer.getAddress();
 const challengeValue = await contract._challenges(userAddress);
 const challenge = challengeValue.sub(1).toNumber(); // Subtract 1 to get the actual challenge

 document.getElementById('challengeText').textContent = `Challenge: What is the sum of the digits of ${challenge}? (e.g., 42 → 4 + 2 = 6)`;
 document.getElementById('challengeContainer').classList.remove('hidden');
 document.getElementById('generateChallengeButton').classList.add('hidden');
 } catch (error) {
 console.error('Error generating challenge:', error);
 displayMessage(false, null, `Error generating challenge: ${error.message}`);
 }
}

// Submit challenge answer and mint NFT
async function submitChallengeAnswer() {
 try {
 if (!contract || !signer) throw new Error('Wallet not connected. Please connect your wallet first.');

 const answer = parseInt(document.getElementById('challengeAnswer').value, 10);
 if (isNaN(answer)) throw new Error('Please enter a valid number.');

 const tx = await contract.mintWithChallenge(answer);
 await tx.wait();

 const successMessage = 'Successfully minted 1 NFT! You can now use the "Are You Human" command in Discord with this wallet.';
 displayMessage(true, await signer.getAddress(), successMessage);

 const totalSupply = await contract.totalSupply();
 document.getElementById('totalSupply').textContent = `Total Supply: ${totalSupply.toString()}`;
 document.getElementById('challengeContainer').classList.add('hidden');
 document.getElementById('generateChallengeButton').classList.remove('hidden');
 } catch (error) {
 console.error('Error submitting answer:', error);
 displayMessage(false, null, `Error submitting answer: ${error.message}`);
 }
}

// Cancel challenge
async function cancelChallenge() {
 try {
 if (!contract || !signer) throw new Error('Wallet not connected. Please connect your wallet first.');

 const tx = await contract.cancelChallenge();
 await tx.wait();

 displayMessage(true, await signer.getAddress(), 'Challenge cancelled successfully.');
 document.getElementById('challengeContainer').classList.add('hidden');
 document.getElementById('generateChallengeButton').classList.remove('hidden');
 } catch (error) {
 console.error('Error cancelling challenge:', error);
 // Only display error if it’s not "No active challenge" (allow silent fail for no challenge)
 if (error.message.includes("No active challenge")) {
 displayMessage(true, await signer.getAddress(), 'No active challenge to cancel.');
 } else {
 displayMessage(false, null, `Error cancelling challenge: ${error.message}`);
 }
 document.getElementById('challengeContainer').classList.add('hidden');
 document.getElementById('generateChallengeButton').classList.remove('hidden');
 }
}

// Event listeners
document.addEventListener('DOMContentLoaded', async () => {
 try {
 document.body.classList.remove('loading');

 const envFetched = await fetchEnv();
 if (!envFetched) return;

 currentNetwork = await detectUserChain();
 if (!currentNetwork) {
 currentNetwork = 'songbird';
 displayMessage(false, null, 'Unsupported network detected. Please switch to Songbird, Flare, or Base to continue.');
 }

 const networkSelect = document.getElementById('network');
 if (networkSelect) {
 networkSelect.value = currentNetwork;
 networkSelect.addEventListener('change', async () => {
 const network = networkSelect.value;
 currentNetwork = network;
 await initializeContract(network, true);
 });
 }

 const walletButton = document.getElementById('walletButton');
 if (walletButton) walletButton.addEventListener('click', connectWallet);

 const generateChallengeButton = document.getElementById('generateChallengeButton');
 if (generateChallengeButton) generateChallengeButton.addEventListener('click', generateChallenge);

 const submitAnswerButton = document.getElementById('submitAnswerButton');
 if (submitAnswerButton) submitAnswerButton.addEventListener('click', submitChallengeAnswer);

 const cancelChallengeButton = document.getElementById('cancelChallengeButton');
 if (cancelChallengeButton) cancelChallengeButton.addEventListener('click', cancelChallenge);

 await initializeContract (currentNetwork);
 } catch (error) {
 console.error('Error during page initialization:', error);
 displayMessage(false, null, 'An unexpected error occurred. Please try again later.');
 }
});
