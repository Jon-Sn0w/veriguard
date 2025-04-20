// Redis Cleanup Script for Deleting Verification and Session Keys
const Redis = require('ioredis');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

// Logging the Redis connection settings to ensure they're read correctly
console.log('Connecting to Redis with settings:', {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
});

const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    lazyConnect: true,
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('error', (error) => {
    console.error('Redis connection error:', error);
});

async function cleanRedisKeys() {
    try {
        await redisClient.connect();
        const keys = await redisClient.keys('*');
        const verificationKeys = keys.filter(key => key.startsWith('verification:'));
        const sessionKeys = keys.filter(key => key.startsWith('sess:'));

        console.log(`Found ${verificationKeys.length} verification keys and ${sessionKeys.length} session keys.`);

        for (const key of [...verificationKeys, ...sessionKeys]) {
            await redisClient.del(key);
            console.log(`Deleted key: ${key}`);
        }

        console.log('Redis cleanup completed successfully.');
    } catch (error) {
        console.error('Error during Redis cleanup:', error);
    } finally {
        redisClient.disconnect();
    }
}

module.exports = {
    cleanRedisKeys,
};
