// server/public/js/guildRoleManager.js

const Redis = require('redis');
const { EmbedBuilder } = require('discord.js');

class GuildRoleManager {
    constructor(redisClient) {
        if (!redisClient) {
            throw new Error('Redis client is required for GuildRoleManager');
        }
        this.redis = redisClient;
    }

    // Generate Redis keys
    getGuildKey(guildId) {
        if (!guildId) throw new Error('Guild ID is required');
        return `guild:${guildId}:nfts`;
    }

    getGuildNFTKey(guildId, nftAddress) {
        if (!guildId || !nftAddress) throw new Error('Guild ID and NFT address are required');
        return `guild:${guildId}:nft:${nftAddress.toLowerCase()}:config`;
    }

    getGuildRoleKey(guildId, nftAddress, roleName) {
        if (!guildId || !nftAddress || !roleName) throw new Error('Guild ID, NFT address, and role name are required');
        return `guild:${guildId}:nft:${nftAddress.toLowerCase()}:role:${roleName}`;
    }

    getGuildValueRoleKey(guildId, nftAddress, roleName) {
        if (!guildId || !nftAddress || !roleName) throw new Error('Guild ID, NFT address, and role name are required');
        return `guild:${guildId}:nft:${nftAddress.toLowerCase()}:valuerole:${roleName}`;
    }

