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

async function getProvider(env, network) {
    const rpcUrl = network === 'songbird' ? env.SONGBIRD_RPC_URL : env.FLARE_RPC_URL;
    return new ethers.providers.JsonRpcProvider(rpcUrl);
}

async function submitRemoveNFT(event) {
    event.preventDefault();
    const nftAddress = document.getElementById('nftAddress').value;
    const network = document.getElementById('network').value;

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

        // Get read-only provider for contract verification
        const rpcProvider = await getProvider(env, network);
        const readOnlyContract = new ethers.Contract(contractAddress, abi, rpcProvider);

        // Verify NFT exists before attempting removal
        try {
            console.log('Verifying NFT before removal:', {
                network,
                contractAddress,
                nftAddress
            });

            // Initialize ethers for transaction
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const nftVerificationContract = new ethers.Contract(contractAddress, abi, signer);

            console.log('Submitting removeNFT transaction...');
            const tx = await nftVerificationContract.removeNFT(nftAddress);
            console.log('Transaction submitted:', tx.hash);
            const receipt = await tx.wait();
            console.log('Transaction confirmed:', receipt);

            // Look for NFTUnmapped event
            const nftUnmappedEvent = receipt.events?.find(event => event.event === 'NFTUnmapped');
            if (nftUnmappedEvent) {
                alert(`NFT successfully removed!\nAddress: ${nftUnmappedEvent.args.nftAddress}`);
            } else {
                alert('NFT removed successfully!');
            }
        } catch (error) {
            if (error.message.includes('revert')) {
                throw new Error('This NFT cannot be removed or does not exist in the contract');
            }
            throw error;
        }
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

document.addEventListener('DOMContentLoaded', () => {
    const walletButton = document.getElementById('walletButton');
    if (walletButton) {
        walletButton.addEventListener('click', connectWallet);
    }

    // Add network change handler
    const networkSelect = document.getElementById('network');
    if (networkSelect) {
        networkSelect.addEventListener('change', () => {
            console.log('Network changed to:', networkSelect.value);
        });
    }
});
