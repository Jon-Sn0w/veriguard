const redisClient = require('./server/redisClient');

async function cleanRedis() {
    try {
        const keys = await redisClient.keys('*');
        for (const key of keys) {
            const data = await redisClient.get(key);
            if (data) {
                try {
                    JSON.parse(data); // Try to parse the data to ensure it's valid JSON
                } catch (parseError) {
                    console.error(`Deleting malformed data for key ${key}`);
                    await redisClient.del(key);
                }
            }
        }
        console.log('Redis cleanup completed.');
    } catch (err) {
        console.error('Error during Redis cleanup:', err);
    }
}

cleanRedis();
