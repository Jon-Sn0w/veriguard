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

// Production mode settings
app.set('env', 'production');
app.set('trust proxy', 1);

// Middleware setup
app.use(cors({
    origin: process.env.WEB_SERVER_URL,
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Add OPTIONS handling for CORS preflight
app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure session with secure settings
const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    cookie: {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
        domain: '.veriguardnft.xyz'
    },
    resave: false,
    saveUninitialized: false
};

app.use(sessionManager.setupSession(sessionConfig));

app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path) => {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
}));

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
    const { token, chain } = req.query;
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
    req.session.chain = chain; // Store chain information

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

    const { walletAddress, signature, token, chain } = req.body;
    console.log('Received data:', { walletAddress, signature, token, chain });

    let verificationData = await sessionManager.retrieveVerificationData(token);

    if (!verificationData) {
        console.log('No verification data found for token:', token);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    console.log('Verification data:', verificationData);

    const { discordId, nftAddress, guildId } = verificationData;
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if (!walletAddress || !nftAddress || !chain) {
        console.error('Missing required data', { walletAddress, nftAddress, chain });
        return res.status(400).json({ message: 'Missing required data' });
    }

    const message = `Please sign this message to verify you are the owner of the wallet: ${walletAddress}`;

    try {
        // Only verify the signature here
        const recoveredAddress = ethers.utils.verifyMessage(message, signature);
        console.log('Recovered Address:', recoveredAddress);

        if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
            return res.status(400).json({ message: 'Signature verification failed.' });
        }

        // Store verification data with discordId first
        verificationData.verified = true;
        verificationData.chain = chain;
        await sessionManager.storeVerificationData(discordId, verificationData);
        
        // Then store with token
        await sessionManager.storeVerificationData(token, verificationData);

        // Store user data
        const username = verificationData.username;
        await userDataManager.storeUserData(username, {
            discordId,
            username,
            walletAddress,
            ipAddress,
            nftAddress,
            guildId,
            chain
        }, req);

        // Clean up session but keep verification data
        if (req.session) {
            await new Promise((resolve, reject) => {
                req.session.destroy(err => {
                    if (err) {
                        console.error('Error destroying session:', err);
                        reject(err);
                    } else {
                        console.log('Session destroyed successfully');
                        resolve();
                    }
                });
            });
        }

        console.log('Wallet verification successful');
        res.json({
            message: 'Verification successful. Please return to Discord to continue.',
            details: { walletAddress, nftAddress }
        });
    } catch (error) {
        console.error('Error verifying signature:', error);
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
    console.log(`Server running in ${app.get('env')} mode on port ${PORT}`);
    console.log(`Using HTTPS: ${process.env.WEB_SERVER_URL}`);
});

module.exports = app;
