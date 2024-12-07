const { Client, GatewayIntentBits, REST, Routes, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { ethers } = require('ethers');
const assignValueRoles = require('./server/public/js/assignValueRoles');
const { assignRolesBasedOnValue } = require('./server/public/js/assignValueRoles');
const sessionManager = require('./server/sessionManager');
const userDataManager = require('./server/userDataManager');
const { verifyNFTOwnership, verifyERC721Ownership } = require('./server/public/js/verification');
const Redis = require('ioredis');
require('dotenv').config();

// Initialize Redis
const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

// Initialize Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ]
});

// Helper functions
async function getChainContract(chain) {
    let contractAddress, rpcUrl;
    
    if (chain.toLowerCase() === 'songbird') {
        contractAddress = process.env.SONGBIRD_CONTRACT_ADDRESS;
        rpcUrl = process.env.SONGBIRD_RPC_URL;
    } else if (chain.toLowerCase() === 'flare') {
        contractAddress = process.env.FLARE_CONTRACT_ADDRESS;
        rpcUrl = process.env.FLARE_RPC_URL;
    } else if (chain.toLowerCase() === 'basechain') {
        contractAddress = process.env.BASECHAIN_CONTRACT_ADDRESS;
        rpcUrl = process.env.BASECHAIN_RPC_URL;
    } else {
        throw new Error('Invalid chain specified');
    }

    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const contract = new ethers.Contract(
        contractAddress,
        require('./server/abi.json'),
        provider
    );

    return { contract, provider, contractAddress, rpcUrl };
}

async function checkValueRoles(nftVerificationContract, nftAddress, walletAddress, count, ownedTokenIds = []) {
    try {
        if (ownedTokenIds && ownedTokenIds.length > 0) {
            console.log('Using specific token IDs for value calculation:', ownedTokenIds);
            return await assignRolesBasedOnValue(nftVerificationContract, walletAddress, nftAddress, count, ownedTokenIds);
        }
        const result = await assignRolesBasedOnValue(nftVerificationContract, walletAddress, nftAddress, count);
        return result;
    } catch (error) {
        console.error('Error checking value roles:', error);
        return { hasValueRole: false, error };
    }
}

async function storeVerificationResult(userId, nftAddress, result) {
    try {
        const key = `verification:${userId}:${nftAddress}`;
        await redisClient.setex(
            key,
            3600,
            JSON.stringify({
                ...result,
                timestamp: Date.now()
            })
        );
    } catch (error) {
        console.error('Error storing verification result:', error);
    }
}

async function getStoredVerificationResult(userId, nftAddress) {
    try {
        const key = `verification:${userId}:${nftAddress}`;
        const stored = await redisClient.get(key);
        if (stored) {
            const result = JSON.parse(stored);
            if (Date.now() - result.timestamp < 300000) {
                return result;
            }
        }
        return null;
    } catch (error) {
        console.error('Error retrieving verification result:', error);
        return null;
    }
}

const commands = [
    {
        name: 'verify',
        description: 'Verify your wallet and NFT ownership',
        options: [
            {
                name: 'walletaddress',
                type: 3,
                description: 'Your wallet address',
                required: true
            },
            {
                name: 'nftaddress',
                type: 3,
                description: 'NFT contract address',
                required: true
            }
        ]
    },
    {
        name: 'continue',
        description: 'Continue the verification process'
    },
    {
        name: 'updateallroles',
        description: 'Update roles for all users in the server based on the specified NFT address',
        options: [
            {
                name: 'nftaddress',
                type: 3,
                description: 'NFT contract address',
                required: true
            }
        ]
    },
    {
        name: 'addnft',
        description: 'Add an NFT'
    },
    {
        name: 'removenft',
        description: 'Remove an NFT'
    },
    {
        name: 'checkusernfts',
        description: 'Check NFTs owned by a user',
        options: [
            {
                name: 'username',
                type: 3,
                description: 'Discord username',
                required: true
            }
        ]
    },
    {
        name: 'registerrole',
        description: 'Register a role for an NFT'
    },
    {
        name: 'unregisterrole',
        description: 'Unregister a role for an NFT'
    },
    {
        name: 'mapnftvalue',
        description: 'Map a value to an NFT',
        options: [
            {
                name: 'nftaddress',
                type: 3,
                description: 'NFT contract address',
                required: true
            },
            {
                name: 'tokenid',
                type: 3,
                description: 'Token ID',
                required: true
            },
            {
                name: 'value',
                type: 4,
                description: 'Value to map',
                required: true
            }
        ]
    },
    {
        name: 'registervaluerole',
        description: 'Register a value-based role for an NFT'
    },
    {
        name: 'unregistervaluerole',
        description: 'Unregister a value-based role for an NFT'
    }
];
client.once('ready', async () => {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands }
        );
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
    console.log('Discord Bot is ready!');
});

