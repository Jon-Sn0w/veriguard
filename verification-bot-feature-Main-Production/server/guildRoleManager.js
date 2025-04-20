// server/guildRoleManager.js
const Redis = require('ioredis');
require('dotenv').config();

class GuildRoleManager {
    constructor() {
        this.redisClient = new Redis({
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            password: process.env.REDIS_PASSWORD
        });
    }

    // Store NFT and role in guild's registration
    async registerGuildNFT(guildId, nftAddress, roleName, isValueRole = false, requiredValue = 0) {
        const key = `guild:${guildId}`;
        try {
            let guildData = await this.redisClient.get(key);
            guildData = guildData ? JSON.parse(guildData) : { nfts: {} };

            // Add or update NFT registration
            guildData.nfts[nftAddress.toLowerCase()] = {
                roles: isValueRole ? [] : [roleName],
                valueRole: isValueRole ? {
                    roleName,
                    requiredValue
                } : null,
                timestamp: Date.now()
            };

            await this.redisClient.set(key, JSON.stringify(guildData));
        } catch (error) {
            console.error('Error registering guild NFT:', error);
            throw error;
        }
    }

    // Check if NFT is registered for guild
    async isNFTRegisteredForGuild(guildId, nftAddress) {
        const key = `guild:${guildId}`;
        try {
            const guildData = await this.redisClient.get(key);
            if (!guildData) return false;

            const data = JSON.parse(guildData);
            return !!data.nfts[nftAddress.toLowerCase()];
        } catch (error) {
            console.error('Error checking NFT registration:', error);
            throw error;
        }
    }

    // Get guild's NFT registration data
    async getGuildNFTData(guildId, nftAddress) {
        const key = `guild:${guildId}`;
        try {
            const guildData = await this.redisClient.get(key);
            if (!guildData) return null;

            const data = JSON.parse(guildData);
            return data.nfts[nftAddress.toLowerCase()] || null;
        } catch (error) {
            console.error('Error getting NFT data:', error);
            throw error;
        }
    }

    // Remove NFT registration from guild
    async unregisterGuildNFT(guildId, nftAddress) {
        const key = `guild:${guildId}`;
        try {
            const guildData = await this.redisClient.get(key);
            if (!guildData) return false;

            const data = JSON.parse(guildData);
            const normalizedAddress = nftAddress.toLowerCase();

            if (data.nfts[normalizedAddress]) {
                delete data.nfts[normalizedAddress];
                await this.redisClient.set(key, JSON.stringify(data));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error unregistering NFT:', error);
            throw error;
        }
    }
}

module.exports = new GuildRoleManager();
