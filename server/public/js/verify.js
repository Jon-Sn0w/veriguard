document.getElementById('connectWalletButton').addEventListener('click', async () => {
    await connectWallet();
    // Additional verification logic after wallet connection
    const walletAddress = await ethereum.request({ method: 'eth_accounts' }).then(accounts => accounts[0]);
    const token = getQueryParam('token');
    const chain = document.getElementById('network').value.toLowerCase(); // Get chain from dropdown selection

    try {
        const signature = await signMessage(walletAddress);
        if (!signature) {
            throw new Error('Failed to sign message');
        }

        const response = await fetch('/api/wallet-connect', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'include',
            body: JSON.stringify({ walletAddress, signature, token, chain })
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        const responseText = await response.text();
        console.log('Response text:', responseText);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}, message: ${responseText}`);
        }

        const data = JSON.parse(responseText);
        console.log('Server response:', data);

        // Display the final success message
        const messageContainer = document.getElementById('messageContainer');
        messageContainer.innerHTML = `
            <div class="bg-black text-white p-4 rounded shadow-md max-w-xl mx-auto mt-4">
                Verification successful! Please return to Discord to complete the process by typing /continue.
            </div>
        `;
    } catch (error) {
        console.error('Error verifying NFT:', error);
        const messageContainer = document.getElementById('messageContainer');
        messageContainer.innerHTML = `
            <div class="bg-red-600 text-white p-4 rounded shadow-md max-w-xl mx-auto mt-4">
                Error verifying NFT: ${error.message}
            </div>
        `;
    }
});

async function signMessage(walletAddress) {
    try {
        const message = `Please sign this message to verify you are the owner of the wallet: ${walletAddress}`;
        const signature = await ethereum.request({
            method: 'personal_sign',
            params: [message, walletAddress]
        });
        return signature;
    } catch (error) {
        console.error('Failed to sign message:', error);
        const messageContainer = document.getElementById('messageContainer');
        messageContainer.innerHTML = `
            <div class="bg-red-600 text-white p-4 rounded shadow-md max-w-xl mx-auto mt-4">
                Failed to sign message. Please try again.
            </div>
        `;
        return null;
    }
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
