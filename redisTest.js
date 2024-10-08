const redis = require('redis');

const redisClient = redis.createClient({
    url: 'redis://cloud:6YlCCxsVJNchex@174.4.109.153:6379',
    socket: {
        connectTimeout: 20000 // Increase the timeout to 20 seconds
    }
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect().catch(err => console.error('Redis Connection Error:', err));

// Function to store data
async function storeData(key, value) {
    try {
        await redisClient.set(key, JSON.stringify(value));
        console.log(`Data stored with key: ${key}`);
    } catch (err) {
        console.error('Error storing data:', err);
    }
}

// Function to retrieve data
async function retrieveData(key) {
    try {
        const data = await redisClient.get(key);
        if (data) {
            console.log(`Data retrieved for key ${key}:`, JSON.parse(data));
            return JSON.parse(data);
        }
        console.log(`No data found for key: ${key}`);
        return null;
    } catch (err) {
        console.error('Error retrieving data:', err);
        return null;
    }
}

// Test storing and retrieving data
(async () => {
    const testKey = 'testKey';
    const testValue = { name: 'John Doe', age: 30 };

    // Store data
    await storeData(testKey, testValue);

    // Retrieve data
    await retrieveData(testKey);

    // Close the Redis connection
    redisClient.quit();
})();
