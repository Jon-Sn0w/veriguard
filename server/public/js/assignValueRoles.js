const { ethers } = require('ethers');
require('dotenv').config();

const nftContractAbi = [
    {
        "constant": true,
        "inputs": [
            { "name": "account", "type": "address" },
            { "name": "id", "type": "uint256" }
        ],
        "name": "balanceOf",
        "outputs": [{ "name": "", "type": "uint256" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

const verificationContractAbi = [
    {
        "inputs": [
            { "internalType": "address", "name": "nftAddress", "type": "address" },
            { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
        ],
        "name": "nftValueRoles",
        "outputs": [
            { "internalType": "string", "name": "roleName", "type": "string" },
            { "internalType": "uint256", "name": "requiredValue", "type": "uint256" },
            { "internalType": "address", "name": "registrant", "type": "address" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "nftAddress", "type": "address" },
            { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
        ],
        "name": "nftValueMappings",
        "outputs": [
            { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

async function assignRolesBasedOnValue(userAddress, nftAddress, totalNFTCount) {
    try {
        const rpcUrl = process.env.SONGBIRD_RPC_URL;
        const verificationContractAddress = process.env.SONGBIRD_CONTRACT_ADDRESS;
        
        if (!rpcUrl || !verificationContractAddress) {
            console.error('RPC URL or contract address is not defined. Please check your .env file.');
            return { eligible: false, roleName: null, hasValueRole: false };
        }

        const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
        const verificationContract = new ethers.Contract(verificationContractAddress, verificationContractAbi, provider);
        const nftContract = new ethers.Contract(nftAddress, nftContractAbi, provider);

        console.log(`Fetching value roles for NFT Address: ${nftAddress}`);
        let valueRoles;
        try {
            valueRoles = await verificationContract.nftValueRoles(nftAddress, 0);
        } catch (error) {
            if (error.message.includes('execution reverted')) {
                console.log(`No value-based roles defined for NFT ${nftAddress}`);
                return { eligible: false, roleName: null, hasValueRole: false };
            }
            throw error;
        }

        const roleName = valueRoles.roleName;
        const requiredValue = valueRoles.requiredValue;
        console.log(`Role Name: ${roleName}`);
        console.log(`Required Value: ${requiredValue}`);

        const { totalUserValue, isEligible } = await calculateTotalValue(userAddress, nftAddress, nftContract, verificationContract, totalNFTCount, requiredValue);

        console.log(`Total value of NFTs held by user ${userAddress}: ${totalUserValue}`);

        if (isEligible) {
            console.log(`User meets the required value for role: ${roleName}`);
            return { eligible: true, roleName, hasValueRole: true };
        } else {
            console.log(`User does not meet the required value for role: ${roleName}`);
            return { eligible: false, roleName, hasValueRole: true };
        }
    } catch (error) {
        console.error('Error fetching value-based roles from the contract:', error);
        return { eligible: false, roleName: null, hasValueRole: false };
    }
}

async function calculateTotalValue(userAddress, nftAddress, nftContract, verificationContract, totalNFTCount, requiredValue) {
    let totalValue = 0;
    let foundNFTs = 0;

    try {
        for (let tokenId = 0; tokenId < 10000; tokenId++) {
            if (foundNFTs >= totalNFTCount) {
                console.log(`Found all ${totalNFTCount} NFTs. Stopping search.`);
                break;
            }

            try {
                const balance = await nftContract.balanceOf(userAddress, tokenId);

                if (balance > 0) {
                    foundNFTs += balance;
                    const tokenValue = await verificationContract.nftValueMappings(nftAddress, tokenId);
                    console.log(`User holds ${balance} of Token ID ${tokenId} with value ${tokenValue}`);

                    const calculatedValue = balance * tokenValue;
                    totalValue += calculatedValue;
                    console.log(`Calculated value for Token ID ${tokenId}: ${calculatedValue}, Running Total: ${totalValue}`);

                    if (totalValue >= requiredValue) {
                        console.log(`Required value ${requiredValue} met or exceeded. Stopping calculation.`);
                        return { totalUserValue: totalValue, isEligible: true };
                    }
                }
            } catch (innerError) {
                console.error(`Error retrieving balance or value for token ID ${tokenId}:`, innerError);
            }
        }
    } catch (error) {
        console.error(`Error calculating total value for NFT address ${nftAddress}:`, error);
    }

    return { totalUserValue: totalValue, isEligible: totalValue >= requiredValue };
}

module.exports = {
    assignRolesBasedOnValue,
};
