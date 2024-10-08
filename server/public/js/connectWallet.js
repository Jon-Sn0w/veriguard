document.addEventListener('DOMContentLoaded', () => {
    const connectWalletButton = document.getElementById('connectWalletButton');
    const walletButton = document.getElementById('walletButton');

    if (connectWalletButton) {
        connectWalletButton.addEventListener('click', async () => {
            connectWalletButton.classList.add('spin-shrink-sparkle');
            await connectWallet();
        });
    }

    if (walletButton) {
        walletButton.addEventListener('click', async () => {
            walletButton.classList.add('spin-shrink-sparkle');
            await connectWalletNoSign();
        });
    }

    if (typeof window.ethereum !== 'undefined') {
        console.log('Wallet detected!');
    } else {
        console.log('No wallet detected. Please install MetaMask or use a web3-enabled browser.');
        alert('No wallet detected. Please install MetaMask or use a web3-enabled browser.');
    }
});

async function connectWalletNoSign() {
    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        console.log(`Connected with account: ${account}`);
        
        // Update UI with wallet connection message
        displayMessage('walletConnectionMessage', `Wallet connected successfully! Address: ${account}`);

        return account;
    } catch (error) {
        console.error('Failed to connect wallet:', error);
        displayMessage('errorMessage', 'Failed to connect wallet. Please try again.');
        return null;
    }
}

// Display success or error messages
function displayMessage(elementId, message) {
    const messageContainer = document.getElementById(elementId);
    if (messageContainer) {
        messageContainer.textContent = message;
        messageContainer.classList.remove('hidden');
    }
}
