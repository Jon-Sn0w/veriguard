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

async function submitRemoveNFT(event) {
    event.preventDefault();
    const nftAddress = document.getElementById('nftAddress').value;

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

        // Remove the NFT
        const tx = await nftVerificationContract.removeNFT(nftAddress);
        await tx.wait();

        alert('NFT removed successfully!');
    } catch (error) {
        console.error('Error removing NFT:', error);
        alert(`Error removing NFT: ${error.message}`);
    }
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

window.addEventListener('load', () => {
    const nftAddress = getQueryParam('nftAddress');

    if (nftAddress) {
        document.getElementById('nftAddress').value = nftAddress;
    }
});

// Add event listener for the wallet connection button
document.addEventListener('DOMContentLoaded', () => {
    const walletButton = document.getElementById('walletButton');
    if (walletButton) {
        walletButton.addEventListener('click', connectWallet);
    }
});
