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

async function getPaymentTokenAddress(env) {
    const network = document.getElementById('network').value;
    if (network === 'songbird') {
        return env.SONGBIRD_PAYMENT_TOKEN_ADDRESS;
    } else if (network === 'flare') {
        return env.FLARE_PAYMENT_TOKEN_ADDRESS;
    } else {
        throw new Error('Invalid network selected');
    }
}

function selectNFTType(type) {
    const erc721Button = document.getElementById('erc721Button');
    const erc1155Button = document.getElementById('erc1155Button');
    const isERC1155Input = document.getElementById('isERC1155');
    const nftTypeDisplay = document.getElementById('nftTypeDisplay');
    
    if (type === '721') {
        erc721Button.classList.add('bg-blue-500');
        erc1155Button.classList.remove('bg-purple-500');
        isERC1155Input.value = false;
        nftTypeDisplay.textContent = 'Selected: ERC721 Standard';
    } else {
        erc1155Button.classList.add('bg-purple-500');
        erc721Button.classList.remove('bg-blue-500');
        isERC1155Input.value = true;
        nftTypeDisplay.textContent = 'Selected: ERC1155 Standard';
    }
}

function updateTokenIdField(show) {
    const tokenIdField = document.getElementById('tokenId');
    if (show) {
        tokenIdField.classList.remove('hidden');
        tokenIdField.value = '';
    } else {
        tokenIdField.classList.add('hidden');
        tokenIdField.value = '0';
    }
}

async function formatPaymentAmount(amount) {
    return ethers.utils.formatUnits(amount, 18);
}

async function getProvider(env, network) {
    const rpcUrl = network === 'songbird' ? env.SONGBIRD_RPC_URL : env.FLARE_RPC_URL;
    return new ethers.providers.JsonRpcProvider(rpcUrl);
}

async function updatePaymentDisplay() {
    const paymentDisplay = document.getElementById('paymentDisplay');
    const paymentTokenDisplay = document.getElementById('paymentToken');
    
    try {
        const network = document.getElementById('network').value;
        const envResponse = await fetch('/api/env');
        const env = await envResponse.json();
        
        // Use network-specific RPC provider
        const provider = await getProvider(env, network);
        const contractAddress = await getContractAddress(env);
        const tokenName = network === 'songbird' ? 'WBBX' : 'WFLR';
        
        const abiResponse = await fetch('/abi.json');
        const abi = await abiResponse.json();
        const contract = new ethers.Contract(contractAddress, abi, provider);
        
        const paymentAmount = await contract.paymentAmount();
        const formattedAmount = await formatPaymentAmount(paymentAmount);
        
        paymentDisplay.innerHTML = `${formattedAmount} ${tokenName}`;
        paymentTokenDisplay.innerHTML = `Payment will be made in ${tokenName}`;
        
    } catch (error) {
        console.error('Error updating payment display:', error);
        paymentDisplay.innerHTML = 'Error loading price';
        paymentTokenDisplay.innerHTML = 'Please try again later';
    }
}

async function approveToken() {
    try {
        const account = await connectWallet();
        if (!account) return;

        const envResponse = await fetch('/api/env');
        const env = await envResponse.json();
        const network = document.getElementById('network').value;

        const contractAddress = await getContractAddress(env);
        const paymentTokenAddress = await getPaymentTokenAddress(env);

        if (!contractAddress || !paymentTokenAddress) {
            throw new Error('Contract or payment token address not found for the selected network.');
        }

        // Initialize ethers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // Get read-only provider for price check
        const rpcProvider = await getProvider(env, network);
        const abiResponse = await fetch('/abi.json');
        const abi = await abiResponse.json();
        
        // Use RPC provider for reading contract data
        const verificationContract = new ethers.Contract(contractAddress, abi, rpcProvider);
        const paymentAmount = await verificationContract.paymentAmount();
        
        console.log('Payment amount from contract:', paymentAmount.toString());

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
        
        console.log('Approving payment token:', {
            network,
            paymentTokenAddress,
            contractAddress,
            amount: paymentAmount.toString()
        });

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
    const tokenId = document.getElementById('tokenId').value || '0';
    const isERC1155 = document.getElementById('isERC1155').value === 'true';

    try {
        const account = await connectWallet();
        if (!account) return;

        const envResponse = await fetch('/api/env');
        const env = await envResponse.json();
        const network = document.getElementById('network').value;
        const contractAddress = await getContractAddress(env);

        if (!contractAddress) {
            throw new Error('Contract address not found for the selected network.');
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const abiResponse = await fetch('/abi.json');
        const abi = await abiResponse.json();
        const nftVerificationContract = new ethers.Contract(contractAddress, abi, signer);

        console.log('Submitting addNFT transaction:', {
            network,
            contractAddress,
            nftAddress,
            tokenId,
            isERC1155
        });

        const tx = await nftVerificationContract.addNFT(nftAddress, tokenId, isERC1155);
        console.log('Transaction submitted:', tx.hash);
        const receipt = await tx.wait();
        console.log('Transaction confirmed:', receipt);

        const nftMappedEvent = receipt.events?.find(event => event.event === 'NFTMapped');
        if (nftMappedEvent) {
            alert(`NFT successfully added!\nAddress: ${nftMappedEvent.args.nftAddress}\nToken ID: ${nftMappedEvent.args.tokenId}\nType: ${nftMappedEvent.args.isERC1155 ? 'ERC1155' : 'ERC721'}`);
        } else {
            alert('NFT added successfully!');
        }
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
    
    selectNFTType(isERC1155 ? '1155' : '721');
    
    if (!tokenId) {
        document.getElementById('tokenId').value = '0';
    }
    
    updatePaymentDisplay();
});

document.addEventListener('DOMContentLoaded', () => {
    const walletButton = document.getElementById('walletButton');
    if (walletButton) {
        walletButton.addEventListener('click', connectWallet);
    }
});
