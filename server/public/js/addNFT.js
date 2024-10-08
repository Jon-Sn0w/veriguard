async function connectWallet() {
    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        displayWalletStatus(true, account);
        return account;
    } catch (error) {
        console.error('Failed to connect wallet:', error);
        displayWalletStatus(false, null, error.message);
        return null;
    }
}

function displayWalletStatus(isConnected, address, errorMessage = null) {
    const messageContainer = document.getElementById('messageContainer');
    const walletStatus = document.getElementById('walletStatus');
    const walletAddress = document.getElementById('walletAddress');
    
    messageContainer.classList.remove('hidden');
    
    if (isConnected) {
        walletStatus.textContent = 'Wallet connected successfully!';
        walletStatus.classList.remove('text-red-500');
        walletStatus.classList.add('text-green-500');
        walletAddress.textContent = `Address: ${address}`;
        messageContainer.classList.add('bg-black', 'bg-opacity-80');
        messageContainer.classList.remove('bg-red-900', 'bg-opacity-80');
    } else {
        walletStatus.textContent = 'Failed to connect wallet.';
        walletStatus.classList.remove('text-green-500');
        walletStatus.classList.add('text-red-500');
        walletAddress.textContent = errorMessage || '';
        messageContainer.classList.add('bg-red-900', 'bg-opacity-80');
        messageContainer.classList.remove('bg-black', 'bg-opacity-80');
    }
}

async function getContractAddress(env) {
    const network = document.getElementById('network').value;
    if (network === 'songbird') {
        return env.SONGBIRD_CONTRACT_ADDRESS;
    } else if (network === 'flare') {
        return env.FLARE_CONTRACT_ADDRESS;
    } else {
        throw new Error('Invalid network selected');
    }
}

async function approveToken() {
    const paymentTokenAddress = '0x1005dF5400EE5f4C1378becF513833cBc4A6EF53'; // Payment token contract address
    const paymentAmount = ethers.utils.parseUnits('1000', 18); // Payment amount in wei

    try {
        const account = await connectWallet();
        if (!account) return;

        // Fetch environment variables from the server
        const envResponse = await fetch('/api/env');
        const env = await envResponse.json();

        const contractAddress = await getContractAddress(env);

        if (!contractAddress) {
            throw new Error('Contract address not found for the selected network.');
        }

        // Initialize ethers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // Approve the spending of the payment token
        const erc20Abi = [
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "approve",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "type": "function"
            }
        ];
        const paymentTokenContract = new ethers.Contract(paymentTokenAddress, erc20Abi, signer);

        const approvalTx = await paymentTokenContract.approve(contractAddress, paymentAmount);
        await approvalTx.wait();
        console.log('Token approval transaction:', approvalTx);

        alert('Payment approved successfully!');
    } catch (error) {
        console.error('Error approving payment:', error);
        alert(`Error approving payment: ${error.message}`);
    }
}

async function submitAddNFT(event) {
    event.preventDefault();
    const nftAddress = document.getElementById('nftAddress').value;
    const tokenId = document.getElementById('tokenId').value || 0; // Default to 0 if no tokenId is provided
    const isERC1155 = document.getElementById('isERC1155').checked;

    try {
        const account = await connectWallet();
        if (!account) return;

        // Fetch environment variables from the server
        const envResponse = await fetch('/api/env');
        const env = await envResponse.json();

        const contractAddress = await getContractAddress(env);

        if (!contractAddress) {
            throw new Error('Contract address not found for the selected network.');
        }

        // Fetch the ABI from the server
        const abiResponse = await fetch('/abi.json');
        const abi = await abiResponse.json();

        // Initialize ethers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const nftVerificationContract = new ethers.Contract(contractAddress, abi, signer);

        // Add the NFT
        const tx = await nftVerificationContract.addNFT(nftAddress, tokenId, isERC1155);
        await tx.wait();

        alert('NFT added successfully!');
    } catch (error) {
        console.error('Error adding NFT:', error);
        alert(`Error adding NFT: ${error.message}`);
    }
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

window.addEventListener('load', () => {
    const nftAddress = getQueryParam('nftAddress');
    const tokenId = getQueryParam('tokenId');
    const isERC1155 = getQueryParam('isERC1155') === 'true';

    if (nftAddress) {
        document.getElementById('nftAddress').value = nftAddress;
    }
    if (tokenId) {
        document.getElementById('tokenId').value = tokenId;
    }
    document.getElementById('isERC1155').checked = isERC1155;
});

// Add event listener for the wallet connection button
document.addEventListener('DOMContentLoaded', () => {
    const walletButton = document.getElementById('walletButton');
    if (walletButton) {
        walletButton.addEventListener('click', connectWallet);
    }
});
