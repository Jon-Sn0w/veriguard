const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const AGENT_DATA_URL = 'https://fasset.oracle-daemon.com/minting/sgb/backend/api/pools?fasset%5B0%5D=FXRP';
const OUTPUT_FILE = path.join(__dirname, '../data/agent-data.json');
const REFRESH_INTERVAL = 60000; // 1 minute in milliseconds

// Helper function to format numbers for logging
function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
}

function makeRequest(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            
            // Handle HTTP status codes
            if (res.statusCode !== 200) {
                reject(new Error(`HTTP Status Code: ${res.statusCode}`));
                return;
            }
            
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (error) {
                    reject(new Error(`JSON Parse Error: ${error.message}`));
                }
            });
        }).on('error', (error) => {
            reject(new Error(`Request Error: ${error.message}`));
        }).setTimeout(10000, () => {
            reject(new Error('Request Timeout'));
        });
    });
}

async function fetchAgentData() {
    try {
        const data = await makeRequest(AGENT_DATA_URL);
        
        // Validate and process the data
        if (!Array.isArray(data)) {
            throw new Error('Invalid data format: Expected array');
        }

        // Process and enrich agent data
        const processedData = data.map(agent => ({
            name: agent.agentName || agent.name, // Use 'name' if 'agentName' is not present
            status: Boolean(agent.status),
            vault: agent.vault,
            pool: agent.pool,
            mintFee: Number(agent.mintFee),
            poolCR: Number(agent.poolCR),
            vaultCR: Number(agent.vaultCR),
            mintCount: Number(agent.mintCount),
            mintedAssets: Number(agent.mintedAssets),
            mintedUSD: Number(agent.mintedUSD.replace(/,/g, '')), // Remove commas before converting to number
            allLots: Number(agent.allLots),
            redeemRate: Number(agent.redeemRate),
            numLiquidations: Number(agent.numLiquidations),
            url: agent.url,
            description: agent.description,
            poolCollateralUSD: Number(agent.poolCollateralUSD.replace(/,/g, '')), // Remove commas
            vaultCollateral: Number(agent.vaultCollateral),
            totalPortfolioValueUSD: Number(agent.totalPortfolioValueUSD.replace(/,/g, '')), // Remove commas
            health: Number(agent.health),
            lastUpdated: new Date().toISOString(),
            // Additional fields from API response that might be useful
            vaultCCBCR: Number(agent.vaultCCBCR),
            vaultMinCR: Number(agent.vaultMinCR),
            vaultSafetyCR: Number(agent.vaultSafetyCR),
            poolCCBCR: Number(agent.poolCCBCR),
            poolMinCR: Number(agent.poolMinCR),
            poolSafetyCR: Number(agent.poolSafetyCR),
            mintingPoolCR: Number(agent.mintingPoolCR),
            mintingVaultCR: Number(agent.mintingVaultCR)
        }));

        // Calculate system totals
        const systemMetrics = processedData.reduce((acc, agent) => ({
            totalMintedUSD: acc.totalMintedUSD + agent.mintedUSD,
            totalMintCount: acc.totalMintCount + agent.mintCount,
            totalLots: acc.totalLots + agent.allLots,
            totalCollateralUSD: acc.totalCollateralUSD + agent.poolCollateralUSD,
            activeAgents: acc.activeAgents + (agent.status ? 1 : 0)
        }), {
            totalMintedUSD: 0,
            totalMintCount: 0,
            totalLots: 0,
            totalCollateralUSD: 0,
            activeAgents: 0
        });

        // Add market share calculations
        const enrichedData = processedData.map(agent => ({
            ...agent,
            marketShare: (agent.mintedUSD / systemMetrics.totalMintedUSD * 100).toFixed(2),
            collateralShare: (agent.poolCollateralUSD / systemMetrics.totalCollateralUSD * 100).toFixed(2)
        }));

        // Prepare final output
        const outputData = {
            lastUpdated: new Date().toISOString(),
            systemMetrics,
            agents: enrichedData
        };

        // Ensure the directory exists
        const dir = path.dirname(OUTPUT_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Write the data
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2));

        // Log success with key metrics
        console.log('\nAgent data updated successfully:', new Date().toISOString());
        console.log(`Active Agents: ${systemMetrics.activeAgents}`);
        console.log(`Total Minted USD: $${formatNumber(systemMetrics.totalMintedUSD)}`);
        console.log(`Total Lots: ${formatNumber(systemMetrics.totalLots)}`);
        console.log(`Total Collateral: $${formatNumber(systemMetrics.totalCollateralUSD)}`);

        return outputData;

    } catch (error) {
        console.error('Error fetching agent data:', error);
        // If we have existing data, maintain it rather than failing
        if (fs.existsSync(OUTPUT_FILE)) {
            console.log('Using cached agent data');
            return JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
        }
        throw error;
    }
}

async function startAgentDataCollection() {
    try {
        // Initial fetch
        await fetchAgentData();

        // Set up periodic fetch
        setInterval(async () => {
            try {
                await fetchAgentData();
            } catch (error) {
                console.error('Error in periodic agent data fetch:', error);
            }
        }, REFRESH_INTERVAL);

    } catch (error) {
        console.error('Fatal error in agent data collection:', error);
        process.exit(1);
    }
}

// If run directly, start the collection process
if (require.main === module) {
    startAgentDataCollection();
}

module.exports = {
    fetchAgentData,
    startAgentDataCollection
};
