const { Client, GatewayIntentBits, REST, Routes, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
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

async function safeRoleManagement(member, role, action, username) {
    try {
        const guild = member.guild;
        const botMember = await guild.members.fetchMe();

        // Perform the role action
        if (action === 'add') {
            await member.roles.add(role);
            console.log(`Successfully added role ${role.name} to ${username}`);
            return { success: true, message: `Role ${role.name} added` };
        } else if (action === 'remove') {
            await member.roles.remove(role);
            console.log(`Successfully removed role ${role.name} from ${username}`);
            return { success: true, message: `Role ${role.name} removed` };
        }

    } catch (error) {
        console.log(`Role management error for ${username}:`, error);
        return { 
            success: false, 
            reason: 'ERROR',
            message: error.message 
        };
    }
}

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
            let contractAddress, rpcUrl, chain;
            console.log("Button interaction received:", interaction.customId);

            if (interaction.customId === 'selectSongbird') {
                contractAddress = process.env.SONGBIRD_CONTRACT_ADDRESS;
                rpcUrl = process.env.SONGBIRD_RPC_URL;
                chain = 'Songbird';
            } else if (interaction.customId === 'selectFlare') {
                contractAddress = process.env.FLARE_CONTRACT_ADDRESS;
                rpcUrl = process.env.FLARE_RPC_URL;
                chain = 'Flare';
            }

            if (contractAddress && rpcUrl) {
                console.log(`Chain selected: ${chain}, Contract Address: ${contractAddress}, RPC URL: ${rpcUrl}`);

                const verifyData = await redisClient.get(`verifyCommand:${interaction.user.id}`);

                await redisClient.set(`chainSelection:${interaction.user.id}`, JSON.stringify({
                    chain,
                    contractAddress,
                    rpcUrl
                }));

                if (verifyData) {
                    const { walletAddress, nftAddress, guildId, interactionId, interactionToken } = JSON.parse(verifyData);

                    const verificationId = sessionManager.generateUUID();
                    const verificationUrl = `${process.env.WEB_SERVER_URL}/verify?token=${verificationId}`;

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
                    await interaction.reply({
                        content: `Please [click here](${verificationUrl}) to verify your wallet and NFT ownership on ${chain}.`,
                        ephemeral: true
                    });
                } else {
                    await interaction.reply({
                        content: `You have selected the ${chain} network. Processing your request...`,
                        ephemeral: true
                    });
                }
            }
            return;
        }

        if (!interaction.isCommand()) return;

        const { commandName, options } = interaction;

        // For verify command, show chain selection buttons first
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
                        .setStyle(ButtonStyle.Secondary)
                );

            await interaction.editReply({
                content: 'Please select the network you want to use for verification:',
                components: [row],
                ephemeral: true
            });
            return;
        }

        // For commands that need chain selection
        if (['continue', 'updateallroles', 'checkusernfts', 'mapnftvalue'].includes(commandName)) {
            await interaction.deferReply({ ephemeral: true });

            const chainSelection = await redisClient.get(`chainSelection:${interaction.user.id}`);
            
            if (!chainSelection) {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('selectSongbird')
                            .setLabel('Songbird')
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId('selectFlare')
                            .setLabel('Flare')
                            .setStyle(ButtonStyle.Secondary)
                    );

                await interaction.editReply({
                    content: 'Please select the network you want to use:',
                    components: [row],
                    ephemeral: true
                });
                return;
            }

            const selectedChain = JSON.parse(chainSelection);
            const provider = new ethers.providers.JsonRpcProvider(selectedChain.rpcUrl);
            const nftVerificationContract = new ethers.Contract(
                selectedChain.contractAddress,
                require('./server/abi.json'),
                provider
            );

            if (commandName === 'continue') {
                const userId = interaction.user.id;
                const verificationData = await sessionManager.retrieveVerificationDataByDiscordId(userId);

                if (!verificationData) {
                    return interaction.editReply({ content: 'Please complete the wallet verification first or ensure all data was submitted correctly.', ephemeral: true });
                }

                try {
                    const walletAddress = verificationData.walletAddress;
                    const nftAddress = verificationData.nftAddress;
                    console.log(`Verifying ownership for wallet: ${walletAddress} and NFT: ${nftAddress} on ${selectedChain.chain}`);

                    const [isOwner, count] = await nftVerificationContract.verifyOwnershipWithCount(walletAddress, nftAddress);
                    console.log(`Is Owner: ${isOwner}, Count: ${count}`);

                    if (isOwner) {
                        const rolesData = await nftVerificationContract.getRolesForNFT(nftAddress);
                        const roles = rolesData.map(role => role.roleName);

                        if (roles.length > 0) {
                            const guild = await client.guilds.fetch(interaction.guild.id);
                            const member = await guild.members.fetch(userId);

                            const roleObjects = roles.map(role => guild.roles.cache.find(r => r.name === role)).filter(Boolean);
                            
                            for (const role of roleObjects) {
                                const roleResult = await safeRoleManagement(member, role, 'add', interaction.user.username);
                                if (!roleResult.success) {
                                    console.log(`Role management result for ${interaction.user.username}: ${roleResult.message}`);
                                    if (roleResult.reason === 'ROLE_HIERARCHY') {
                                        await interaction.editReply({ content: `Note: ${roleResult.message}`, ephemeral: true });
                                    }
                                }
                            }

                            await interaction.editReply({ content: `NFT ownership verified on ${selectedChain.chain}. Role assignment attempted.`, ephemeral: true });
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
                                    const roleResult = await safeRoleManagement(member, role, 'add', interaction.user.username);
                                    if (roleResult.success) {
                                        console.log(`Role ${roleName} successfully assigned to ${interaction.user.username}`);
                                        await interaction.editReply({ content: `NFT value-based ownership verified and role assigned: ${roleName} on ${selectedChain.chain}`, ephemeral: true });
                                    } else {
                                        console.log(`Role management result: ${roleResult.message}`);
                                        if (roleResult.reason === 'ROLE_HIERARCHY') {
                                            await interaction.editReply({ content: `Verification successful but ${roleResult.message}`, ephemeral: true });
                                        } else {
                                            await interaction.editReply({ content: `Error assigning role: ${roleResult.message}`, ephemeral: true });
                                        }
                                    }
                                } else {
                                    console.log(`Role ${roleName} not found in guild`);
                                    await interaction.editReply({ content: `Role ${roleName} could not be found in the server.`, ephemeral: true });
                                }
                            } else {
                                console.log('User does not meet the value requirements for any roles.');
                                await interaction.editReply({ content: 'You do not meet the value requirements for any roles.', ephemeral: true });
                            }
                            await sessionManager.deleteVerificationData(verificationData.interactionToken);
                        }
                    } else {
                        await interaction.editReply({ content: 'NFT ownership could not be verified.', ephemeral: true });
                    }

                    const { cleanRedisKeys } = require('./server/public/js/cleanRedis');
                    await cleanRedisKeys();
                    console.log('Ran cleanRedisKeys successfully.');
                } catch (error) {
                    console.error('NFT verification failed:', error);
                    await interaction.editReply({ content: `NFT verification failed: ${error.message}. Please try again.`, ephemeral: true });
                }
            }
        }

        // Handle simpler commands that don't require chain selection
        if (['addnft', 'removenft', 'registerrole', 'unregisterrole', 'registervaluerole', 'unregistervaluerole'].includes(commandName)) {
            await interaction.deferReply({ ephemeral: true });
            const url = `${process.env.WEB_SERVER_URL}/${commandName}`;
            await interaction.editReply({ content: `Please [click here](${url}) to ${commandName}.`, ephemeral: true });
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

client.login(process.env.DISCORD_BOT_TOKEN);