client.on('interactionCreate', async interaction => {
    try {
        // Handle button interactions for chain selection
        if (interaction.isButton()) {
            let chain;
            console.log("Button interaction received:", interaction.customId);
            
            await interaction.deferReply({ ephemeral: true });
            
            if (interaction.customId === 'selectSongbird') {
                chain = 'Songbird';
            } else if (interaction.customId === 'selectFlare') {
                chain = 'Flare';
            } else if (interaction.customId === 'selectBasechain') {
                chain = 'Basechain';
            }
            
            if (chain) {
                const { contract: nftVerificationContract, contractAddress, rpcUrl, provider } = await getChainContract(chain);
                console.log(`Chain selected: ${chain}, Contract Address: ${contractAddress}, RPC URL: ${rpcUrl}`);
                
                // Check for verify command data
                const verifyData = await redisClient.get(`verifyCommand:${interaction.user.id}`);
                if (verifyData) {
                    const { walletAddress, nftAddress, guildId, interactionId, interactionToken } = JSON.parse(verifyData);
                    
                    const verificationId = sessionManager.generateUUID();
                    const verificationUrl = `${process.env.WEB_SERVER_URL}/verify?token=${verificationId}&chain=${chain}`;
                    
                    await sessionManager.storeVerificationData(verificationId, {
                        discordId: interaction.user.id,
                        username: interaction.user.username,
                        walletAddress,
                        nftAddress,
                        verified: false,
                        interactionId,
                        interactionToken,
                        guildId,
                        chain
                    });
                    
                    await redisClient.del(`verifyCommand:${interaction.user.id}`);
                    await interaction.editReply({
                        content: `Please [click here](${verificationUrl}) to verify your wallet and NFT ownership on ${chain}.`,
                        ephemeral: true
                    });
                    return;
                }

                // Check for checkusernfts command data
                const checkUserNFTsData = await redisClient.get(`checkusernfts:${interaction.user.id}`);
                if (checkUserNFTsData) {
                    const { username, userData } = JSON.parse(checkUserNFTsData);
                    const { walletAddresses } = userData;
                    let responseLines = [`**NFT Holdings for ${username}**\n`];

                    for (const walletAddress of walletAddresses) {
                        try {
                            const walletAddressChecksum = ethers.utils.getAddress(walletAddress);
                            let hasNFTs = false;
                            let walletHeaderAdded = false;

                            // Check registered NFT addresses
                            for (const nftAddress of userData.nftAddresses) {
                                if (!nftAddress) continue;

                                try {
                                    // Try contract verification first
                                    const verificationResult = await verifyNFTOwnership(
                                        walletAddressChecksum,
                                        nftAddress,
                                        chain,
                                        provider,
                                        nftVerificationContract
                                    );

                                    if (verificationResult.isOwner) {
                                        if (!walletHeaderAdded) {
                                            responseLines.push(`\n**Wallet: ${walletAddressChecksum}**`);
                                            walletHeaderAdded = true;
                                        }

                                        hasNFTs = true;
                                        let nftLine = `• ${nftAddress} on ${chain}: ${verificationResult.count} NFTs`;
                                        if (verificationResult.method === 'erc721_fallback') {
                                            nftLine += ` (Found via ${verificationResult.method})`;
                                        }

                                        // Check value roles with token IDs if available
                                        const valueRoleInfo = await checkValueRoles(
                                            nftVerificationContract,
                                            nftAddress,
                                            walletAddressChecksum,
                                            verificationResult.count,
                                            verificationResult.ownedTokenIds
                                        );

                                        if (valueRoleInfo.hasValueRole) {
                                            nftLine += ` (Value: ${valueRoleInfo.totalValue}`;
                                            if (valueRoleInfo.isEligible) {
                                                nftLine += `, Eligible for ${valueRoleInfo.roleName})`;
                                            } else {
                                                nftLine += `, Below ${valueRoleInfo.roleName} requirement of ${valueRoleInfo.requiredValue})`;
                                            }
                                        }
                                        
                                        responseLines.push(nftLine);
                                    }
                                } catch (nftError) {
                                    if (!nftError.message.includes('NFT not mapped') && !nftError.message.includes('execution reverted')) {
                                        console.error(`Error checking NFT ${nftAddress}:`, nftError);
                                    }
                                    continue;
                                }
                            }
                        } catch (walletError) {
                            console.error(`Error checking wallet ${walletAddress}:`, walletError);
                        }
                    }

                    if (responseLines.length === 1) {
                        responseLines.push('No NFTs found for this user.');
                    }

                    const response = responseLines.join('\n');

                    if (response.length > 2000) {
                        const chunks = response.match(/.{1,1900}/g);
                        await interaction.editReply({ 
                            content: chunks[0] + "\n*(Continued...)*", 
                            ephemeral: true 
                        });
                        for (let i = 1; i < chunks.length; i++) {
                            await interaction.followUp({ 
                                content: chunks[i], 
                                ephemeral: true 
                            });
                        }
                    } else {
                        await interaction.editReply({ 
                            content: response, 
                            ephemeral: true 
                        });
                    }

                    await redisClient.del(`checkusernfts:${interaction.user.id}`);
                    return;
                }
// Check for updateallroles command data
                const nftAddress = await redisClient.get(`updateallroles:${interaction.user.id}`);
                if (nftAddress) {
                    try {
                        if (!ethers.utils.isAddress(nftAddress)) {
                            throw new Error("Invalid NFT address provided.");
                        }

                        // Track actions
                        const results = {
                            totalProcessed: 0,
                            standardRolesAssigned: [],
                            valueRolesAssigned: [],
                            rolesRemoved: [],
                            errors: []
                        };

                        const userKeys = await redisClient.keys('user:*');
                        if (userKeys.length === 0) {
                            return interaction.editReply({ 
                                content: 'No users registered in this guild for role updates.', 
                                ephemeral: true 
                            });
                        }

                        const processedUsers = new Set();
                        const guildId = interaction.guild.id;

                        await interaction.editReply({ 
                            content: `Beginning role updates for NFT ${nftAddress} on ${chain}...`, 
                            ephemeral: true 
                        });

                        for (const userKey of userKeys) {
                            const userData = JSON.parse(await redisClient.get(userKey));
                            const { discordId, username, walletAddresses, guildIds } = userData;

                            if (processedUsers.has(discordId) || !guildIds.includes(guildId)) {
                                continue;
                            }

                            try {
                                const guild = await client.guilds.fetch(guildId);
                                const member = await guild.members.fetch(discordId);

                                let maxOwnershipInfo = {
                                    isOwner: false,
                                    count: '0',
                                    ownerWallet: '',
                                    ownedTokenIds: []
                                };

                                for (const walletAddress of walletAddresses) {
                                    try {
                                        const walletAddressChecksum = ethers.utils.getAddress(walletAddress);
                                        
                                        // Check cached results first
                                        let verificationResult = await getStoredVerificationResult(discordId, nftAddress);
                                        
                                        if (!verificationResult) {
                                            verificationResult = await verifyNFTOwnership(
                                                walletAddressChecksum,
                                                nftAddress,
                                                chain,
                                                provider,
                                                nftVerificationContract
                                            );

                                            if (verificationResult.isOwner) {
                                                await storeVerificationResult(discordId, nftAddress, verificationResult);
                                            }
                                        }

                                        if (verificationResult.isOwner && 
                                            parseInt(verificationResult.count) > parseInt(maxOwnershipInfo.count)) {
                                            maxOwnershipInfo = {
                                                isOwner: true,
                                                count: verificationResult.count,
                                                ownerWallet: walletAddressChecksum,
                                                ownedTokenIds: verificationResult.ownedTokenIds || []
                                            };
                                        }
                                    } catch (walletError) {
                                        if (!walletError.message.includes('NFT not mapped')) {
                                            console.error(`Error checking wallet ${walletAddress}:`, walletError);
                                        }
                                        continue;
                                    }
                                }

                                if (maxOwnershipInfo.isOwner) {
                                    console.log(`User owns NFTs in wallet: ${maxOwnershipInfo.ownerWallet}, Count: ${maxOwnershipInfo.count}`);

                                    // Check standard roles first
                                    const rolesData = await nftVerificationContract.getRolesForNFT(nftAddress);
                                    const standardRoles = rolesData.map(role => role.roleName);

                                    if (standardRoles.length > 0) {
                                        // Filter out roles that don't exist in the guild
                                        const existingRoleObjects = standardRoles
                                            .map(role => {
                                                const found = guild.roles.cache.find(r => r.name === role);
                                                if (!found) {
                                                    console.log(`Role '${role}' not found in guild - skipping assignment`);
                                                    return null;
                                                }
                                                return found;
                                            })
                                            .filter(Boolean);

                                        // Only proceed if we found any existing roles
                                        if (existingRoleObjects.length > 0) {
                                            await member.roles.add(existingRoleObjects);
                                            const assignedRoles = existingRoleObjects.map(r => r.name).join(', ');
                                            results.standardRolesAssigned.push(`${username} (${assignedRoles})`);
                                        }
                                    }

                                    // Check for value roles with token IDs
                                    const valueRoleInfo = await checkValueRoles(
                                        nftVerificationContract,
                                        nftAddress,
                                        maxOwnershipInfo.ownerWallet,
                                        maxOwnershipInfo.count,
                                        maxOwnershipInfo.ownedTokenIds
                                    );

                                    if (valueRoleInfo.hasValueRole) {
                                        const valueRole = guild.roles.cache.find(r => r.name === valueRoleInfo.roleName);
                                        
                                        if (valueRole) {
                                            if (valueRoleInfo.isEligible) {
                                                if (!member.roles.cache.has(valueRole.id)) {
                                                    await member.roles.add(valueRole);
                                                    results.valueRolesAssigned.push(
                                                        `${username} (${valueRoleInfo.roleName}, Value: ${valueRoleInfo.totalValue})`
                                                    );
                                                }
                                            } else if (member.roles.cache.has(valueRole.id)) {
                                                await member.roles.remove(valueRole);
                                                results.rolesRemoved.push(
                                                    `${username} (${valueRoleInfo.roleName}, Insufficient Value: ${valueRoleInfo.totalValue}/${valueRoleInfo.requiredValue})`
                                                );
                                            }
                                        }
                                    }
                                } else {
                                    // Check if user had any value roles that need to be removed
                                    const valueRoleInfo = await checkValueRoles(
                                        nftVerificationContract,
                                        nftAddress,
                                        maxOwnershipInfo.ownerWallet,
                                        0,
                                        []
                                    );
                                    if (valueRoleInfo.hasValueRole) {
                                        const valueRole = guild.roles.cache.find(r => r.name === valueRoleInfo.roleName);
                                        if (valueRole && member.roles.cache.has(valueRole.id)) {
                                            await member.roles.remove(valueRole);
                                            results.rolesRemoved.push(`${username} (${valueRoleInfo.roleName}, No NFTs)`);
                                        }
                                    }
                                }

                                results.totalProcessed++;
                                processedUsers.add(discordId);

                            } catch (userError) {
                                console.error(`Error processing user ${userData.username}:`, userError);
                                results.errors.push(username);
                            }
                        }

                        // Build response message
                        let responseMessage = `**Role Update Complete on ${chain}**\n\n`;

                        if (results.standardRolesAssigned.length > 0) {
                            responseMessage += '**Standard Roles Assigned:**\n';
                            results.standardRolesAssigned.forEach(entry => {
                                responseMessage += `• ${entry}\n`;
                            });
                        }

                        if (results.valueRolesAssigned.length > 0) {
                            responseMessage += '\n**Value-Based Roles Assigned:**\n';
                            results.valueRolesAssigned.forEach(entry => {
                                responseMessage += `• ${entry}\n`;
                            });
                        }

                        if (results.rolesRemoved.length > 0) {
                            responseMessage += '\n**Roles Removed:**\n';
                            results.rolesRemoved.forEach(entry => {
                                responseMessage += `• ${entry}\n`;
                            });
                        }

                        if (results.errors.length > 0) {
                            responseMessage += '\n**Errors Processing:**\n';
                            results.errors.forEach(username => {
                                responseMessage += `• ${username}\n`;
                            });
                        }

                        if (responseMessage === `**Role Update Complete on ${chain}**\n\n`) {
                            responseMessage = `Role update complete on ${chain}. No changes were required.`;
                        }

                        if (responseMessage.length > 2000) {
                            const chunks = responseMessage.match(/.{1,1900}/g);
                            await interaction.editReply({ content: chunks[0] + "\n*(Continued...)*", ephemeral: true });
                            for (let i = 1; i < chunks.length; i++) {
                                await interaction.followUp({ content: chunks[i], ephemeral: true });
                            }
                        } else {
                            await interaction.editReply({ content: responseMessage, ephemeral: true });
                        }

                        await redisClient.del(`updateallroles:${interaction.user.id}`);

                    } catch (error) {
                        console.error('Role update failed:', error);
                        await interaction.editReply({ 
                            content: `Role update failed on ${chain}: ${error.message}. Please try again.`, 
                            ephemeral: true 
                        });
                    }
                }
            }
            return;
        }
if (!interaction.isCommand()) return;

        const { commandName, options } = interaction;

        if (commandName === 'verify') {
            await interaction.deferReply({ ephemeral: true });
            const walletAddress = options.getString('walletaddress');
            const nftAddress = options.getString('nftaddress');

            if (!ethers.utils.isAddress(walletAddress) || !ethers.utils.isAddress(nftAddress)) {
                return interaction.editReply({ content: 'Invalid wallet or NFT address provided.', ephemeral: true });
            }

            // Store verify data first
            await redisClient.set(`verifyCommand:${interaction.user.id}`, JSON.stringify({
                walletAddress,
                nftAddress,
                guildId: interaction.guild.id,
                interactionId: interaction.id,
                interactionToken: interaction.token
            }));

            // Show chain selection buttons
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('selectSongbird')
                        .setLabel('Songbird')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('selectFlare')
                        .setLabel('Flare')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('selectBasechain')
                        .setLabel('Basechain')
                        .setStyle(ButtonStyle.Success)
                );

            await interaction.editReply({
                content: 'Please select the network you want to use for verification:',
                components: [row],
                ephemeral: true
            });
            return;

        } else if (commandName === 'continue') {
    await interaction.deferReply({ ephemeral: true });
    const userId = interaction.user.id;
    const verificationData = await sessionManager.retrieveVerificationDataByDiscordId(userId);

    if (!verificationData) {
        return interaction.editReply({ 
            content: 'Please complete the wallet verification first or ensure all data was submitted correctly.', 
            ephemeral: true 
        });
    }

    try {
        const { walletAddress, nftAddress, chain } = verificationData;
        const progressMessage = await interaction.editReply({ 
            content: '⏳ Verifying NFT ownership... This may take a few moments.',
            ephemeral: true 
        });

        const { contract: nftVerificationContract, provider } = await getChainContract(chain);
        
        // Create a progress updater
        let progressDots = 0;
        const progressInterval = setInterval(async () => {
            progressDots = (progressDots + 1) % 4;
            const dots = '.'.repeat(progressDots);
            try {
                await progressMessage.edit({ 
                    content: `⏳ Verifying NFT ownership${dots.padEnd(3, ' ')}`,
                    ephemeral: true 
                });
            } catch (e) {
                // Ignore edit errors if message was already updated
            }
        }, 800);

        try {
            // Check cached results first
            let verificationResult = await getStoredVerificationResult(userId, nftAddress);
            
            if (!verificationResult) {
                verificationResult = await verifyNFTOwnership(
                    walletAddress,
                    nftAddress,
                    chain,
                    provider,
                    nftVerificationContract
                );

                // Cache successful verifications
                if (verificationResult.isOwner) {
                    await storeVerificationResult(userId, nftAddress, verificationResult);
                }
            }

            // Clear the progress interval
            clearInterval(progressInterval);

            if (verificationResult.isOwner) {
                const rolesData = await nftVerificationContract.getRolesForNFT(nftAddress);
                const roles = rolesData.map(role => role.roleName);
                let responseMessage = '✅ NFT ownership verified successfully!';
                let roleAssignmentResults = [];

                // Handle standard role assignment
                if (roles.length > 0) {
                    const guild = await client.guilds.fetch(interaction.guild.id);
                    const member = await guild.members.fetch(userId);

                    const roleObjects = roles
                        .map(role => {
                            const found = guild.roles.cache.find(r => r.name === role);
                            if (!found) {
                                roleAssignmentResults.push(`⚠️ Role '${role}' not found in server`);
                                return null;
                            }
                            return found;
                        })
                        .filter(Boolean);

                    for (const role of roleObjects) {
                        try {
                            await member.roles.add(role);
                            roleAssignmentResults.push(`✅ Role '${role.name}' assigned`);
                        } catch (roleError) {
                            roleAssignmentResults.push(`❌ Failed to assign role '${role.name}'`);
                        }
                    }
                }

                // Handle value roles with token IDs if available
                try {
                    const valueRoleInfo = await checkValueRoles(
                        nftVerificationContract,
                        nftAddress,
                        walletAddress,
                        verificationResult.count,
                        verificationResult.ownedTokenIds
                    );

                    if (valueRoleInfo.hasValueRole) {
                        const guild = await client.guilds.fetch(interaction.guild.id);
                        const member = await guild.members.fetch(userId);
                        const valueRole = guild.roles.cache.find(r => r.name === valueRoleInfo.roleName);

                        if (valueRole) {
                            if (valueRoleInfo.isEligible) {
                                await member.roles.add(valueRole);
                                roleAssignmentResults.push(
                                    `✅ Value-based role '${valueRoleInfo.roleName}' assigned ` +
                                    `(Value: ${valueRoleInfo.totalValue})`
                                );
                            } else if (member.roles.cache.has(valueRole.id)) {
                                await member.roles.remove(valueRole);
                                roleAssignmentResults.push(
                                    `ℹ️ Value-based role '${valueRoleInfo.roleName}' removed ` +
                                    `(Current Value: ${valueRoleInfo.totalValue}, Required: ${valueRoleInfo.requiredValue})`
                                );
                            } else {
                                roleAssignmentResults.push(
                                    `ℹ️ Insufficient value for role '${valueRoleInfo.roleName}' ` +
                                    `(Current Value: ${valueRoleInfo.totalValue}, Required: ${valueRoleInfo.requiredValue})`
                                );
                            }
                        } else {
                            roleAssignmentResults.push(`⚠️ Value-based role '${valueRoleInfo.roleName}' not found in server`);
                        }
                    }
                } catch (valueRoleError) {
                    if (!valueRoleError.message.includes('NFT not mapped')) {
                        roleAssignmentResults.push(`❌ Error checking value roles: ${valueRoleError.message}`);
                    }
                }

                if (roleAssignmentResults.length > 0) {
                    responseMessage += '\n\n' + roleAssignmentResults.join('\n');
                } else {
                    responseMessage += '\n\nℹ️ No roles configured for this NFT.';
                }

                await interaction.editReply({ content: responseMessage, ephemeral: true });

            } else {
                await interaction.editReply({ 
                    content: '❌ NFT ownership could not be verified.',
                    ephemeral: true 
                });
            }

        } catch (error) {
            clearInterval(progressInterval);
            console.error('Verification processing error:', error);
            await interaction.editReply({ 
                content: '❌ Verification failed. Please try again.',
                ephemeral: true 
            });
        }

        // Cleanup
        await sessionManager.deleteVerificationData(verificationData.interactionToken);

        // Run Redis cleanup
        const { cleanRedisKeys } = require('./server/public/js/cleanRedis');
        await cleanRedisKeys();
        console.log('Ran cleanRedisKeys successfully.');

    } catch (error) {
        console.error('NFT verification failed:', error);
        await interaction.editReply({ 
            content: '❌ An error occurred during verification. Please try again.',
            ephemeral: true 
        });
      }
    } else if (commandName === 'checkusernfts') {
            await interaction.deferReply({ ephemeral: true });

            // Check for admin permissions
            if (!interaction.member.permissions.has('Administrator')) {
                return interaction.editReply({ 
                    content: 'You need administrator permissions to use this command.', 
                    ephemeral: true 
                });
            }

            const requestedUsername = options.getString('username');
            
            try {
                // Get user data from Redis
                const userKeys = await redisClient.keys('user:*');
                let userData = null;

                for (const key of userKeys) {
                    const data = JSON.parse(await redisClient.get(key));
                    if (data.username.toLowerCase() === requestedUsername.toLowerCase()) {
                        userData = data;
                        break;
                    }
                }

                if (!userData) {
                    return interaction.editReply({ 
                        content: `No data found for user ${requestedUsername}`, 
                        ephemeral: true 
                    });
                }

                // Store data for chain selection
                await redisClient.set(`checkusernfts:${interaction.user.id}`, JSON.stringify({
                    username: requestedUsername,
                    userData: userData
                }));

                // Show chain selection buttons
                const row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('selectSongbird')
            .setLabel('Songbird')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('selectFlare')
            .setLabel('Flare')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('selectBasechain')
            .setLabel('Basechain')
            .setStyle(ButtonStyle.Success)
    );

                await interaction.editReply({
                    content: 'Please select the network to check NFTs:',
                    components: [row],
                    ephemeral: true
                });

            } catch (error) {
                console.error('Error in checkusernfts:', error);
                await interaction.editReply({ 
                    content: `Error checking NFTs: ${error.message}. Please try again.`, 
                    ephemeral: true 
                });
            }

        } else if (commandName === 'updateallroles') {
            await interaction.deferReply({ ephemeral: true });

            // Check for admin permissions
            if (!interaction.member.permissions.has('Administrator')) {
                return interaction.editReply({ 
                    content: 'You need administrator permissions to use this command.', 
                    ephemeral: true 
                });
            }

            const nftAddress = options.getString('nftaddress');

            if (!ethers.utils.isAddress(nftAddress)) {
                return interaction.editReply({ 
                    content: 'Invalid NFT address provided.', 
                    ephemeral: true 
                });
            }

            // Store NFT address for later use
            await redisClient.set(`updateallroles:${interaction.user.id}`, nftAddress);

            // Show chain selection buttons
            const row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('selectSongbird')
            .setLabel('Songbird')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('selectFlare')
            .setLabel('Flare')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('selectBasechain')
            .setLabel('Basechain')
            .setStyle(ButtonStyle.Success)
    );

            await interaction.editReply({
                content: 'Please select the network for role updates:',
                components: [row],
                ephemeral: true
            });
            return;

        } else if (commandName === 'addnft') {
            await interaction.deferReply({ ephemeral: true });
            const url = `${process.env.WEB_SERVER_URL}/addnft`;
            await interaction.editReply({ content: `Please [click here](${url}) to add an NFT.`, ephemeral: true });

        } else if (commandName === 'removenft') {
            await interaction.deferReply({ ephemeral: true });
            const url = `${process.env.WEB_SERVER_URL}/removenft`;
            await interaction.editReply({ content: `Please [click here](${url}) to remove an NFT.`, ephemeral: true });

        } else if (commandName === 'registerrole') {
            await interaction.deferReply({ ephemeral: true });
            const url = `${process.env.WEB_SERVER_URL}/registerrole`;
            await interaction.editReply({ content: `Please [click here](${url}) to register a role for an NFT.`, ephemeral: true });

        } else if (commandName === 'unregisterrole') {
            await interaction.deferReply({ ephemeral: true });
            const url = `${process.env.WEB_SERVER_URL}/unregisterrole`;
            await interaction.editReply({ content: `Please [click here](${url}) to unregister a role for an NFT.`, ephemeral: true });

        } else if (commandName === 'mapnftvalue') {
            await interaction.deferReply({ ephemeral: true });
            const nftAddress = options.getString('nftaddress');
            const tokenId = options.getString('tokenid');
            const value = options.getInteger('value');

            if (!ethers.utils.isAddress(nftAddress)) {
                return interaction.editReply({ content: 'Invalid NFT address provided.', ephemeral: true });
            }

            try {
                await nftVerificationContract.mapNFTValue(nftAddress, tokenId, value);
                await interaction.editReply({ content: `NFT value mapped successfully. Value ${value} assigned to token ${tokenId}.`, ephemeral: true });
            } catch (error) {
                console.error('Error mapping NFT value:', error);
                await interaction.editReply({ content: `Error mapping NFT value: ${error.message}`, ephemeral: true });
            }

        } else if (commandName === 'registervaluerole') {
            await interaction.deferReply({ ephemeral: true });
            const url = `${process.env.WEB_SERVER_URL}/registervaluerole`;
            await interaction.editReply({ content: `Please [click here](${url}) to register a value-based role for an NFT.`, ephemeral: true });

        } else if (commandName === 'unregistervaluerole') {
            await interaction.deferReply({ ephemeral: true });
            const url = `${process.env.WEB_SERVER_URL}/unregistervaluerole`;
            await interaction.editReply({ content: `Please [click here](${url}) to unregister a value-based role for an NFT.`, ephemeral: true });
        }
    } catch (error) {
        console.error('Error handling interaction:', error);
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ content: 'An error occurred while processing your request.', ephemeral: true });
        } else {
            await interaction.followUp({ content: 'An error occurred while processing your request.', ephemeral: true });
        }
    }
});

// Clean up Redis keys periodically
const { cleanRedisKeys } = require('./server/public/js/cleanRedis');
setInterval(async () => {
    try {
        await cleanRedisKeys();
        console.log('Ran cleanRedisKeys successfully.');
    } catch (error) {
        console.error('Error running cleanRedisKeys:', error);
    }
}, 3600000); // Run every hour

client.login(process.env.DISCORD_BOT_TOKEN);

module.exports = client;

