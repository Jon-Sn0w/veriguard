const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { ethers } = require('ethers');
const sessionManager = require('./sessionManager');
const userDataManager = require('./userDataManager');
const oauthHandlers = require('./oauthHandler');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();

// Middleware setup
app.use(cors({
    origin: process.env.WEB_SERVER_URL,
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessionManager.setupSession());

app.use(express.static(path.join(__dirname, 'public')));

// Load ABI and set up contract
const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
const contractAddress = process.env.CONTRACT_ADDRESS;
const abi = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'abi.json')));
const nftVerificationContract = new ethers.Contract(contractAddress, abi, provider);

// Debug: Log contract initialization
console.log('Contract ABI:', JSON.stringify(abi, null, 2));
console.log('Available contract functions:', Object.keys(nftVerificationContract.functions));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/verify', async (req, res) => {
    const { token } = req.query;
    const verificationData = await sessionManager.retrieveVerificationData(token);

    if (!verificationData) {
        console.log('Invalid verification token:', token);
        return res.status(400).send('Invalid verification token.');
    }

    // Store verification data in session
    req.session.userId = verificationData.discordId;
    req.session.walletAddress = verificationData.walletAddress;
    req.session.nftAddress = verificationData.nftAddress;
    req.session.username = verificationData.username;
    req.session.token = token;

    console.log('Session data set:', req.session);

    req.session.save((err) => {
        if (err) {
            console.error('Error saving session:', err);
            return res.status(500).send('Error saving session');
        }
        console.log('Session saved successfully');
        res.sendFile(path.join(__dirname, 'public', 'verify.html'));
    });
});

app.post('/api/wallet-connect', async (req, res) => {
    console.log('Session at start of /api/wallet-connect:', req.session);

    const { walletAddress, signature, token, network } = req.body; // Ensure `network` is passed
    console.log('Received data:', { walletAddress, signature, token, network });

    let rpcUrl, contractAddress;

    // Determine network settings based on the provided network option
    if (network === 'songbird') {
        rpcUrl = process.env.SONGBIRD_RPC_URL;
        contractAddress = process.env.SONGBIRD_CONTRACT_ADDRESS;
    } else if (network === 'flare') {
        rpcUrl = process.env.FLARE_RPC_URL;
        contractAddress = process.env.FLARE_CONTRACT_ADDRESS;
    } else {
        console.error('Invalid network specified:', network);
        return res.status(400).json({ message: 'Invalid network specified.' });
    }

    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const nftVerificationContract = new ethers.Contract(contractAddress, abi, provider);

    let verificationData = await sessionManager.retrieveVerificationData(token);

    if (!verificationData) {
        console.log('No verification data found for token:', token);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    console.log('Verification data:', verificationData);

    const { discordId, nftAddress, guildId } = verificationData;
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if (!walletAddress || !nftAddress) {
        console.error('Missing walletAddress or nftAddress', { walletAddress, nftAddress });
        return res.status(400).json({ message: 'Missing required data' });
    }

    const message = `Please sign this message to verify you are the owner of the wallet: ${walletAddress}`;

    try {
        console.log('Contract Address:', contractAddress);
        console.log('RPC URL:', rpcUrl);

        // Verify the signature
        const recoveredAddress = ethers.utils.verifyMessage(message, signature);
        console.log('Recovered Address:', recoveredAddress);

        if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
            return res.status(400).json({ message: 'Signature verification failed.' });
        }

        // Verify NFT ownership using the contract's verifyOwnership function
        console.log('Verifying ownership...');
        console.log('Wallet Address:', walletAddress);
        console.log('NFT Address:', nftAddress);
        const isOwner = await nftVerificationContract.verifyOwnership(walletAddress, nftAddress);
        console.log('Is Owner:', isOwner);

        if (!isOwner) {
            return res.status(400).json({ message: 'NFT ownership verification failed.' });
        }

        verificationData.verified = true;
        await sessionManager.storeVerificationData(token, verificationData);

        // Store user data separately
        const username = verificationData.username;
        await userDataManager.storeUserData(username, { discordId, username, walletAddress, ipAddress, nftAddress, guildId }, req);

        console.log('Verification successful');
        res.json({ 
            message: 'Verification successful. Please return to Discord to continue.', 
            details: { walletAddress, nftAddress }
        });
    } catch (error) {
        console.error('Error verifying signature or NFT ownership:', error);
        return res.status(400).json({ message: 'Verification failed.', error: error.message });
    }
});

app.get('/registerRole', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'registerRole.html'));
});

app.get('/registerValueRole', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'registerValueRole.html'));
});

app.get('/addNFT', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'addNFT.html'));
});

app.get('/removeNFT', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'removeNFT.html'));
});

app.get('/discord-oauth2-callback', oauthHandlers.discordOAuthCallback);

app.get('/api/env', (req, res) => {
    const env = {
        SONGBIRD_RPC_URL: process.env.SONGBIRD_RPC_URL,
        FLARE_RPC_URL: process.env.FLARE_RPC_URL,
        SONGBIRD_CONTRACT_ADDRESS: process.env.SONGBIRD_CONTRACT_ADDRESS,
        FLARE_CONTRACT_ADDRESS: process.env.FLARE_CONTRACT_ADDRESS
    };
    res.json(env);
});

app.get('/api/abi', (req, res) => {
    const abi = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'abi.json')));
    res.json(abi);
});

app.post('/api/invalidate-session', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to invalidate session' });
        }
        res.json({ message: 'Session invalidated successfully' });
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('An error occurred:', err);
    res.status(500).send('Internal Server Error');
});

const PORT = process.env.SERVER_PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
