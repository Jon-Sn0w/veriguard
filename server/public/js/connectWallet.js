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

async function connectWallet() {
    try {
        // Check if MetaMask is installed
        if (!window.ethereum) {
            const messageContainer = document.getElementById('messageContainer');
            messageContainer.innerHTML = `
                <div class="bg-red-600 text-white p-4 rounded shadow-md max-w-xl mx-auto mt-4">
                    MetaMask is not installed. Please install MetaMask and try again.
                </div>
            `;
            return;
        }

        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const walletAddress = accounts[0];

        // Display success message
        const messageContainer = document.getElementById('messageContainer');
        messageContainer.innerHTML = `
            <div class="bg-black text-white p-4 rounded shadow-md max-w-xl mx-auto mt-4">
                Wallet connected successfully! Address: ${truncateAddress(walletAddress)}
            </div>
        `;
    } catch (error) {
        console.error('Failed to connect wallet:', error);
        const messageContainer = document.getElementById('messageContainer');
        messageContainer.innerHTML = `
            <div class="bg-red-600 text-white p-4 rounded shadow-md max-w-xl mx-auto mt-4">
                Failed to connect wallet. Please try again.
            </div>
        `;
    }
}

async function connectWalletNoSign() {
    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        console.log(`Connected with account: ${account}`);
        
        displayMessage('walletConnectionMessage', `Wallet connected successfully! Address: ${account}`);
        return account;
    } catch (error) {
        console.error('Failed to connect wallet:', error);
        displayMessage('errorMessage', 'Failed to connect wallet. Please try again.');
        return null;
    }
}

function displayMessage(elementId, message) {
    const messageContainer = document.getElementById(elementId);
    if (messageContainer) {
        messageContainer.textContent = message;
        messageContainer.classList.remove('hidden');
    }
}

function truncateAddress(address) {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}
