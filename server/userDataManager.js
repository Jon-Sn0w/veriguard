const redisClient = require('./redisClient');
const UAParser = require('ua-parser-js');

async function storeUserData(username, data, req) {
    const key = `user:${username}`;
    try {
        let existingData = await redisClient.get(key);
        if (existingData) {
            existingData = JSON.parse(existingData);
        } else {
            existingData = {
                discordId: data.discordId,
                username: username,
                walletAddresses: [],
                ipAddresses: [],
                guildIds: [],
                nftAddresses: [],
                osSessions: []
            };
        }

        // Ensure all arrays exist
        existingData.walletAddresses = existingData.walletAddresses || [];
        existingData.ipAddresses = existingData.ipAddresses || [];
        existingData.guildIds = existingData.guildIds || [];
        existingData.nftAddresses = existingData.nftAddresses || [];
        existingData.osSessions = existingData.osSessions || [];

        if (!existingData.walletAddresses.includes(data.walletAddress)) {
            existingData.walletAddresses.push(data.walletAddress);
        }
        if (!existingData.ipAddresses.includes(data.ipAddress)) {
            existingData.ipAddresses.push(data.ipAddress);
        }
        if (data.guildId && !existingData.guildIds.includes(data.guildId)) {
            existingData.guildIds.push(data.guildId);
        }
        if (data.nftAddress && !existingData.nftAddresses.includes(data.nftAddress)) {
            existingData.nftAddresses.push(data.nftAddress);
        }

        // Add OS fingerprinting
        if (req && req.headers['user-agent']) {
            const parser = new UAParser(req.headers['user-agent']);
            const osInfo = parser.getOS();
            const browserInfo = parser.getBrowser();
            const deviceInfo = parser.getDevice();

            existingData.osSessions.push({
                timestamp: new Date().toISOString(),
                os: osInfo.name + ' ' + osInfo.version,
                browser: browserInfo.name + ' ' + browserInfo.version,
                device: `${deviceInfo.vendor} ${deviceInfo.model} ${deviceInfo.type}`,
                ipAddress: data.ipAddress
            });
        }

        await redisClient.set(key, JSON.stringify(existingData));
        console.log(`Storing user data for username: ${username}, data:`, existingData);
    } catch (err) {
        console.error(`Error storing user data for username: ${username}:`, err);
        throw err; // Rethrow the error to be handled by the caller
    }
}

async function retrieveUserData(username) {
    const key = `user:${username}`;
    try {
        const data = await redisClient.get(key);
        if (data) {
            console.log(`Retrieved user data for username: ${username}, data:`, JSON.parse(data));
            return JSON.parse(data);
        }
        console.log(`No user data found for username: ${username}`);
        return null;
    } catch (err) {
        console.error(`Error retrieving user data for username: ${username}:`, err);
        throw err; // Rethrow the error to be handled by the caller
    }
}

async function getAllUserData() {
    try {
        const keys = await redisClient.keys('user:*');
        const allUserData = [];
        for (const key of keys) {
            const data = await redisClient.get(key);
            if (data) {
                allUserData.push(JSON.parse(data));
            }
        }
        console.log('Retrieved all user data:', allUserData);
        return allUserData;
    } catch (err) {
        console.error('Error retrieving all user data:', err);
        throw err; // Rethrow the error to be handled by the caller
    }
}

module.exports = {
    storeUserData,
    retrieveUserData,
    getAllUserData
};
