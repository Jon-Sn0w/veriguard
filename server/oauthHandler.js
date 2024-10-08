const axios = require('axios');

const oauthHandlers = {
    discordOAuthCallback: async (req, res) => {
        const { code } = req.query;
        const data = {
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: `${process.env.REDIRECT_URI}/discord-oauth2-callback`,
            scope: 'identify'
        };

        try {
            const response = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams(data).toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            if (response.status === 200) {
                const accessToken = response.data.access_token;
                res.send('Authentication successful! You can close this window.');
            } else {
                console.error('Failed to retrieve access token', response.statusText);
                res.status(500).send('Error during authentication.');
            }
        } catch (error) {
            console.error('Failed to retrieve access token', error);
            res.status(500).send('Error during authentication.');
        }
    }
};

module.exports = oauthHandlers;
