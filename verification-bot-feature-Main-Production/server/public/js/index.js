async function getDiscordClientId() {
    const response = await fetch('/get-discord-client-id');
    const data = await response.json();
    return data.clientId;
}

document.getElementById('connectDiscordButton').addEventListener('click', async () => {
    const clientId = await getDiscordClientId();
    const redirectUri = encodeURIComponent(`${window.location.origin}/discord-oauth2-callback`);
    const oauthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify`;
    window.location.href = oauthUrl;
});

async function populateNFTOptions() {
    const contractAddress = '0xBbFfad2D49f573eF745cA6Cc26462925027B0cBB'; // Replace with your smart contract address
    const contractABI = [
        {
            "anonymous": false,
            "inputs": [
                { "indexed": true, "internalType": "address", "name": "nftAddress", "type": "address" },
                { "indexed": false, "internalType": "uint256", "name": "tokenId", "type": "uint256" },
                { "indexed": false, "internalType": "bool", "name": "isERC1155", "type": "bool" },
                { "indexed": true, "internalType": "address", "name": "mapper", "type": "address" }
            ],
            "name": "NFTMapped",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                { "indexed": true, "internalType": "address", "name": "nftAddress", "type": "address" },
                { "indexed": true, "internalType": "address", "name": "remover", "type": "address" }
            ],
            "name": "NFTUnmapped",
            "type": "event"
        },
        {
            "inputs": [
                { "internalType": "address", "name": "nftAddress", "type": "address" },
                { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
                { "internalType": "bool", "name": "isERC1155", "type": "bool" }
            ],
            "name": "addNFT",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                { "internalType": "address", "name": "", "type": "address" }
            ],
            "name": "nftMappings",
            "outputs": [
                { "internalType": "address", "name": "nftAddress", "type": "address" },
                { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
                { "internalType": "bool", "name": "isERC1155", "type": "bool" },
                { "internalType": "address", "name": "mapper", "type": "address" }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                { "internalType": "address", "name": "nftAddress", "type": "address" }
            ],
            "name": "removeNFT",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                { "internalType": "address", "name": "user", "type": "address" },
                { "internalType": "address", "name": "nftAddress", "type": "address" }
            ],
            "name": "verifyOwnership",
            "outputs": [
                { "internalType": "bool", "name": "", "type": "bool" }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    const nftMappings = await contract.getAllNFTMappings();

    const select = document.getElementById('nftAddress');
    nftMappings.forEach(mapping => {
        const option = document.createElement('option');
        option.value = mapping.nftAddress;
        option.textContent = `NFT: ${mapping.nftAddress}, Token ID: ${mapping.tokenId}, Type: ${mapping.isERC1155 ? 'ERC1155' : 'ERC721'}`;
        select.appendChild(option);
    });
}

async function submitNFT(event) {
    event.preventDefault();
    const nftAddress = document.getElementById('nftAddress').value;
    const walletAddress = getQueryParam('walletAddress'); // Ensure this parameter is being passed correctly
    const discordId = getQueryParam('discordId');

    sendAddressAndSignatureToServer(walletAddress, '', discordId, nftAddress); // Assuming sendAddressAndSignatureToServer is defined elsewhere
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
