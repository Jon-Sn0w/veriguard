const { Client, GatewayIntentBits, REST, Routes, EmbedBuilder } = require('discord.js');
const { ethers } = require('ethers');
const assignValueRoles = require('./server/public/js/assignValueRoles');
const sessionManager = require('./server/sessionManager');
const userDataManager = require('./server/userDataManager');
const Redis = require('ioredis');
require('dotenv').config();

const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

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

const nftVerificationContract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    require('./server/abi.json'),
    new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL)
);

const commands = [
    {
        name: 'verify',
        description: 'Verify your wallet and NFT ownership',
        options: [
            {
                name: 'walletaddress',
                type: 3, // STRING
                description: 'Your wallet address',
                required: true
            },
            {
                name: 'nftaddress',
                type: 3, // STRING
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
                type: 3, // STRING
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
                type: 3, // STRING
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
                type: 3, // STRING
                description: 'NFT contract address',
                required: true
            },
            {
                name: 'tokenid',
                type: 3, // STRING
                description: 'Token ID',
                required: true
            },
            {
                name: 'value',
                type: 4, // INTEGER
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
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    try {
        if (commandName === 'verify') {
            await interaction.deferReply({ ephemeral: true });
            const walletAddress = options.getString('walletaddress');
            const nftAddress = options.getString('nftaddress');

            if (!ethers.utils.isAddress(walletAddress) || !ethers.utils.isAddress(nftAddress)) {
                return interaction.editReply({ content: 'Invalid wallet or NFT address provided.', ephemeral: true });
            }

            const verificationId = sessionManager.generateUUID();
            const verificationUrl = `${process.env.WEB_SERVER_URL}/verify?token=${verificationId}`;

            sessionManager.storeVerificationData(verificationId, {
                discordId: interaction.user.id,
                username: interaction.user.username,
                walletAddress,
                nftAddress,
                verified: false,
                interactionId: interaction.id,
                interactionToken: interaction.token,
                guildId: interaction.guild.id // Store the guild ID
            });

            await interaction.editReply({ content: `Please [click here](${verificationUrl}) to verify your wallet and NFT ownership.`, ephemeral: true });

        } else if (commandName === 'continue') {
    await interaction.deferReply({ ephemeral: true });
    const userId = interaction.user.id;
    const verificationData = await sessionManager.retrieveVerificationDataByDiscordId(userId);

    if (!verificationData) {
        return interaction.editReply({ content: 'Please complete the wallet verification first or ensure all data was submitted correctly.', ephemeral: true });
    }

    try {
        const walletAddress = verificationData.walletAddress;
        const nftAddress = verificationData.nftAddress;
        console.log(`Verifying ownership for wallet: ${walletAddress} and NFT: ${nftAddress}`);

        const [isOwner, count] = await nftVerificationContract.verifyOwnershipWithCount(walletAddress, nftAddress);
        console.log(`Is Owner: ${isOwner}, Count: ${count}`);

        if (isOwner) {
            // Call the smart contract function getRolesForNFT
            const rolesData = await nftVerificationContract.getRolesForNFT(nftAddress);
            const roles = rolesData.map(role => role.roleName); // Extracting role names from the contract response

            if (roles.length > 0) {
                const guild = await client.guilds.fetch(interaction.guild.id);
                const member = await guild.members.fetch(userId);

                const roleObjects = roles.map(role => guild.roles.cache.find(r => r.name === role)).filter(Boolean);

                await member.roles.add(roleObjects);
                await interaction.editReply({ content: `NFT ownership verified and roles assigned: ${roles.join(', ')}`, ephemeral: true });

                // Ensure verification data is deleted after role assignment
                await sessionManager.deleteVerificationData(verificationData.interactionToken);
            } else {
                console.log('No standard roles found for the given NFT. Checking for value-based roles...');

                const { eligible, roleName } = await assignValueRoles.assignRolesBasedOnValue(walletAddress, nftAddress, count);

                if (eligible) {
                    console.log(`User is eligible for the value-based role: ${roleName}`);
                    const guild = await client.guilds.fetch(interaction.guild.id);
                    const member = await guild.members.fetch(userId);

                    const role = guild.roles.cache.find(r => r.name === roleName);
                    if (role) {
                        console.log(`Assigning role: ${roleName} to user ${interaction.user.username}`);
                        try {
                            await member.roles.add(role);
                            console.log(`Role ${roleName} successfully assigned to ${interaction.user.username}`);
                            await interaction.editReply({ content: `NFT value-based ownership verified and role assigned: ${roleName}`, ephemeral: true });
                        } catch (roleAssignError) {
                            console.error(`Error assigning role: ${roleAssignError}`);
                            await interaction.editReply({ content: `Error assigning role: ${roleAssignError.message}`, ephemeral: true });
                        }
                    } else {
                        console.log(`Role not found in guild: ${roleName}`);
                        await interaction.editReply({ content: `Role ${roleName} could not be found in the server.`, ephemeral: true });
                    }
                } else {
                    console.log('User does not meet the value requirements for any roles.');
                    await interaction.editReply({ content: 'You do not meet the value requirements for any roles.', ephemeral: true });
                }

                // Ensure verification data is deleted after role assignment attempt
                await sessionManager.deleteVerificationData(verificationData.interactionToken);
            }
        } else {
            await interaction.editReply({ content: 'NFT ownership could not be verified.', ephemeral: true });
        }
    } catch (error) {
        console.error('NFT verification failed:', error);
        await interaction.editReply({ content: `NFT verification failed: ${error.message}. Please try again.`, ephemeral: true });
    }

    // Run cleanRedis.js after the process is completed
    const { cleanRedisKeys } = require('./server/public/js/cleanRedis');
    await cleanRedisKeys();
    console.log('Ran cleanRedisKeys successfully.');
} else if (commandName === 'updateallroles') {
            await interaction.deferReply({ ephemeral: true });
            const nftAddress = options.getString('nftaddress');
            const logEvents = [];

            try {
                const guildId = interaction.guild.id;
                const guild = await client.guilds.fetch(guildId);
                const keys = await redisClient.keys('user:*');

                for (const key of keys) {
                    const userData = JSON.parse(await redisClient.get(key));

                    if (userData.guildIds && userData.guildIds.includes(guildId)) {
                        logEvents.push(`Processing user: ${userData.username}`);

                        const walletAddresses = userData.walletAddresses || [];
                        const member = await guild.members.fetch(userData.discordId);

                        if (!member.manageable) {
                            logEvents.push(`Skipped ${userData.username}: Bot lacks permission to manage roles.`);
                            continue;
                        }

                        let totalCount = 0;
                        let isOwner = false;

                        for (const walletAddress of walletAddresses) {
                            try {
                                const nftMappings = await nftVerificationContract.nftMappings(nftAddress);
                                for (const mapping of nftMappings) {
                                    const { tokenId, requiredCount } = mapping;
                                    const balance = await nftVerificationContract.balanceOf(walletAddress, tokenId);
                                    if (balance.gte(requiredCount)) {
                                        isOwner = true;
                                        totalCount += balance.toNumber();
                                    }
                                }
                            } catch (error) {
                                console.error(`Error verifying ownership for ${userData.username}:`, error);
                                logEvents.push(`Error verifying ownership for ${userData.username}: ${error.message}`);
                            }
                        }

                        const currentRoles = member.roles.cache;

                        // Standard role processing
                        if (isOwner) {
                            const rolesToAssign = await getRolesForNFT(nftAddress, totalCount);
                            const roleObjects = rolesToAssign.map(roleName => guild.roles.cache.find(r => r.name === roleName)).filter(Boolean);

                            const rolesToAdd = roleObjects.filter(role => !currentRoles.has(role.id));
                            if (rolesToAdd.length > 0) {
                                await member.roles.add(rolesToAdd);
                                logEvents.push(`Assigned standard roles to ${userData.username}: ${rolesToAdd.map(role => role.name).join(', ')}`);
                            } else {
                                logEvents.push(`No new standard roles to assign for ${userData.username}`);
                            }

                            // Value-based role processing
                            try {
                                const { eligible, roleName, hasValueRole } = await assignValueRoles.assignRolesBasedOnValue(walletAddresses[0], nftAddress, totalCount);
                                
                                if (hasValueRole) {
                                    const valueRole = guild.roles.cache.find(r => r.name === roleName);
                                    if (eligible && valueRole) {
                                        if (!currentRoles.has(valueRole.id)) {
                                            await member.roles.add(valueRole);
                                            logEvents.push(`Assigned value-based role to ${userData.username}: ${roleName}`);
                                        } else {
                                            logEvents.push(`${userData.username} already has the value-based role: ${roleName}`);
                                        }
                                    } else if (valueRole && currentRoles.has(valueRole.id)) {
                                        await member.roles.remove(valueRole);
                                        logEvents.push(`Removed value-based role from ${userData.username}: ${roleName} (no longer eligible)`);
                                    } else if (eligible) {
                                        logEvents.push(`Value-based role ${roleName} not found in the server for ${userData.username}`);
                                    } else {
                                        logEvents.push(`${userData.username} does not meet the value requirements for role: ${roleName}`);
                                    }
                                }
                            } catch (valueRoleError) {
                                console.error(`Error processing value-based roles for ${userData.username}:`, valueRoleError);
                                logEvents.push(`Error processing value-based roles for ${userData.username}: ${valueRoleError.message}`);
                            }
                        } else {
                            // Remove all roles related to this NFT if the user no longer owns it
                            const rolesToRemove = currentRoles.filter(role => 
                                (role.name.startsWith("NFT_") || role.name.startsWith("Value_")) && 
                                role.name.includes(nftAddress)
                            );
                            if (rolesToRemove.size > 0) {
                                await member.roles.remove(rolesToRemove);
                                logEvents.push(`Removed roles from ${userData.username}: ${rolesToRemove.map(role => role.name).join(', ')} (no longer owns NFT)`);
                            } else {
                                logEvents.push(`No roles to remove for ${userData.username}`);
                            }
                        }
                    }
                }

                await interaction.editReply({ content: `Process completed.\n\n${logEvents.join('\n')}`, ephemeral: true });
            } catch (error) {
                console.error('Error during role update process:', error);
                await interaction.editReply({ content: `An error occurred while updating roles.\n\n${logEvents.join('\n')}`, ephemeral: true });
            }
        } else if (commandName === 'checkusernfts') {
            await interaction.deferReply({ ephemeral: true });
            const username = options.getString('username');
            const userData = userDataManager.retrieveUserData(username);

            if (!userData) {
                return interaction.editReply({ content: 'User data not found.', ephemeral: true });
            }

            const { walletAddresses } = userData;
            let replyMessage = `NFTs owned by user ${username}:\n`;

            for (const walletAddress of walletAddresses) {
                try {
                    const [nftAddresses, tokenCounts] = await nftVerificationContract.checkUserNFTs(walletAddress);
                    for (let i = 0; i < nftAddresses.length; i++) {
                        replyMessage += `Wallet: ${walletAddress}\nNFT: ${nftAddresses[i]}, Count: ${tokenCounts[i].toString()}\n`;
                    }
                } catch (error) {
                    console.error(`Error checking NFTs for wallet ${walletAddress}:`, error);
                    replyMessage += `Error checking NFTs for wallet ${walletAddress}: ${error.message}\n`;
                }
            }

            await interaction.editReply({ content: replyMessage, ephemeral: true });
            
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
                await interaction.editReply({ content: 'NFT value mapped successfully.', ephemeral: true });
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

async function getRolesForTokenId(nftAddress, tokenId) {
    try {
        const roles = [];

        const nftRoles = await nftVerificationContract.getRolesForTokenId(nftAddress, tokenId);

        for (const role of nftRoles) {
            roles.push(role.roleName);
        }

        return roles;
    } catch (error) {
        console.error('Error fetching roles for token ID:', error);
        return [];
    }
}

client.login(process.env.DISCORD_BOT_TOKEN);
