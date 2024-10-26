// prime.js - Updated to Ensure Chain Selection Buttons Work Properly

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

client.on('messageCreate', async (message) => {
    if (message.content.startsWith('!verify') || message.content.startsWith('!addNFT') || message.content.startsWith('!updateallroles')) {
        console.log("Command received that requires chain selection");
        await promptChainSelection(message);
    }
});

async function promptChainSelection(message) {
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

    try {
        await message.channel.send({ content: 'Please select the network you want to use:', components: [row] });
        console.log("Buttons sent successfully");
    } catch (error) {
        console.error("Failed to send buttons:", error);
    }
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    let contractAddress, rpcUrl;

    console.log("Button interaction received:", interaction.customId);

    if (interaction.customId === 'selectSongbird') {
        contractAddress = process.env.SONGBIRD_CONTRACT_ADDRESS;
        rpcUrl = process.env.SONGBIRD_RPC_URL;
        await interaction.reply({ content: `You have selected the Songbird network. Proceeding with verification...`, ephemeral: true });
    } else if (interaction.customId === 'selectFlare') {
        contractAddress = process.env.FLARE_CONTRACT_ADDRESS;
        rpcUrl = process.env.FLARE_RPC_URL;
        await interaction.reply({ content: `You have selected the Flare network. Proceeding with verification...`, ephemeral: true });
    }

    // Store chain information for this session
    interaction.client.selectedChain = {
        chain: interaction.customId,
        contractAddress,
        rpcUrl
    };
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    try {
        if (commandName === 'verify') {
            await interaction.deferReply({ ephemeral: true });
            const walletAddress = options.getString('walletaddress');
            const nftAddress = options.getString('nftaddress');

            if (!interaction.client.selectedChain) {
                return interaction.editReply({ content: 'Please select a network first using the provided button.', ephemeral: true });
            }

            const { contractAddress, rpcUrl } = interaction.client.selectedChain;

            if (!ethers.utils.isAddress(walletAddress) || !ethers.utils.isAddress(nftAddress)) {
                return interaction.editReply({ content: 'Invalid wallet or NFT address provided.', ephemeral: true });
            }

            const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
            const nftVerificationContract = new ethers.Contract(contractAddress, require('./server/abi.json'), provider);

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
                guildId: interaction.guild.id,
                chain: interaction.client.selectedChain.chain
            });

            await interaction.editReply({ content: `Please [click here](${verificationUrl}) to verify your wallet and NFT ownership.`, ephemeral: true });

        } else if (commandName === 'updateallroles') {
            await interaction.deferReply({ ephemeral: true });

            if (!interaction.client.selectedChain) {
                return interaction.editReply({ content: 'Please select a network first using the provided button.', ephemeral: true });
            }

            const { contractAddress, rpcUrl } = interaction.client.selectedChain;
            const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
            const nftVerificationContract = new ethers.Contract(contractAddress, require('./server/abi.json'), provider);

            // Proceed with existing logic for role updates
        }
        // Handle other commands similarly...
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
