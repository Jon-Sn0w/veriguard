// server/guildBackendManager.js
const Redis = require('ioredis');
const { ethers } = require('ethers');
require('dotenv').config();

class GuildBackendManager {
    constructor() {
        this.keyPrefix = 'guild_nft:';
        
        // Initialize Redis connection with Redis 7.x compatibility settings
        this.redisClient = new Redis({
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            password: process.env.REDIS_PASSWORD,
            retryStrategy(times) {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            maxRetriesPerRequest: 3,
            enableReadyCheck: true,
            connectTimeout: 20000,
            disconnectTimeout: 2000,
            commandTimeout: 5000,
            reconnectOnError(err) {
                const targetError = 'READONLY';
                if (err.message.includes(targetError)) {
                    return true;
                }
                return false;
            },
            retryDelayOnFailover: 100,
            enableOfflineQueue: true,
            db: 0
        });

        // Set up event listeners for Redis connection
        this.redisClient.on('connect', () => {
            console.log('GuildBackendManager: Connecting to Redis...');
        });

        this.redisClient.on('ready', () => {
            console.log('GuildBackendManager: Redis connection is ready');
        });

        this.redisClient.on('error', (err) => {
            console.error('GuildBackendManager Redis Error:', err);
        });

        this.redisClient.on('close', () => {
            console.log('GuildBackendManager: Redis connection closed');
        });

        this.redisClient.on('reconnecting', () => {
            console.log('GuildBackendManager: Reconnecting to Redis...');
        });
    }

    // Test Redis connection
    async testConnection() {
        try {
            await this.redisClient.ping();
            console.log('Redis connection test successful');
            return true;
        } catch (error) {
            console.error('Redis connection test failed:', error);
            return false;
        }
    }

    // Store guild NFT configuration
    async storeGuildNFT(guildId, nftAddress, roleData) {
        const key = `${this.keyPrefix}${guildId}:${nftAddress.toLowerCase()}`;
        try {
            await this.redisClient.set(key, JSON.stringify({
                ...roleData,
                timestamp: Date.now()
            }));
            console.log(`Stored guild NFT data for ${guildId}:${nftAddress}`);
        } catch (error) {
            console.error('Error storing guild NFT:', error);
            throw error;
        }
    }

    // Get guild NFT configuration
    async getGuildNFT(guildId, nftAddress) {
        const key = `${this.keyPrefix}${guildId}:${nftAddress.toLowerCase()}`;
        try {
            const data = await this.redisClient.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error getting guild NFT:', error);
            throw error;
        }
    }

    // Store value role configuration
    async storeValueRole(guildId, nftAddress, roleData) {
        const key = `${this.keyPrefix}value:${guildId}:${nftAddress.toLowerCase()}`;
        try {
            await this.redisClient.set(key, JSON.stringify({
                ...roleData,
                timestamp: Date.now()
            }));
            console.log(`Stored value role data for ${guildId}:${nftAddress}`);
        } catch (error) {
            console.error('Error storing value role:', error);
            throw error;
        }
    }

    // Get value role configuration
    async getValueRole(guildId, nftAddress) {
        const key = `${this.keyPrefix}value:${guildId}:${nftAddress.toLowerCase()}`;
        try {
            const data = await this.redisClient.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error getting value role:', error);
            throw error;
        }
    }

    // List all NFTs registered for a guild
    async listGuildNFTs(guildId) {
        const pattern = `${this.keyPrefix}${guildId}:*`;
        try {
            const keys = await this.redisClient.keys(pattern);
            const nfts = [];

            for (const key of keys) {
                if (!key.includes(':value:')) {
                    const data = await this.redisClient.get(key);
                    if (data) {
                        const nftData = JSON.parse(data);
                        const nftAddress = key.split(':')[2];
                        nfts.push({ nftAddress, ...nftData });
                    }
                }
            }
            return nfts;
        } catch (error) {
            console.error('Error listing guild NFTs:', error);
            throw error;
        }
    }

    // Remove NFT configuration
    async removeGuildNFT(guildId, nftAddress) {
        const normalizedAddress = nftAddress.toLowerCase();
        const standardKey = `${this.keyPrefix}${guildId}:${normalizedAddress}`;
        const valueKey = `${this.keyPrefix}value:${guildId}:${normalizedAddress}`;
        
        try {
            await Promise.all([
                this.redisClient.del(standardKey),
                this.redisClient.del(valueKey)
            ]);
            console.log(`Removed guild NFT data for ${guildId}:${nftAddress}`);
        } catch (error) {
            console.error('Error removing guild NFT:', error);
            throw error;
        }
    }

    // Check if NFT is registered for guild
    async isNFTRegistered(guildId, nftAddress, roleName = null) {
        try {
            const nftData = await this.getGuildNFT(guildId, nftAddress);
            const valueRoleData = await this.getValueRole(guildId, nftAddress);

            if (roleName) {
                // Check for specific role
                return !!(
                    (nftData && nftData.roles && nftData.roles.includes(roleName)) ||
                    (valueRoleData && valueRoleData.roleName === roleName)
                );
            }
            // Check for any registration
            return !!(nftData || valueRoleData);
        } catch (error) {
            console.error('Error checking NFT registration:', error);
            throw error;
        }
    }

    // Get all value roles for a guild
    async getGuildValueRoles(guildId) {
        const pattern = `${this.keyPrefix}value:${guildId}:*`;
        try {
            const keys = await this.redisClient.keys(pattern);
            const valueRoles = [];

            for (const key of keys) {
                const data = await this.redisClient.get(key);
                if (data) {
                    const roleData = JSON.parse(data);
                    const nftAddress = key.split(':')[3];
                    valueRoles.push({ nftAddress, ...roleData });
                }
            }

            return valueRoles;
        } catch (error) {
            console.error('Error getting guild value roles:', error);
            throw error;
        }
    }

    // Cleanup Redis connection
    async cleanup() {
        try {
            await this.redisClient.quit();
            console.log('GuildBackendManager Redis connection closed');
        } catch (error) {
            console.error('Error during GuildBackendManager cleanup:', error);
        }
    }
}

// Create and export a single instance
const guildBackendManager = new GuildBackendManager();

// Handle process termination
process.on('SIGTERM', async () => {
    await guildBackendManager.cleanup();
});

process.on('SIGINT', async () => {
    await guildBackendManager.cleanup();
});

module.exports = guildBackendManager;
