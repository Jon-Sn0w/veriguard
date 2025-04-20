const redis = require('redis');
require('dotenv').config();

const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;
const redisPassword = process.env.REDIS_PASSWORD;

if (!redisHost || !redisPort || !redisPassword) {
    console.error('Redis environment variables are missing');
    process.exit(1);
}

console.log('Connecting to Redis with the following configuration:');
console.log(`Host: ${redisHost}`);
console.log(`Port: ${redisPort}`);
console.log(`Password: ${redisPassword.substring(0, 3)}...`); // Only log the first 3 characters of the password for security

const redisClient = redis.createClient({
    url: `redis://:${redisPassword}@${redisHost}:${redisPort}`,
    socket: {
        connectTimeout: 20000 // 20 seconds timeout
    }
});

redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});

redisClient.on('connect', () => {
    console.log('Connected to Redis successfully');
});

redisClient.on('ready', () => {
    console.log('Redis client is ready');
});

redisClient.on('end', () => {
    console.log('Redis connection ended');
});

async function connectWithRetry(maxRetries = 5, delay = 5000) {
    let retries = 0;
    while (retries < maxRetries) {
        try {
            await redisClient.connect();
            console.log('Redis connected successfully');
            return;
        } catch (err) {
            console.error(`Redis connection attempt ${retries + 1} failed:`, err);
            retries++;
            if (retries >= maxRetries) {
                console.error('Max retries reached. Exiting...');
                process.exit(1);
            }
            console.log(`Retrying in ${delay / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

connectWithRetry().catch(err => {
    console.error('Redis Connection Error:', err);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down...');
    await redisClient.quit();
    process.exit(0);
});

module.exports = redisClient;
