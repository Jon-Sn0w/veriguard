const { ethers } = require('ethers');
require('dotenv').config();

(async () => {
    const walletAddress = '0x86fBF03CCF0FE152B2aBE2B43bA82662c59Ac1B4';
    const nftAddress = '0x288F45e46aD434808c65880dCc2F21938b7Da23d';

    // Connect to Ethereum provider
    const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);

    // Set up the ERC-1155 contract instance
    const nftContract = new ethers.Contract(
        nftAddress,
        [
            "function balanceOf(address account, uint256 id) view returns (uint256)",
            "function supportsInterface(bytes4 interfaceId) view returns (bool)"
        ],
        provider
    );

    try {
        // Check if the contract supports ERC-1155 interface
        const isERC1155 = await nftContract.supportsInterface("0xd9b67a26"); // ERC-1155 interface ID
        if (!isERC1155) {
            console.error("The provided contract is not an ERC-1155 contract.");
            return;
        }

        let totalBalance = ethers.BigNumber.from(0);

        // Iterate through token IDs from 1 to 10,000 to get user's balance
        for (let tokenId = 1; tokenId <= 10000; tokenId++) {
            try {
                const balance = await nftContract.balanceOf(walletAddress, tokenId);
                if (balance.gt(0)) {
                    totalBalance = totalBalance.add(balance);
                    console.log(`User balance for Token ID ${tokenId}: ${balance.toString()}`);
                }
            } catch (error) {
                console.error(`Error fetching balance for token ID ${tokenId}: ${error.message}`);
            }
        }

        console.log(`Total value of NFTs held by user ${walletAddress}: ${totalBalance.toString()}`);
    } catch (error) {
        console.error('Error:', error);
    }
})();
