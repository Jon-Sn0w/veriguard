const { Client, GatewayIntentBits, REST, Routes, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
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

// Hardcoded sKYCt NFT address
const SKYCT_NFT_ADDRESS = '0x3BA20E48977253e21De57E187F4E5721824642a1';

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

// Helper function to get the "Are You Human" NFT address based on the chain
async function getAreYouHumanNFTAddress(chain) {
  if (chain.toLowerCase() === 'songbird') {
    return process.env.SONGBIRD_NFT_MINTER_ADDRESS;
  } else if (chain.toLowerCase() === 'flare') {
    return process.env.FLARE_NFT_MINTER_ADDRESS;
  } else if (chain.toLowerCase() === 'basechain') {
    return process.env.BASECHAIN_NFT_MINTER_ADDRESS;
  } else {
    throw new Error('Invalid chain specified');
  }
}

async function isNFTCollectionRegisteredOnChain(nftAddress, chain) {
  try {
    const { contract: nftVerificationContract } = await getChainContract(chain);
    const nftInfo = await nftVerificationContract.nftMappings(nftAddress);
    return nftInfo.nftAddress !== '0x0000000000000000000000000000000000000000';
  } catch (error) {
    console.error('Error checking NFT registration:', error);
    return false;
  }
}

async function areRolesRegisteredOnChain(nftAddress, roles, valueRole, chain) {
  try {
    const { contract: nftVerificationContract } = await getChainContract(chain);

    // Check standard roles
    const onChainRoles = await nftVerificationContract.getRolesForNFT(nftAddress);
    const onChainRoleNames = onChainRoles.map(role => role.roleName);
    const redisRoleNames = roles.map(roleEntry => roleEntry.split(':')[0]);
    const standardRolesValid = redisRoleNames.every(roleName => {
      if (roleName === 'sKYCt' && nftAddress.toLowerCase() !== SKYCT_NFT_ADDRESS.toLowerCase()) {
        return false; // sKYCt role is only valid for the hardcoded address
      }
      return onChainRoleNames.includes(roleName);
    });

    // Check value role
    if (valueRole) {
      let index = 0;
      let valueRoleValid = false;
      while (true) {
        try {
          const onChainValueRole = await nftVerificationContract.nftValueRoles(nftAddress, index);
          if (onChainValueRole.roleName === valueRole.roleName) {
            valueRoleValid = true;
            break;
          }
          index++;
        } catch (error) {
          break; // Out of bounds or revert, stop iteration
        }
      }
      return standardRolesValid && valueRoleValid;
    }

    return standardRolesValid;
  } catch (error) {
    console.error('Error checking role registration:', error);
    return false;
  }
}

async function checkValueRoles(nftVerificationContract, nftAddress, walletAddress, count, ownedTokenIds = [], interaction) {
  try {
    const guildId = interaction ? interaction.guild.id : null;
    const nftData = guildId ? await getGuildNFTData(guildId, nftAddress) : null;
    if (!nftData || !nftData.valueRole) return { hasValueRole: false };

    let index = 0;
    let requiredValue = 0;
    while (true) {
      try {
        const valueRole = await nftVerificationContract.nftValueRoles(nftAddress, index);
        if (valueRole.roleName === nftData.valueRole.roleName) {
          requiredValue = valueRole.requiredValue;
          break;
        }
        index++;
      } catch (error) {
        return { hasValueRole: false, error: 'Value role not registered on-chain' };
      }
    }

    let totalValue = 0;
    if (ownedTokenIds.length > 0) {
      for (const tokenId of ownedTokenIds) {
        const value = await nftVerificationContract.nftValueMappings(nftAddress, tokenId);
        totalValue += parseInt(value.toString());
      }
    } else {
      const { isOwner, count: nftCount } = await nftVerificationContract.verifyOwnershipWithCount(walletAddress, nftAddress);
      if (!isOwner) return { hasValueRole: false };
      totalValue = nftCount; // Placeholder if no token IDs provided
    }

    const hasValueRole = totalValue >= requiredValue;
    return { hasValueRole, totalValue, requiredValue };
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

async function checkAndCorrectSKYCtRoles() {
  try {
    const guildKeys = await redisClient.keys('guild:*');
    let correctionsMade = false;

    for (const key of guildKeys) {
      let guildData = await redisClient.get(key);
      if (!guildData) continue;

      const data = JSON.parse(guildData);
      if (!data.nfts) continue;

      for (const nftAddress in data.nfts) {
        const normalizedAddress = nftAddress.toLowerCase();
        const nftData = data.nfts[nftAddress];

        const skyctRoles = nftData.roles.filter(roleEntry => roleEntry.split(':')[0] === 'sKYCt');
        if (skyctRoles.length > 0 && normalizedAddress !== SKYCT_NFT_ADDRESS.toLowerCase()) {
          nftData.roles = nftData.roles.filter(roleEntry => roleEntry.split(':')[0] !== 'sKYCt');
          correctionsMade = true;
          console.log(`Removed sKYCt role from NFT ${nftAddress} in guild ${key}`);
        }
      }

      if (correctionsMade) {
        await redisClient.set(key, JSON.stringify(data));
      }
    }

    return correctionsMade ? 'Corrections made to sKYCt role assignments.' : 'No corrections needed for sKYCt roles.';
  } catch (error) {
    console.error('Error checking and correcting sKYCt roles:', error);
    throw error;
  }
}

// Guild management helper functions
async function isNFTRegisteredForGuild(guildId, nftAddress) {
  try {
    const key = `guild:${guildId}`;
    const guildData = await redisClient.get(key);
    if (!guildData) return false;

    const data = JSON.parse(guildData);
    return data.nfts && data.nfts[nftAddress.toLowerCase()] ? true : false;
  } catch (error) {
    console.error('Error checking guild NFT registration:', error);
    return false;
  }
}

async function getGuildNFTData(guildId, nftAddress) {
  try {
    const key = `guild:${guildId}`;
    const guildData = await redisClient.get(key);
    if (!guildData) return null;

    const data = JSON.parse(guildData);
    return data.nfts ? data.nfts[nftAddress.toLowerCase()] : null;
  } catch (error) {
    console.error('Error getting guild NFT data:', error);
    return null;
  }
}

async function getFullGuildNFTData(guildId) {
  try {
    const key = `guild:${guildId}`;
    const guildData = await redisClient.get(key);
    if (!guildData) return null;

    return JSON.parse(guildData);
  } catch (error) {
    console.error('Error getting full guild NFT data:', error);
    return null;
  }
}

async function registerGuildNFT(guildId, nftAddress) {
  try {
    const key = `guild:${guildId}`;
    let guildData = await redisClient.get(key);
    guildData = guildData ? JSON.parse(guildData) : { nfts: {} };

    const normalizedAddress = nftAddress.toLowerCase();
    if (!guildData.nfts[normalizedAddress]) {
      guildData.nfts[normalizedAddress] = {
        roles: [],
        valueRole: null,
        timestamp: Date.now()
      };
      await redisClient.set(key, JSON.stringify(guildData));
    }
    return true;
  } catch (error) {
    console.error('Error registering guild NFT:', error);
    throw error;
  }
}

async function registerGuildNFTRole(guildId, nftAddress, roleName, minCount = 1) {
  try {
    const key = `guild:${guildId}`;
    let guildData = await redisClient.get(key);
    if (!guildData) throw new Error('Guild data not found');

    const data = JSON.parse(guildData);
    const normalizedAddress = nftAddress.toLowerCase();

    if (!data.nfts[normalizedAddress]) {
      throw new Error('NFT not registered for this guild');
    }

    if (roleName === 'sKYCt' && normalizedAddress !== SKYCT_NFT_ADDRESS.toLowerCase()) {
      throw new Error('sKYCt role can only be assigned to the designated NFT address.');
    }

    const roleEntry = `${roleName}:${minCount}`;
    if (!data.nfts[normalizedAddress].roles.includes(roleEntry)) {
      data.nfts[normalizedAddress].roles.push(roleEntry);
      await redisClient.set(key, JSON.stringify(data));
    }
    return true;
  } catch (error) {
    console.error('Error registering guild NFT role:', error);
    throw error;
  }
}

async function registerGuildValueRole(guildId, nftAddress, roleName, requiredValue) {
  try {
    const key = `guild:${guildId}`;
    let guildData = await redisClient.get(key);
    if (!guildData) throw new Error('Guild data not found');

    const data = JSON.parse(guildData);
    const normalizedAddress = nftAddress.toLowerCase();

    if (!data.nfts[normalizedAddress]) {
      throw new Error('NFT not registered for this guild');
    }

    data.nfts[normalizedAddress].valueRole = {
      roleName,
      requiredValue,
      timestamp: Date.now()
    };

    await redisClient.set(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error registering guild value role:', error);
    throw error;
  }
}

async function unregisterGuildNFT(guildId, nftAddress) {
  try {
    const key = `guild:${guildId}`;
    let guildData = await redisClient.get(key);
    if (!guildData) return false;

    const data = JSON.parse(guildData);
    const normalizedAddress = nftAddress.toLowerCase();

    if (data.nfts[normalizedAddress]) {
      delete data.nfts[normalizedAddress];
      await redisClient.set(key, JSON.stringify(data));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error unregistering guild NFT:', error);
    throw error;
  }
}

// Reusable chain selection function
async function promptChainSelection(interaction, redisKey, data, message = 'Please select the network:') {
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('selectChain')
    .setPlaceholder('Select a network')
    .addOptions(
      new StringSelectMenuOptionBuilder().setLabel('Songbird').setValue('songbird'),
      new StringSelectMenuOptionBuilder().setLabel('Flare').setValue('flare'),
      new StringSelectMenuOptionBuilder().setLabel('Basechain').setValue('basechain')
    );

  const row = new ActionRowBuilder().addComponents(selectMenu);

  await redisClient.set(redisKey, JSON.stringify(data), 'EX', 300); // 5-minute TTL
  await interaction.editReply({ content: message, components: [row] });
}

const commands = [
  {
    name: 'verify',
    description: 'Verify your wallet and NFT ownership',
    options: [
      { name: 'walletaddress', type: 3, description: 'Your wallet address', required: true },
      { name: 'nftaddress', type: 3, description: 'NFT contract address', required: true }
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
      { name: 'nftaddress', type: 3, description: 'NFT contract address', required: true }
    ]
  },
  {
    name: 'addnft',
    description: 'Add an NFT via web interface'
  },
  {
    name: 'removenft',
    description: 'Remove an NFT via web interface'
  },
  {
    name: 'checkusernfts',
    description: 'Check NFTs owned by a user (Admin/Mod only)',
    options: [
      { name: 'username', type: 3, description: 'Discord username', required: true }
    ]
  },
  {
    name: 'checkskyct',
    description: 'Check if a user holds the sKYCt token',
    options: [
      { name: 'username', type: 3, description: 'Discord username to check', required: true }
    ]
  },
  {
    name: 'verifyskyct',
    description: 'Verify your sKYCt token ownership',
    options: [
      { name: 'walletaddress', type: 3, description: 'Your wallet address', required: true }
    ]
  },
  {
    name: 'registerrole',
    description: 'Register a role for an NFT via web interface'
  },
  {
    name: 'unregisterrole',
    description: 'Unregister a role for an NFT via web interface'
  },
  {
    name: 'mapnftvalue',
    description: 'Map a value to an NFT',
    options: [
      { name: 'nftaddress', type: 3, description: 'NFT contract address', required: true },
      { name: 'tokenid', type: 3, description: 'Token ID', required: true },
      { name: 'value', type: 4, description: 'Value to map', required: true }
    ]
  },
  {
    name: 'registervaluerole',
    description: 'Register a value-based role for an NFT via web interface'
  },
  {
    name: 'unregistervaluerole',
    description: 'Unregister a value-based role for an NFT via web interface'
  },
  {
    name: 'register-guild-nft',
    description: 'Register an NFT for this server (Admin only)',
    options: [
      { name: 'nftaddress', type: 3, description: 'NFT contract address', required: true }
    ]
  },
  {
    name: 'register-guild-role',
    description: 'Add a role to a registered NFT in this server (Admin only)',
    options: [
      { name: 'nftaddress', type: 3, description: 'NFT contract address', required: true },
      { name: 'rolename', type: 3, description: 'Discord role name', required: true },
      { name: 'mincount', type: 4, description: 'Minimum NFT count required (default: 1)', required: false }
    ]
  },
  {
    name: 'register-guild-value-role',
    description: 'Add a value-based role to a registered NFT in this server (Admin only)',
    options: [
      { name: 'nftaddress', type: 3, description: 'NFT contract address', required: true },
      { name: 'rolename', type: 3, description: 'Discord role name', required: true },
      { name: 'requiredvalue', type: 4, description: 'Required NFT value', required: true }
    ]
  },
  {
    name: 'unregister-guild-nft',
    description: 'Remove NFT registration from this server (Admin only)',
    options: [
      { name: 'nftaddress', type: 3, description: 'NFT contract address', required: true }
    ]
  },
  {
    name: 'list-guild-nfts',
    description: 'List all NFTs and roles registered in this server'
  },
  {
    name: 'check-and-correct-skyct-roles',
    description: 'Check and correct sKYCt role assignments across all guilds'
  },
  {
    name: 'mintnft',
    description: 'Mint an "Are You Human" NFT to verify your identity'
  },
  {
    name: 'areyouhuman',
    description: 'Verify your "Are You Human" NFT ownership',
    options: [
      { name: 'walletaddress', type: 3, description: 'Your wallet address', required: true }
    ]
  }
];

async function updateExistingGuildsWithSKYCt() {
  try {
    const guildKeys = await redisClient.keys('guild:*');
    for (const key of guildKeys) {
      let guildData = await redisClient.get(key);
      if (!guildData) continue;

      const data = JSON.parse(guildData);
      if (!data.nfts) continue;

      for (const nftAddress in data.nfts) {
        if (nftAddress.toLowerCase() === SKYCT_NFT_ADDRESS.toLowerCase()) {
          if (!data.nfts[nftAddress].roles.some(r => r.startsWith('sKYCt'))) {
            data.nfts[nftAddress].roles.push('sKYCt:1');
          }
        }
      }

      await redisClient.set(key, JSON.stringify(data));
      console.log(`Updated guild ${key} with sKYCt role for ${SKYCT_NFT_ADDRESS}`);
    }
    console.log('Finished updating existing guilds with sKYCt role');
  } catch (error) {
    console.error('Error updating existing guilds with sKYCt:', error);
  }
}

client.once('ready', async () => {
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );
    console.log('Successfully reloaded application (/) commands.');
    await updateExistingGuildsWithSKYCt();
    await checkAndCorrectSKYCtRoles(); // Run on boot
    console.log('Checked and corrected sKYCt roles on startup');
  } catch (error) {
    console.error(error);
  }
  console.log('Discord Bot is ready!');
});

client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isStringSelectMenu() && interaction.customId === 'selectChain') {
      await interaction.deferReply({ flags: 64 });
      const chain = interaction.values[0]; // e.g., 'songbird', 'flare', 'basechain'

      // Handle /verify
      const verifyData = await redisClient.get(`verifyCommand:${interaction.user.id}`);
      if (verifyData) {
        const { walletAddress, nftAddress, guildId, interactionId, interactionToken } = JSON.parse(verifyData);
        const isSKYCt = nftAddress.toLowerCase() === SKYCT_NFT_ADDRESS.toLowerCase();
        const selectedChain = isSKYCt ? 'flare' : chain; // Force Flare for sKYCt

        const { contract: nftVerificationContract, provider } = await getChainContract(selectedChain);
        const isRegistered = await isNFTRegisteredForGuild(guildId, nftAddress);
        if (!isRegistered) {
          await interaction.editReply({ content: `NFT ${nftAddress} is not registered for use in this server.` });
          await redisClient.del(`verifyCommand:${interaction.user.id}`);
          return;
        }

        const nftData = await getGuildNFTData(guildId, nftAddress);
        if (!nftData || (nftData.roles.length === 0 && !nftData.valueRole)) {
          await interaction.editReply({ content: 'No roles are configured for this NFT in this server.' });
          await redisClient.del(`verifyCommand:${interaction.user.id}`);
          return;
        }

        const verificationId = sessionManager.generateUUID();
        const verificationUrl = `${process.env.WEB_SERVER_URL}/verify?token=${verificationId}&chain=${selectedChain}`;
        await sessionManager.storeVerificationData(verificationId, {
          discordId: interaction.user.id,
          username: interaction.user.username,
          walletAddress,
          nftAddress,
          verified: false,
          interactionId,
          interactionToken,
          guildId,
          chain: selectedChain
        });
        await interaction.editReply({ content: `Please [click here](${verificationUrl}) to verify your wallet and ${isSKYCt ? 'sKYCt token' : 'NFT'} ownership on ${selectedChain}.` });
        await redisClient.del(`verifyCommand:${interaction.user.id}`);
        return;
      }

      // Handle /areyouhuman
      const areYouHumanData = await redisClient.get(`areyouhuman:${interaction.user.id}`);
      if (areYouHumanData) {
        const { walletAddress, guildId, interactionId, interactionToken } = JSON.parse(areYouHumanData);
        const nftAddress = await getAreYouHumanNFTAddress(chain); // Use the NFT address for the selected chain

        const isRegistered = await isNFTRegisteredForGuild(guildId, nftAddress);
        if (!isRegistered) {
          await interaction.editReply({ content: `The "Are You Human" NFT (${nftAddress}) is not registered for use in this server.` });
          await redisClient.del(`areyouhuman:${interaction.user.id}`);
          return;
        }

        const nftData = await getGuildNFTData(guildId, nftAddress);
        if (!nftData || (nftData.roles.length === 0 && !nftData.valueRole)) {
          await interaction.editReply({ content: 'No roles are configured for the "Are You Human" NFT in this server.' });
          await redisClient.del(`areyouhuman:${interaction.user.id}`);
          return;
        }

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
        await interaction.editReply({ content: `Please [click here](${verificationUrl}) to verify your "Are You Human" NFT ownership on ${chain}.` });
        await redisClient.del(`areyouhuman:${interaction.user.id}`);
        return;
      }

      // Handle /updateallroles
      const updateAllRolesData = await redisClient.get(`updateallroles:${interaction.user.id}`);
      if (updateAllRolesData) {
        const { nftAddress } = JSON.parse(updateAllRolesData);
        try {
          if (!ethers.utils.isAddress(nftAddress)) {
            await interaction.editReply({ content: 'Invalid NFT address provided.' });
            await redisClient.del(`updateallroles:${interaction.user.id}`);
            return;
          }
          const nftData = await getGuildNFTData(interaction.guild.id, nftAddress);
          if (!nftData) {
            await interaction.editReply({ content: `NFT ${nftAddress} is not registered in this server.` });
            await redisClient.del(`updateallroles:${interaction.user.id}`);
            return;
          }
          if (!(await isNFTCollectionRegisteredOnChain(nftAddress, chain))) {
            await interaction.editReply({ content: `NFT ${nftAddress} is not registered on ${chain}.` });
            await redisClient.del(`updateallroles:${interaction.user.id}`);
            return;
          }
          if (!(await areRolesRegisteredOnChain(nftAddress, nftData.roles, nftData.valueRole, chain))) {
            await interaction.editReply({ content: 'Some roles for this NFT are not registered on-chain.' });
            await redisClient.del(`updateallroles:${interaction.user.id}`);
            return;
          }
          if (!nftData.roles.length && !nftData.valueRole) {
            await interaction.editReply({ content: 'No roles are configured for this NFT in this server.' });
            await redisClient.del(`updateallroles:${interaction.user.id}`);
            return;
          }

          const { contract: nftVerificationContract, provider } = await getChainContract(chain);
          const results = { totalProcessed: 0, standardRolesAssigned: [], valueRolesAssigned: [], rolesRemoved: [], errors: [] };
          const userKeys = await redisClient.keys('user:*');
          if (userKeys.length === 0) {
            await interaction.editReply({ content: 'No users registered in this guild for role updates.' });
            await redisClient.del(`updateallroles:${interaction.user.id}`);
            return;
          }

          const processedUsers = new Set();
          const guildId = interaction.guild.id;

          await interaction.editReply({ content: `Beginning role updates for NFT ${nftAddress} on ${chain}...` });

          for (const userKey of userKeys) {
            const userData = JSON.parse(await redisClient.get(userKey));
            const { discordId, username, walletAddresses, guildIds } = userData;

            if (processedUsers.has(discordId) || !guildIds.includes(guildId)) continue;

            try {
              const guild = await client.guilds.fetch(guildId);
              const member = await guild.members.fetch(discordId);

              let maxOwnershipInfo = { isOwner: false, count: '0', ownerWallet: '', ownedTokenIds: [] };

              for (const walletAddress of walletAddresses) {
                try {
                  const walletAddressChecksum = ethers.utils.getAddress(walletAddress);
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

                  if (verificationResult.isOwner && parseInt(verificationResult.count) > parseInt(maxOwnershipInfo.count)) {
                    maxOwnershipInfo = { ...verificationResult, ownerWallet: walletAddressChecksum };
                  }
                } catch (walletError) {
                  console.error(`Error checking wallet ${walletAddress}:`, walletError);
                  continue;
                }
              }

              if (maxOwnershipInfo.isOwner) {
                const countNum = parseInt(maxOwnershipInfo.count);

                if (nftData.roles.length > 0) {
                  const roleObjects = nftData.roles
                    .map(roleEntry => {
                      const [roleName, minCount] = roleEntry.split(':');
                      const minCountNum = parseInt(minCount || 1);
                      const role = guild.roles.cache.find(r => r.name === roleName);
                      if (!role) return null;
                      return { role, minCount: minCountNum, eligible: countNum >= minCountNum };
                    })
                    .filter(r => r !== null);

                  for (const { role, minCount, eligible } of roleObjects) {
                    if (eligible && !member.roles.cache.has(role.id)) {
                      await member.roles.add(role);
                      results.standardRolesAssigned.push(`${username} (${role.name}, Count: ${countNum}/${minCount})`);
                    } else if (!eligible && member.roles.cache.has(role.id)) {
                      await member.roles.remove(role);
                      results.rolesRemoved.push(`${username} (${role.name}, Count: ${countNum}/${minCount})`);
                    }
                  }
                }

                if (nftData.valueRole) {
                  const valueRole = guild.roles.cache.find(r => r.name === nftData.valueRole.roleName);
                  if (valueRole) {
                    const valueRoleInfo = await checkValueRoles(
                      nftVerificationContract,
                      nftAddress,
                      maxOwnershipInfo.ownerWallet,
                      maxOwnershipInfo.count,
                      maxOwnershipInfo.ownedTokenIds,
                      interaction
                    );

                    if (valueRoleInfo.hasValueRole) {
                      if (valueRoleInfo.totalValue >= nftData.valueRole.requiredValue) {
                        if (!member.roles.cache.has(valueRole.id)) {
                          await member.roles.add(valueRole);
                          results.valueRolesAssigned.push(`${username} (${nftData.valueRole.roleName}, Value: ${valueRoleInfo.totalValue})`);
                        }
                      } else if (member.roles.cache.has(valueRole.id)) {
                        await member.roles.remove(valueRole);
                        results.rolesRemoved.push(`${username} (${nftData.valueRole.roleName}, Insufficient Value: ${valueRoleInfo.totalValue}/${nftData.valueRole.requiredValue})`);
                      }
                    }
                  }
                }
              } else {
                if (nftData.valueRole) {
                  const valueRole = guild.roles.cache.find(r => r.name === nftData.valueRole.roleName);
                  if (valueRole && member.roles.cache.has(valueRole.id)) {
                    await member.roles.remove(valueRole);
                    results.rolesRemoved.push(`${username} (${nftData.valueRole.roleName}, No NFTs)`);
                  }
                }

                if (nftData.roles.length > 0) {
                  const roleObjects = nftData.roles
                    .map(roleEntry => guild.roles.cache.find(r => r.name === roleEntry.split(':')[0]))
                    .filter(Boolean);

                  for (const role of roleObjects) {
                    if (member.roles.cache.has(role.id)) {
                      await member.roles.remove(role);
                      results.rolesRemoved.push(`${username} (${role.name}, No NFTs)`);
                    }
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

          let responseMessage = `**Role Update Complete on ${chain}**\n\n`;
          if (results.standardRolesAssigned.length > 0) responseMessage += '**Standard Roles Assigned:**\n' + results.standardRolesAssigned.map(e => `• ${e}`).join('\n') + '\n';
          if (results.valueRolesAssigned.length > 0) responseMessage += '**Value-Based Roles Assigned:**\n' + results.valueRolesAssigned.map(e => `• ${e}`).join('\n') + '\n';
          if (results.rolesRemoved.length > 0) responseMessage += '**Roles Removed:**\n' + results.rolesRemoved.map(e => `• ${e}`).join('\n') + '\n';
          if (results.errors.length > 0) responseMessage += '**Errors Processing:**\n' + results.errors.map(e => `• ${e}`).join('\n') + '\n';
          if (results.totalProcessed === 0) responseMessage = `Role update complete on ${chain}. No changes were required.`;

          if (responseMessage.length > 2000) {
            const chunks = responseMessage.match(/.{1,1900}/g);
            await interaction.editReply({ content: chunks[0] + "\n*(Continued...)*" });
            for (let i = 1; i < chunks.length; i++) await interaction.followUp({ content: chunks[i], flags: 64 });
          } else {
            await interaction.editReply({ content: responseMessage });
          }

          await redisClient.del(`updateallroles:${interaction.user.id}`);
        } catch (error) {
          console.error('Role update failed:', error);
          await interaction.editReply({ content: `Role update failed on ${chain}: ${error.message}` });
          await redisClient.del(`updateallroles:${interaction.user.id}`);
        }
        return;
      }

      // Handle /register-guild-nft
      const registerGuildNFTData = await redisClient.get(`registerGuildNFT:${interaction.user.id}`);
      if (registerGuildNFTData) {
        const { nftAddress, guildId } = JSON.parse(registerGuildNFTData);
        if (!ethers.utils.isAddress(nftAddress)) {
          await interaction.editReply({ content: 'Invalid NFT address provided.' });
          await redisClient.del(`registerGuildNFT:${interaction.user.id}`);
          return;
        }
        const isRegisteredOnChain = await isNFTCollectionRegisteredOnChain(nftAddress, chain);
        if (!isRegisteredOnChain) {
          await interaction.editReply({ content: `NFT ${nftAddress} is not registered on ${chain}.` });
          await redisClient.del(`registerGuildNFT:${interaction.user.id}`);
          return;
        }
        const isRegisteredInGuild = await isNFTRegisteredForGuild(guildId, nftAddress);
        if (isRegisteredInGuild) {
          await interaction.editReply({ content: `NFT ${nftAddress} is already registered in this server.` });
          await redisClient.del(`registerGuildNFT:${interaction.user.id}`);
          return;
        }
        try {
          await registerGuildNFT(guildId, nftAddress);
          await interaction.editReply({ content: `✅ Successfully registered NFT ${nftAddress} for this server on ${chain}.` });
        } catch (error) {
          console.error('Error registering guild NFT:', error);
          await interaction.editReply({ content: `Error registering NFT: ${error.message}` });
        }
        await redisClient.del(`registerGuildNFT:${interaction.user.id}`);
        return;
      }

      // Handle /checkusernfts
      const checkUserNFTsData = await redisClient.get(`checkusernfts:${interaction.user.id}`);
      if (checkUserNFTsData) {
        const { username, userData } = JSON.parse(checkUserNFTsData);
        const { walletAddresses } = userData;
        let responseLines = [`**NFT Holdings for ${username} on ${chain}**\n`];

        const guildData = await getFullGuildNFTData(interaction.guild.id);
        const registeredNFTs = guildData ? Object.keys(guildData.nfts) : [];

        const { contract: nftVerificationContract, provider } = await getChainContract(chain);

        for (const walletAddress of walletAddresses) {
          try {
            const walletAddressChecksum = ethers.utils.getAddress(walletAddress);
            let hasNFTs = false;
            let walletHeaderAdded = false;

            for (const nftAddress of registeredNFTs) {
              try {
                const nftData = guildData.nfts[nftAddress];
                let verificationResult = await getStoredVerificationResult(userData.discordId, nftAddress);
                if (!verificationResult) {
                  verificationResult = await verifyNFTOwnership(
                    walletAddressChecksum,
                    nftAddress,
                    chain,
                    provider,
                    nftVerificationContract
                  );
                  if (verificationResult.isOwner) {
                    await storeVerificationResult(userData.discordId, nftAddress, verificationResult);
                  }
                }

                if (verificationResult.isOwner) {
                  if (!walletHeaderAdded) {
                    responseLines.push(`\n**Wallet: ${walletAddressChecksum}**`);
                    walletHeaderAdded = true;
                  }
                  hasNFTs = true;
                  let nftLine = `• ${nftAddress}: ${verificationResult.count} NFT${verificationResult.count === '1' ? '' : 's'}`;
                  if (verificationResult.ownedTokenIds.length > 0) {
                    nftLine += ` (Token IDs: ${verificationResult.ownedTokenIds.join(', ')})`;
                  }

                  if (nftData.roles.length > 0) {
                    nftLine += '\n Standard Roles:';
                    nftData.roles.forEach(roleEntry => {
                      const [roleName, minCount] = roleEntry.split(':');
                      const countNum = parseInt(verificationResult.count);
                      const minCountNum = parseInt(minCount || 1);
                      nftLine += `\n • ${roleName} (Min: ${minCountNum}): ${countNum >= minCountNum ? '✅ Eligible' : '❌ Not Eligible'}`;
                    });
                  }

                  if (nftData.valueRole) {
                    const valueRoleInfo = await checkValueRoles(
                      nftVerificationContract,
                      nftAddress,
                      walletAddressChecksum,
                      verificationResult.count,
                      verificationResult.ownedTokenIds,
                      interaction
                    );
                    nftLine += `\n Value Role: ${nftData.valueRole.roleName} (Required: ${nftData.valueRole.requiredValue})`;
                    if (valueRoleInfo.hasValueRole) {
                      nftLine += `\n • Current Value: ${valueRoleInfo.totalValue} (${valueRoleInfo.totalValue >= nftData.valueRole.requiredValue ? '✅ Eligible' : '❌ Not Eligible'})`;
                    }
                  }
                  responseLines.push(nftLine);
                }
              } catch (nftError) {
                console.error(`Error checking NFT ${nftAddress}:`, nftError);
                continue;
              }
            }
            if (!hasNFTs && walletHeaderAdded) {
              responseLines.push('• No registered NFTs found');
            }
          } catch (walletError) {
            console.error(`Error checking wallet ${walletAddress}:`, walletError);
          }
        }

        if (responseLines.length === 1) {
          responseLines.push('No registered NFTs found for this user in this server.');
        }

        const response = responseLines.join('\n');
        if (response.length > 2000) {
          const chunks = response.match(/.{1,1900}/g);
          await interaction.editReply({ content: chunks[0] + "\n*(Continued...)*" });
          for (let i = 1; i < chunks.length; i++) {
            await interaction.followUp({ content: chunks[i], flags: 64 });
          }
        } else {
          await interaction.editReply({ content: response });
        }

        await redisClient.del(`checkusernfts:${interaction.user.id}`);
        return;
      }

      // Handle /checkskyct
      const checkSkyCtData = await redisClient.get(`checkskyct:${interaction.user.id}`);
      if (checkSkyCtData) {
        const { username, userData, guildId } = JSON.parse(checkSkyCtData);
        const { walletAddresses } = userData;
        const skyctAddress = SKYCT_NFT_ADDRESS;
        let responseMessage = `**Checking sKYCt Token for ${username} on ${chain}**\n`;
        let hasSkyCt = false;

        const guild = await client.guilds.fetch(guildId);
        const member = userData.discordId ? await guild.members.fetch(userData.discordId).catch(() => null) : null;
        const skyctRole = guild.roles.cache.find(r => r.name === 'sKYCt');
        const { contract: nftVerificationContract, provider } = await getChainContract(chain);

        for (const walletAddress of walletAddresses) {
          try {
            const walletAddressChecksum = ethers.utils.getAddress(walletAddress);
            const verificationResult = await verifyNFTOwnership(
              walletAddressChecksum,
              skyctAddress,
              chain,
              provider,
              nftVerificationContract
            );

            if (verificationResult.isOwner) {
              hasSkyCt = true;
              responseMessage += `\n• Wallet ${walletAddressChecksum}: ${verificationResult.count} sKYCt token${verificationResult.count === '1' ? '' : 's'}`;
              if (verificationResult.ownedTokenIds.length > 0) {
                responseMessage += ` (Token IDs: ${verificationResult.ownedTokenIds.join(', ')})`;
              }
              break;
            }
          } catch (error) {
            console.error(`Error checking sKYCt for wallet ${walletAddress}:`, error);
            responseMessage += `\n• Wallet ${walletAddress}: Error checking ownership`;
          }
        }

        if (!hasSkyCt) {
          responseMessage += `\n${username} does not hold the sKYCt token.`;
        }

        if (member && skyctRole) {
          try {
            if (hasSkyCt && !member.roles.cache.has(skyctRole.id)) {
              await member.roles.add(skyctRole);
              responseMessage += `\nAssigned sKYCt role to ${username}.`;
            } else if (!hasSkyCt && member.roles.cache.has(skyctRole.id)) {
              await member.roles.remove(skyctRole);
              responseMessage += `\nRemoved sKYCt role from ${username}.`;
            } else if (hasSkyCt) {
              responseMessage += `\n${username} already has the sKYCt role.`;
            }
          } catch (roleError) {
            console.error(`Error managing sKYCt role for ${username}:`, roleError);
            responseMessage += `\nError updating roles for ${username}.`;
          }
        }

        await interaction.editReply({ content: responseMessage });
        await redisClient.del(`checkskyct:${interaction.user.id}`);
        return;
      }

      return;
    }

    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'verify') {
      await interaction.deferReply({ flags: 64 });
      const walletAddress = options.getString('walletaddress');
      const nftAddress = options.getString('nftaddress');

      if (!ethers.utils.isAddress(walletAddress) || !ethers.utils.isAddress(nftAddress)) {
        return interaction.editReply({ content: 'Invalid wallet or NFT address provided.' });
      }

      const nftData = await getGuildNFTData(interaction.guild.id, nftAddress);
      if (!nftData) {
        return interaction.editReply({ content: `NFT ${nftAddress} is not registered in this server.` });
      }
      if (!nftData.roles.length && !nftData.valueRole) {
        return interaction.editReply({ content: 'No roles are configured for this NFT in this server.' });
      }

      await promptChainSelection(interaction, `verifyCommand:${interaction.user.id}`, {
        walletAddress,
        nftAddress,
        guildId: interaction.guild.id,
        interactionId: interaction.id,
        interactionToken: interaction.token
      }, nftAddress.toLowerCase() === SKYCT_NFT_ADDRESS.toLowerCase() 
        ? 'Please select the network (sKYCt uses Flare):' 
        : 'Please select the network for verification:');
      return;

    } else if (commandName === 'continue') {
      console.log(`[DEBUG] /continue - Starting for user ${interaction.user.id}`);
      await interaction.deferReply({ ephemeral: true });
      const userId = interaction.user.id;

      try {
        const verificationData = await sessionManager.retrieveVerificationDataByDiscordId(userId);
        console.log(`[DEBUG] /continue - Retrieved verification data:`, verificationData);

        if (!verificationData) {
          console.log(`[DEBUG] /continue - No verification data found for user ${userId}`);
          await interaction.editReply({ content: 'Please complete the wallet verification first on the website.' });
          return;
        }

        const { walletAddress, nftAddress, chain, guildId } = verificationData;
        console.log(`[DEBUG] /continue - Extracted: wallet=${walletAddress}, nft=${nftAddress}, chain=${chain}, guild=${guildId}`);

        if (!walletAddress || !ethers.utils.isAddress(walletAddress)) {
          console.log(`[DEBUG] /continue - Invalid wallet address: ${walletAddress}`);
          await interaction.editReply({ content: 'Invalid or missing wallet address. Please verify a valid wallet on the website.' });
          await sessionManager.deleteVerificationDataByDiscordId(userId); // Clear stale data
          return;
        }

        const nftData = await getGuildNFTData(guildId, nftAddress);
        if (!nftData) {
          console.log(`[DEBUG] /continue - NFT ${nftAddress} not registered in guild ${guildId}`);
          await interaction.editReply({ content: 'This NFT is no longer registered in the server.' });
          await sessionManager.deleteVerificationDataByDiscordId(userId); // Clear stale data
          return;
        }

        await interaction.editReply({ content: '⏳ Verifying NFT ownership...' });

        const { contract: nftVerificationContract, provider } = await getChainContract(chain);
        console.log(`[DEBUG] /continue - Contract fetched for chain ${chain}`);

        if (!(await isNFTCollectionRegisteredOnChain(nftAddress, chain))) {
          console.log(`[DEBUG] /continue - NFT ${nftAddress} not registered on chain ${chain}`);
          await interaction.editReply({ content: 'This NFT collection is not registered on-chain.' });
          await sessionManager.deleteVerificationDataByDiscordId(userId); // Clear stale data
          return;
        }

        if (!(await areRolesRegisteredOnChain(nftAddress, nftData.roles, nftData.valueRole, chain))) {
          console.log(`[DEBUG] /continue - Roles not registered on chain for NFT ${nftAddress}`);
          await interaction.editReply({ content: 'Some roles for this NFT are not registered on-chain.' });
          await sessionManager.deleteVerificationDataByDiscordId(userId); // Clear stale data
          return;
        }

        if (!nftData.roles.length && !nftData.valueRole) {
          console.log(`[DEBUG] /continue - No roles configured for NFT ${nftAddress}`);
          await interaction.editReply({ content: 'No roles configured for this NFT.' });
          await sessionManager.deleteVerificationDataByDiscordId(userId); // Clear stale data
          return;
        }

        let verificationResult = await getStoredVerificationResult(userId, nftAddress);
        if (!verificationResult) {
          verificationResult = await verifyNFTOwnership(walletAddress, nftAddress, chain, provider, nftVerificationContract);
          console.log(`[DEBUG] /continue - Verification result:`, verificationResult);
          if (verificationResult.isOwner) {
            await storeVerificationResult(userId, nftAddress, verificationResult);
          }
        }

        if (verificationResult.isOwner) {
          let responseMessage = '✅ NFT ownership verified successfully!';
          let roleAssignmentResults = [];

          const guild = await client.guilds.fetch(guildId);
          const member = await guild.members.fetch(userId);
          const countNum = parseInt(verificationResult.count);

          if (nftData.roles.length > 0) {
            const roleObjects = nftData.roles
              .map(roleEntry => {
                const [roleName, minCount] = roleEntry.split(':');
                const minCountNum = parseInt(minCount || 1);
                const role = guild.roles.cache.find(r => r.name === roleName);
                if (!role) {
                  roleAssignmentResults.push(`⚠️ Role '${roleName}' not found`);
                  return null;
                }
                return { role, minCount: minCountNum, eligible: countNum >= minCountNum };
              })
              .filter(Boolean);

            for (const { role, minCount, eligible } of roleObjects) {
              try {
                if (eligible) {
                  await member.roles.add(role);
                  roleAssignmentResults.push(`✅ Role '${role.name}' assigned (Count: ${countNum}/${minCount})`);
                } else if (member.roles.cache.has(role.id)) {
                  await member.roles.remove(role);
                  roleAssignmentResults.push(`ℹ️ Role '${role.name}' removed (Count: ${countNum}/${minCount})`);
                }
              } catch (roleError) {
                console.error(`[ERROR] Role assignment failed for ${role.name}:`, roleError);
                roleAssignmentResults.push(`❌ Failed to manage role '${role.name}': ${roleError.message}`);
              }
            }
          }

          if (nftData.valueRole) {
            try {
              const valueRole = guild.roles.cache.find(r => r.name === nftData.valueRole.roleName);
              if (valueRole) {
                const valueRoleInfo = await checkValueRoles(
                  nftVerificationContract,
                  nftAddress,
                  walletAddress,
                  verificationResult.count,
                  verificationResult.ownedTokenIds,
                  interaction
                );

                if (valueRoleInfo.hasValueRole) {
                  if (valueRoleInfo.totalValue >= nftData.valueRole.requiredValue) {
                    await member.roles.add(valueRole);
                    roleAssignmentResults.push(`✅ Value role '${nftData.valueRole.roleName}' assigned (Value: ${valueRoleInfo.totalValue})`);
                  } else if (member.roles.cache.has(valueRole.id)) {
                    await member.roles.remove(valueRole);
                    roleAssignmentResults.push(`ℹ️ Value role '${nftData.valueRole.roleName}' removed (Value: ${valueRoleInfo.totalValue}/${nftData.valueRole.requiredValue})`);
                  } else {
                    roleAssignmentResults.push(`ℹ️ Insufficient value for '${nftData.valueRole.roleName}' (Value: ${valueRoleInfo.totalValue}/${nftData.valueRole.requiredValue})`);
                  }
                }
              }
            } catch (valueRoleError) {
              console.error(`[ERROR] Value role check failed:`, valueRoleError);
              roleAssignmentResults.push(`❌ Error checking value roles: ${valueRoleError.message}`);
            }
          }

          if (roleAssignmentResults.length > 0) responseMessage += '\n\n' + roleAssignmentResults.join('\n');
          else responseMessage += '\n\nℹ️ No roles were eligible for assignment.';
          await interaction.editReply({ content: responseMessage });
        } else {
          await interaction.editReply({ content: '❌ NFT ownership could not be verified.' });
        }

        await sessionManager.deleteVerificationDataByDiscordId(userId);
        console.log(`[DEBUG] /continue - Session data cleared for user ${userId}`);
      } catch (error) {
        console.error('[ERROR] /continue - Top-level error:', error);
        await interaction.editReply({ content: `❌ An error occurred during verification: ${error.message}` });
        await sessionManager.deleteVerificationDataByDiscordId(userId);
        console.log(`[DEBUG] /continue - Session data cleared on error for user ${userId}`);
      }
      return;

    } else if (commandName === 'updateallroles') {
      await interaction.deferReply({ flags: 64 });
      const nftAddress = options.getString('nftaddress');

      if (!ethers.utils.isAddress(nftAddress)) {
        return interaction.editReply({ content: 'Invalid NFT address provided.' });
      }

      const nftData = await getGuildNFTData(interaction.guild.id, nftAddress);
      if (!nftData) {
        return interaction.editReply({ content: `NFT ${nftAddress} is not registered in this server.` });
      }

      await promptChainSelection(interaction, `updateallroles:${interaction.user.id}`, { nftAddress });
      return;

    } else if (commandName === 'addnft') {
      await interaction.deferReply({ flags: 64 });
      const url = `${process.env.WEB_SERVER_URL}/addnft`;
      await interaction.editReply({ content: `Please [click here](${url}) to add an NFT.` });

    } else if (commandName === 'removenft') {
      await interaction.deferReply({ flags: 64 });
      const url = `${process.env.WEB_SERVER_URL}/removenft`;
      await interaction.editReply({ content: `Please [click here](${url}) to remove an NFT.` });

    } else if (commandName === 'checkusernfts') {
      if (!interaction.member.permissions.has('Administrator') && !interaction.member.permissions.has('ModerateMembers')) {
        return interaction.reply({ content: 'You need Administrator or Moderator permissions.', flags: 64 });
      }
      await interaction.deferReply({ flags: 64 });
      const username = options.getString('username');

      const userKeys = await redisClient.keys('user:*');
      let userData = null;
      for (const key of userKeys) {
        const data = JSON.parse(await redisClient.get(key));
        if (data.username === username) {
          userData = data;
          break;
        }
      }

      if (!userData || !userData.walletAddresses) {
        return interaction.editReply({ content: `No wallet data found for ${username}.` });
      }

      await promptChainSelection(interaction, `checkusernfts:${interaction.user.id}`, { username, userData }, `Please select the network to check ${username}'s NFT holdings:`);
      return;

    } else if (commandName === 'checkskyct') {
      await interaction.deferReply({ flags: 64 });
      const username = options.getString('username');

      const userKeys = await redisClient.keys('user:*');
      let userData = null;
      for (const key of userKeys) {
        const data = JSON.parse(await redisClient.get(key));
        if (data.username === username) {
          userData = data;
          break;
        }
      }

      if (!userData || !userData.walletAddresses) {
        return interaction.editReply({ content: `User ${username} is not registered.` });
      }

      await promptChainSelection(interaction, `checkskyct:${interaction.user.id}`, {
        username,
        userData,
        guildId: interaction.guild.id
      }, `Please select the network to check if ${username} holds the sKYCt token:`);
      return;

    } else if (commandName === 'verifyskyct') {
      await interaction.deferReply({ flags: 64 });
      const walletAddress = options.getString('walletaddress');
      const nftAddress = SKYCT_NFT_ADDRESS; // Hardcode sKYCt NFT address
      const chain = 'flare'; // Hardcode Flare chain

      if (!ethers.utils.isAddress(walletAddress)) {
        return interaction.editReply({ content: 'Invalid wallet address provided.' });
      }

      const nftData = await getGuildNFTData(interaction.guild.id, nftAddress);
      if (!nftData) {
        return interaction.editReply({ content: 'The sKYCt NFT is not registered for use in this server.' });
      }

      if (!(await isNFTCollectionRegisteredOnChain(nftAddress, chain))) {
        return interaction.editReply({ content: 'The sKYCt NFT collection is not registered on-chain.' });
      }

      if (!(await areRolesRegisteredOnChain(nftAddress, nftData.roles, nftData.valueRole, chain))) {
        return interaction.editReply({ content: 'Some roles for sKYCt NFT are not registered on-chain or sKYCt is misconfigured.' });
      }

      if (!nftData.roles.length && !nftData.valueRole) {
        return interaction.editReply({ content: 'No roles are configured for the sKYCt NFT in this server.' });
      }

      const verificationId = sessionManager.generateUUID();
      const verificationUrl = `${process.env.WEB_SERVER_URL}/verify?token=${verificationId}&chain=${chain}`;
      await sessionManager.storeVerificationData(verificationId, {
        discordId: interaction.user.id,
        username: interaction.user.username,
        walletAddress,
        nftAddress,
        verified: false,
        interactionId: interaction.id,
        interactionToken: interaction.token,
        guildId: interaction.guild.id,
        chain
      });
      await interaction.editReply({ content: `Please [click here](${verificationUrl}) to verify your sKYCt token ownership on Flare.` });
      return;

    } else if (commandName === 'registerrole') {
      await interaction.deferReply({ flags: 64 });
      const url = `${process.env.WEB_SERVER_URL}/registerrole`;
      await interaction.editReply({ content: `Please [click here](${url}) to register a role for an NFT.` });

    } else if (commandName === 'unregisterrole') {
      await interaction.deferReply({ flags: 64 });
      const url = `${process.env.WEB_SERVER_URL}/registerrole`;
      await interaction.editReply({ content: `Please [click here](${url}) to unregister a role for an NFT.` });

    } else if (commandName === 'mapnftvalue') {
      await interaction.deferReply({ flags: 64 });
      const nftAddress = options.getString('nftaddress');
      const tokenId = options.getString('tokenid');
      const value = options.getInteger('value');

      if (!ethers.utils.isAddress(nftAddress)) {
        return interaction.editReply({ content: 'Invalid NFT address provided.' });
      }

      try {
        const { contract: nftVerificationContract } = await getChainContract('songbird');
        await nftVerificationContract.mapNFTValue(nftAddress, tokenId, value);
        await interaction.editReply({ content: `NFT value mapped successfully. Value ${value} assigned to token ${tokenId}.` });
      } catch (error) {
        console.error('Error mapping NFT value:', error);
        await interaction.editReply({ content: `Error mapping NFT value: ${error.message}` });
      }

    } else if (commandName === 'registervaluerole') {
      await interaction.deferReply({ flags: 64 });
      const url = `${process.env.WEB_SERVER_URL}/registervaluerole`;
      await interaction.editReply({ content: `Please [click here](${url}) to register a value-based role for an NFT.` });

    } else if (commandName === 'unregistervaluerole') {
      await interaction.deferReply({ flags: 64 });
      const url = `${process.env.WEB_SERVER_URL}/registervaluerole`;
      await interaction.editReply({ content: `Please [click here](${url}) to unregister a value-based role for an NFT.` });

    } else if (commandName === 'register-guild-nft') {
      if (!interaction.member.permissions.has('Administrator')) {
        return interaction.reply({ content: 'You need administrator permissions.', flags: 64 });
      }
      await interaction.deferReply({ flags: 64 });
      const nftAddress = options.getString('nftaddress');

      if (!ethers.utils.isAddress(nftAddress)) {
        return interaction.editReply({ content: 'Invalid NFT address provided.' });
      }

      await promptChainSelection(interaction, `registerGuildNFT:${interaction.user.id}`, {
        nftAddress,
        guildId: interaction.guild.id
      });
      return;

    } else if (commandName === 'register-guild-role') {
      if (!interaction.member.permissions.has('Administrator')) {
        return interaction.reply({ content: 'You need administrator permissions.', flags: 64 });
      }
      await interaction.deferReply({ flags: 64 });
      const nftAddress = options.getString('nftaddress');
      const roleName = options.getString('rolename');
      const minCount = options.getInteger('mincount') || 1;

      try {
        const nftData = await getGuildNFTData(interaction.guild.id, nftAddress);
        if (!nftData) return interaction.editReply({ content: `NFT ${nftAddress} is not registered.` });

        const role = interaction.guild.roles.cache.find(r => r.name === roleName);
        if (!role) return interaction.editReply({ content: `Role '${roleName}' not found.` });

        const roleEntry = `${roleName}:${minCount}`;
        if (nftData.roles.includes(roleEntry)) return interaction.editReply({ content: `Role '${roleName}' with min count ${minCount} is already registered.` });

        await registerGuildNFTRole(interaction.guild.id, nftAddress, roleName, minCount);
        await interaction.editReply({ content: `✅ Registered role '${roleName}' for NFT ${nftAddress} with min count ${minCount}.` });
      } catch (error) {
        console.error('Error registering guild role:', error);
        await interaction.editReply({ content: `Error registering role: ${error.message}` });
      }

    } else if (commandName === 'register-guild-value-role') {
      if (!interaction.member.permissions.has('Administrator')) {
        return interaction.reply({ content: 'You need administrator permissions.', flags: 64 });
      }
      await interaction.deferReply({ flags: 64 });
      const nftAddress = options.getString('nftaddress');
      const roleName = options.getString('rolename');
      const requiredValue = options.getInteger('requiredvalue');

      try {
        const nftData = await getGuildNFTData(interaction.guild.id, nftAddress);
        if (!nftData) return interaction.editReply({ content: `NFT ${nftAddress} is not registered.` });

        const role = interaction.guild.roles.cache.find(r => r.name === roleName);
        if (!role) return interaction.editReply({ content: `Role '${roleName}' not found.` });

        if (nftData.valueRole) return interaction.editReply({ content: `A value role '${nftData.valueRole.roleName}' is already configured.` });

        await registerGuildValueRole(interaction.guild.id, nftAddress, roleName, requiredValue);
        await interaction.editReply({ content: `✅ Registered value-based role '${roleName}' for NFT ${nftAddress} with required value ${requiredValue}.` });
      } catch (error) {
        console.error('Error registering guild value role:', error);
        await interaction.editReply({ content: `Error registering value role: ${error.message}` });
      }

    } else if (commandName === 'unregister-guild-nft') {
      if (!interaction.member.permissions.has('Administrator')) {
        return interaction.reply({ content: 'You need administrator permissions.', flags: 64 });
      }
      await interaction.deferReply({ flags: 64 });
      const nftAddress = options.getString('nftaddress');

      try {
        const success = await unregisterGuildNFT(interaction.guild.id, nftAddress);
        if (success) await interaction.editReply({ content: `✅ Unregistered NFT ${nftAddress} and all associated roles.` });
        else await interaction.editReply({ content: `NFT ${nftAddress} was not registered.` });
      } catch (error) {
        console.error('Error unregistering NFT:', error);
        await interaction.editReply({ content: `Error unregistering NFT: ${error.message}` });
      }

    } else if (commandName === 'list-guild-nfts') {
      await interaction.deferReply({ flags: 64 });
      try {
        const guildData = await redisClient.get(`guild:${interaction.guild.id}`);
        if (!guildData || !JSON.parse(guildData).nfts || Object.keys(JSON.parse(guildData).nfts).length === 0) {
          return interaction.editReply({ content: 'No NFTs are registered in this server.' });
        }

        const data = JSON.parse(guildData);
        let responseLines = ['**Registered NFTs and Roles:**\n'];

        for (const [nftAddress, nftData] of Object.entries(data.nfts)) {
          responseLines.push(`📋 NFT: ${nftAddress}`);
          if (nftData.roles && nftData.roles.length > 0) {
            responseLines.push('Standard Roles:');
            nftData.roles.forEach(roleEntry => {
              const [roleName, minCount] = roleEntry.split(':');
              responseLines.push(`• ${roleName} (Min Count: ${minCount || 1})`);
            });
          }
          if (nftData.valueRole) {
            responseLines.push('Value Role:');
            responseLines.push(`• ${nftData.valueRole.roleName} (Required Value: ${nftData.valueRole.requiredValue})`);
          }
          responseLines.push('');
        }

        const response = responseLines.join('\n');
        if (response.length > 2000) {
          const chunks = response.match(/.{1,1900}/g);
          await interaction.editReply({ content: chunks[0] + "\n*(Continued...)*" });
          for (let i = 1; i < chunks.length; i++) await interaction.followUp({ content: chunks[i], flags: 64 });
        } else {
          await interaction.editReply({ content: response });
        }
      } catch (error) {
        console.error('Error listing NFTs:', error);
        await interaction.editReply({ content: `Error listing NFTs: ${error.message}` });
      }

    } else if (commandName === 'check-and-correct-skyct-roles') {
      await interaction.deferReply({ flags: 64 });
      try {
        const result = await checkAndCorrectSKYCtRoles();
        await interaction.editReply({ content: `✅ ${result}` });
      } catch (error) {
        console.error('Error in check-and-correct-skyct-roles:', error);
        await interaction.editReply({ content: '❌ An error occurred while checking and correcting sKYCt roles.' });
      }

    } else if (commandName === 'mintnft') {
      await interaction.deferReply({ flags: 64 });
      const url = `${process.env.WEB_SERVER_URL}/mintNFT`;
      await interaction.editReply({ content: `Please [click here](${url}) to mint your "Are You Human" NFT.` });

    } else if (commandName === 'areyouhuman') {
      await interaction.deferReply({ flags: 64 });
      const walletAddress = options.getString('walletaddress');

      if (!ethers.utils.isAddress(walletAddress)) {
        return interaction.editReply({ content: 'Invalid wallet address provided.' });
      }

      await promptChainSelection(interaction, `areyouhuman:${interaction.user.id}`, {
        walletAddress,
        guildId: interaction.guild.id,
        interactionId: interaction.id,
        interactionToken: interaction.token
      }, 'Please select the network to verify your "Are You Human" NFT:');
      return;
    }

  } catch (error) {
    console.error('Error handling interaction:', error);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: 'An error occurred while processing your request.', flags: 64 });
    } else {
      await interaction.followUp({ content: 'An error occurred while processing your request.', flags: 64 });
    }
  }
});

// Clean up Redis keys periodically
const { cleanRedisKeys } = require('./server/public/js/cleanRedis');
setInterval(async () => {
  try {
    const keys = await redisClient.keys('verifyCommand:*');
    for (const key of keys) {
      const data = await redisClient.get(key);
      if (data) {
        const parsedData = JSON.parse(data);
        if (parsedData.timestamp && (Date.now() - parsedData.timestamp > 3600000)) {
          await redisClient.del(key);
          console.log(`[DEBUG] Cleared stale key: ${key}`);
        }
      }
    }
    console.log('Ran cleanRedisKeys successfully.');
  } catch (error) {
    console.error('Error running cleanRedisKeys:', error);
  }
}, 3600000); // Run every hour

process.on('SIGINT', async () => {
  console.log('Received SIGINT. Performing graceful shutdown...');
  try {
    await redisClient.quit();
    console.log('Redis connection closed.');
    client.destroy();
    console.log('Discord client destroyed.');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM. Performing graceful shutdown...');
  try {
    await redisClient.quit();
    console.log('Redis connection closed.');
    client.destroy();
    console.log('Discord client destroyed.');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

client.login(process.env.DISCORD_BOT_TOKEN);

module.exports = client;