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

async function submitRegisterValueRole(event) {
    event.preventDefault();
    const nftAddress = document.getElementById('nftAddress').value;
    const roleName = document.getElementById('roleName').value;
    const requiredNFTValue = document.getElementById('requiredNFTValue').value;
    const network = document.getElementById('network').value;

    try {
        const account = await connectWallet();
        if (!account) return;

        const envResponse = await fetch('/api/env');
        const env = await envResponse.json();
        const contractAddress = await getContractAddress(env);

        if (!contractAddress) {
            throw new Error('Contract address not found for the selected network.');
        }

        const abiResponse = await fetch('/abi.json');
        const abi = await abiResponse.json();

        // Get read-only provider for initial checks
        const rpcProvider = await getProvider(env, network);
        const readOnlyContract = new ethers.Contract(contractAddress, abi, rpcProvider);

        // Initialize ethers for transaction
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const nftVerificationContract = new ethers.Contract(contractAddress, abi, signer);

        console.log('Registering value-based role:', {
            network,
            contractAddress,
            nftAddress,
            roleName,
            requiredNFTValue
        });

        const tx = await nftVerificationContract.registerValueRole(nftAddress, roleName, requiredNFTValue);
        console.log('Transaction submitted:', tx.hash);
        const receipt = await tx.wait();
        console.log('Transaction confirmed:', receipt);

        // Look for ValueRoleRegistered event
        const valueRoleRegisteredEvent = receipt.events?.find(event => event.event === 'ValueRoleRegistered');
        if (valueRoleRegisteredEvent) {
            alert(`Value-based role registered successfully!\nNFT: ${valueRoleRegisteredEvent.args.nftAddress}\nRole: ${valueRoleRegisteredEvent.args.roleName}\nRequired Value: ${valueRoleRegisteredEvent.args.requiredValue}`);
        } else {
            alert('Value-based role registered successfully!');
        }
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
    const network = document.getElementById('network').value;

    try {
        const account = await connectWallet();
        if (!account) return;

        const envResponse = await fetch('/api/env');
        const env = await envResponse.json();
        const contractAddress = await getContractAddress(env);

        if (!contractAddress) {
            throw new Error('Contract address not found for the selected network.');
        }

        const abiResponse = await fetch('/abi.json');
        const abi = await abiResponse.json();

        // Get read-only provider for initial checks
        const rpcProvider = await getProvider(env, network);
        const readOnlyContract = new ethers.Contract(contractAddress, abi, rpcProvider);

        // Initialize ethers for transaction
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const nftVerificationContract = new ethers.Contract(contractAddress, abi, signer);

        console.log('Mapping NFT value:', {
            network,
            contractAddress,
            nftAddress,
            tokenId,
            value
        });

        const tx = await nftVerificationContract.mapNFTValue(nftAddress, tokenId, value);
        console.log('Transaction submitted:', tx.hash);
        const receipt = await tx.wait();
        console.log('Transaction confirmed:', receipt);

        // Look for NFTValueMapped event
        const nftValueMappedEvent = receipt.events?.find(event => event.event === 'NFTValueMapped');
        if (nftValueMappedEvent) {
            alert(`NFT value mapped successfully!\nNFT: ${nftValueMappedEvent.args.nftAddress}\nToken ID: ${nftValueMappedEvent.args.tokenId}\nValue: ${nftValueMappedEvent.args.value}`);
        } else {
            alert('NFT value mapped successfully!');
        }
    } catch (error) {
        console.error('Error mapping NFT value:', error);
        alert(`Error mapping NFT value: ${error.message}`);
    }
}

async function submitUnregisterValueRole(event) {
    event.preventDefault();
    const nftAddress = document.getElementById('unregisterNftAddress').value;
    const roleName = document.getElementById('unregisterRoleName').value;
    const network = document.getElementById('network').value;

    try {
        const account = await connectWallet();
        if (!account) return;

        const envResponse = await fetch('/api/env');
        const env = await envResponse.json();
        const contractAddress = await getContractAddress(env);

        if (!contractAddress) {
            throw new Error('Contract address not found for the selected network.');
        }

        const abiResponse = await fetch('/abi.json');
        const abi = await abiResponse.json();

        // Get read-only provider for initial checks
        const rpcProvider = await getProvider(env, network);
        const readOnlyContract = new ethers.Contract(contractAddress, abi, rpcProvider);

        // Initialize ethers for transaction
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const nftVerificationContract = new ethers.Contract(contractAddress, abi, signer);

        console.log('Unregistering value-based role:', {
            network,
            contractAddress,
            nftAddress,
            roleName
        });

        const tx = await nftVerificationContract.unregisterValueRole(nftAddress, roleName);
        console.log('Transaction submitted:', tx.hash);
        const receipt = await tx.wait();
        console.log('Transaction confirmed:', receipt);

        // Look for ValueRoleUnregistered event
        const valueRoleUnregisteredEvent = receipt.events?.find(event => event.event === 'ValueRoleUnregistered');
        if (valueRoleUnregisteredEvent) {
            alert(`Value-based role unregistered successfully!\nNFT: ${valueRoleUnregisteredEvent.args.nftAddress}\nRole: ${valueRoleUnregisteredEvent.args.roleName}`);
        } else {
            alert('Value-based role unregistered successfully!');
        }
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
    // Handle registerValueRole params
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

    // Handle mapNFTValue params
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