    // Register NFT for guild
    async registerGuildNFT(guildId, nftAddress, registeredBy) {
        return new Promise((resolve, reject) => {
            try {
                const nftKey = this.getGuildNFTKey(guildId, nftAddress);
                const timestamp = Date.now().toString();
                
                const data = {
                    registeredBy,
                    registeredAt: timestamp,
                    enabled: 'true',
                    lastUpdated: timestamp
                };
                
                this.redis.set(nftKey, JSON.stringify(data), (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    
                    this.redis.sadd(this.getGuildKey(guildId), nftAddress.toLowerCase(), (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        
                        console.log(`Registered NFT ${nftAddress} for guild ${guildId}`);
                        resolve(true);
                    });
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    // Register standard role for guild NFT
    async registerGuildRole(guildId, nftAddress, roleName, registeredBy) {
        return new Promise((resolve, reject) => {
            try {
                const roleKey = this.getGuildRoleKey(guildId, nftAddress, roleName);
                const timestamp = Date.now().toString();
                
                const data = {
                    registeredBy,
                    registeredAt: timestamp,
                    enabled: 'true',
                    lastUpdated: timestamp,
                    type: 'standard'
                };
                
                this.redis.set(roleKey, JSON.stringify(data), (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    
                    console.log(`Registered role ${roleName} for NFT ${nftAddress} in guild ${guildId}`);
                    resolve(true);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    // Register value role for guild NFT
    async registerGuildValueRole(guildId, nftAddress, roleName, requiredValue, registeredBy) {
        return new Promise((resolve, reject) => {
            try {
                const valueRoleKey = this.getGuildValueRoleKey(guildId, nftAddress, roleName);
                const timestamp = Date.now().toString();
                
                const data = {
                    registeredBy,
                    registeredAt: timestamp,
                    requiredValue: requiredValue.toString(),
                    enabled: 'true',
                    lastUpdated: timestamp,
                    type: 'value'
                };
                
                this.redis.set(valueRoleKey, JSON.stringify(data), (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    
                    console.log(`Registered value role ${roleName} for NFT ${nftAddress} in guild ${guildId}`);
                    resolve(true);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

// Verification methods
    async isNFTRegisteredForGuild(guildId, nftAddress) {
        return new Promise((resolve, reject) => {
            const nftKey = this.getGuildNFTKey(guildId, nftAddress);
            this.redis.get(nftKey, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!result) {
                    resolve(false);
                    return;
                }
                try {
                    const data = JSON.parse(result);
                    resolve(data.enabled === 'true');
                } catch (error) {
                    resolve(false);
                }
            });
        });
    }

    async isRoleRegisteredForGuildNFT(guildId, nftAddress, roleName) {
        return new Promise((resolve, reject) => {
            const roleKey = this.getGuildRoleKey(guildId, nftAddress, roleName);
            this.redis.get(roleKey, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!result) {
                    resolve(false);
                    return;
                }
                try {
                    const data = JSON.parse(result);
                    resolve(data.enabled === 'true' && data.type === 'standard');
                } catch (error) {
                    resolve(false);
                }
            });
        });
    }

    async isValueRoleRegisteredForGuildNFT(guildId, nftAddress, roleName) {
        return new Promise((resolve, reject) => {
            const valueRoleKey = this.getGuildValueRoleKey(guildId, nftAddress, roleName);
            this.redis.get(valueRoleKey, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!result) {
                    resolve(false);
                    return;
                }
                try {
                    const data = JSON.parse(result);
                    resolve(data.enabled === 'true' && data.type === 'value');
                } catch (error) {
                    resolve(false);
                }
            });
        });
    }

    async getValueRoleRequirement(guildId, nftAddress, roleName) {
        return new Promise((resolve, reject) => {
            const valueRoleKey = this.getGuildValueRoleKey(guildId, nftAddress, roleName);
            this.redis.get(valueRoleKey, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!result) {
                    resolve(null);
                    return;
                }
                try {
                    const data = JSON.parse(result);
                    resolve(data.enabled === 'true' ? parseInt(data.requiredValue) : null);
                } catch (error) {
                    resolve(null);
                }
            });
        });
    }

    // Retrieval methods
    async getGuildNFTs(guildId) {
        return new Promise((resolve, reject) => {
            this.redis.smembers(this.getGuildKey(guildId), (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result || []);
            });
        });
    }

    async getGuildNFTRoles(guildId, nftAddress) {
        return new Promise((resolve, reject) => {
            const pattern = this.getGuildRoleKey(guildId, nftAddress, '*');
            this.redis.keys(pattern, async (err, keys) => {
                if (err) {
                    reject(err);
                    return;
                }

                try {
                    const roles = [];
                    for (const key of keys) {
                        const roleData = await new Promise((resolve, reject) => {
                            this.redis.get(key, (err, result) => {
                                if (err) reject(err);
                                else resolve(result ? JSON.parse(result) : null);
                            });
                        });

                        if (roleData && roleData.enabled === 'true' && roleData.type === 'standard') {
                            const roleName = key.split(':').pop();
                            roles.push({
                                name: roleName,
                                ...roleData
                            });
                        }
                    }
                    resolve(roles);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    async getGuildNFTValueRoles(guildId, nftAddress) {
        return new Promise((resolve, reject) => {
            const pattern = this.getGuildValueRoleKey(guildId, nftAddress, '*');
            this.redis.keys(pattern, async (err, keys) => {
                if (err) {
                    reject(err);
                    return;
                }

                try {
                    const roles = [];
                    for (const key of keys) {
                        const roleData = await new Promise((resolve, reject) => {
                            this.redis.get(key, (err, result) => {
                                if (err) reject(err);
                                else resolve(result ? JSON.parse(result) : null);
                            });
                        });

                        if (roleData && roleData.enabled === 'true' && roleData.type === 'value') {
                            const roleName = key.split(':').pop();
                            roles.push({
                                name: roleName,
                                ...roleData
                            });
                        }
                    }
                    resolve(roles);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

// Cleanup methods
    async unregisterGuildNFT(guildId, nftAddress) {
        return new Promise((resolve, reject) => {
            const nftKey = this.getGuildNFTKey(guildId, nftAddress);
            this.redis.get(nftKey, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                try {
                    const data = result ? JSON.parse(result) : { enabled: 'true' };
                    data.enabled = 'false';
                    
                    this.redis.set(nftKey, JSON.stringify(data), (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        
                        this.redis.srem(this.getGuildKey(guildId), nftAddress.toLowerCase(), (err) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            resolve(true);
                        });
                    });
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    async unregisterGuildRole(guildId, nftAddress, roleName) {
        return new Promise((resolve, reject) => {
            const roleKey = this.getGuildRoleKey(guildId, nftAddress, roleName);
            this.redis.get(roleKey, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                try {
                    const data = result ? JSON.parse(result) : { enabled: 'true' };
                    data.enabled = 'false';
                    
                    this.redis.set(roleKey, JSON.stringify(data), (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(true);
                    });
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    async unregisterGuildValueRole(guildId, nftAddress, roleName) {
        return new Promise((resolve, reject) => {
            const valueRoleKey = this.getGuildValueRoleKey(guildId, nftAddress, roleName);
            this.redis.get(valueRoleKey, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                try {
                    const data = result ? JSON.parse(result) : { enabled: 'true' };
                    data.enabled = 'false';
                    
                    this.redis.set(valueRoleKey, JSON.stringify(data), (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(true);
                    });
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    // Bulk operations
    async getGuildNFTAllRoles(guildId, nftAddress) {
        try {
            const [standardRoles, valueRoles] = await Promise.all([
                this.getGuildNFTRoles(guildId, nftAddress),
                this.getGuildNFTValueRoles(guildId, nftAddress)
            ]);
            return { standardRoles, valueRoles };
        } catch (error) {
            console.error('Error getting all guild NFT roles:', error);
            throw error;
        }
    }

    // Status check method
    async checkRoleStatus(guildId, nftAddress, roleName) {
        return new Promise(async (resolve, reject) => {
            try {
                // Check standard role first
                const standardRoleKey = this.getGuildRoleKey(guildId, nftAddress, roleName);
                this.redis.get(standardRoleKey, (err, standardResult) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    if (standardResult) {
                        try {
                            const standardData = JSON.parse(standardResult);
                            if (standardData.enabled === 'true') {
                                resolve({
                                    exists: true,
                                    type: 'standard',
                                    ...standardData
                                });
                                return;
                            }
                        } catch (error) {
                            console.error('Error parsing standard role data:', error);
                        }
                    }

                    // Check value role
                    const valueRoleKey = this.getGuildValueRoleKey(guildId, nftAddress, roleName);
                    this.redis.get(valueRoleKey, (err, valueResult) => {
                        if (err) {
                            reject(err);
                            return;
                        }

                        if (valueResult) {
                            try {
                                const valueData = JSON.parse(valueResult);
                                if (valueData.enabled === 'true') {
                                    resolve({
                                        exists: true,
                                        type: 'value',
                                        ...valueData
                                    });
                                    return;
                                }
                            } catch (error) {
                                console.error('Error parsing value role data:', error);
                            }
                        }

                        resolve({
                            exists: false,
                            type: null
                        });
                    });
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}

// Create and export a singleton instance
const guildRoleManager = new GuildRoleManager(require('../../redisClient'));

module.exports = {
    GuildRoleManager,
    guildRoleManager
};
