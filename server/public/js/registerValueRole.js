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

async function submitRegisterValueRole(event) {
    event.preventDefault();
    const nftAddress = document.getElementById('nftAddress').value;
    const roleName = document.getElementById('roleName').value;
    const requiredNFTValue = document.getElementById('requiredNFTValue').value;

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

        // Register the value-based role
        const roleTx = await nftVerificationContract.registerValueRole(nftAddress, roleName, requiredNFTValue);
        await roleTx.wait();

        alert('Value-based role registered successfully!');
    } catch (error) {
        console.error('Error registering value-based role:', error);
        alert(`Error registering value-based role: ${error.message}`);
    }
}

async function submitMapNFTValue(event) {
    event.preventDefault();
    const nftAddress = document.getElementById('mapNftAddress').value;
    const tokenId = document.getElementById('mapTokenId').value;
    const value = document.getElementById('mapValue').value;

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

        // Map the NFT value
        const mapTx = await nftVerificationContract.mapNFTValue(nftAddress, tokenId, value);
        await mapTx.wait();
        console.log('NFT value mapped:', mapTx);

        alert('NFT value mapped successfully!');
    } catch (error) {
        console.error('Error mapping NFT value:', error);
        alert(`Error mapping NFT value: ${error.message}`);
    }
}

async function submitUnregisterValueRole(event) {
    event.preventDefault();
    const nftAddress = document.getElementById('unregisterNftAddress').value;
    const roleName = document.getElementById('unregisterRoleName').value;

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

        // Unregister the value-based role
        const tx = await nftVerificationContract.unregisterValueRole(nftAddress, roleName);
        await tx.wait();

        alert('Value-based role unregistered successfully!');
    } catch (error) {
        console.error('Error unregistering value-based role:', error);
        alert(`Error unregistering value-based role: ${error.message}`);
    }
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

window.addEventListener('load', () => {
    // Existing logic for `registerValueRole`
    const nftAddress = getQueryParam('nftAddress');
    const roleName = getQueryParam('roleName');
    const requiredNFTValue = getQueryParam('requiredNFTValue');

    if (nftAddress) {
        document.getElementById('nftAddress').value = nftAddress;
    }
    if (roleName) {
        document.getElementById('roleName').value = roleName;
    }
    if (requiredNFTValue) {
        document.getElementById('requiredNFTValue').value = requiredNFTValue;
    }

    // Logic for `mapNFTValue`
    const mapNftAddress = getQueryParam('mapNftAddress');
    const mapTokenId = getQueryParam('mapTokenId');
    const mapValue = getQueryParam('mapValue');

    if (mapNftAddress) {
        document.getElementById('mapNftAddress').value = mapNftAddress;
    }
    if (mapTokenId) {
        document.getElementById('mapTokenId').value = mapTokenId;
    }
    if (mapValue) {
        document.getElementById('mapValue').value = mapValue;
    }
});

// Add event listener for the wallet connection button
document.addEventListener('DOMContentLoaded', () => {
    const walletButton = document.getElementById('walletButton');
    if (walletButton) {
        walletButton.addEventListener('click', connectWallet);
    }
});
