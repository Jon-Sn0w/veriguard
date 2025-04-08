const https = require('https');
const path = require('path');
const fs = require('fs');
const { ethers } = require('ethers');
const Joi = require('joi');
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const PERIOD_CONFIG = {
    PROGRAM_START: new Date('2024-12-18T13:00:00.000Z'),  // Dec 18, 2023, 5 AM PST
    PERIOD_LENGTH_MS: 14 * 24 * 60 * 60 * 1000,  // 14 days in milliseconds
    TOTAL_PERIODS: 8
};


// Load environment variables
require('dotenv').config();

// Logger configuration
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new DailyRotateFile({
            filename: 'rewards-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            dirname: path.join(__dirname, '../logs'),
            maxFiles: '14d'
        })
    ]
});

// Contract and program configuration
const CONTRACTS = {
    FXRP: '0x299d678f67e7add4efdf295ebe0e92fcb4f75c4c',
    FDOGE: '0xaa25ee3B68c515e69A463876Ab262bc4e8339030'
};

const UNITS_PER_LOT = {
    FXRP: 100,
    FDOGE: 100
};

const BIWEEKLY_REWARDS = {
    FXRP: 14857,
    FDOGE: 14857
};

// FTSO Configuration
const FTSO_READER_ADDRESS = '0x3ce3af29bFfD0f90FaF2F0F94a2878b64B617B05';
const FTSO_ABI = [
    {
        "inputs": [],
        "name": "getFtsoV2CurrentFeedValues",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "_feedValues",
                "type": "uint256[]"
            },
            {
                "internalType": "int8[]",
                "name": "_decimals",
                "type": "int8[]"
            },
            {
                "internalType": "uint64",
                "name": "_timestamp",
                "type": "uint64"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// Blockscout API endpoint
const API_BASE = 'https://songbird-explorer.flare.network/api';

// Utility functions

function getCurrentPeriodInfo() {
    const now = new Date();
    const timeSinceStart = now.getTime() - PERIOD_CONFIG.PROGRAM_START.getTime();
    const currentPeriod = Math.floor(timeSinceStart / PERIOD_CONFIG.PERIOD_LENGTH_MS) + 1;
    
    const periodStart = new Date(PERIOD_CONFIG.PROGRAM_START.getTime() + 
        ((currentPeriod - 1) * PERIOD_CONFIG.PERIOD_LENGTH_MS));
    const periodEnd = new Date(periodStart.getTime() + PERIOD_CONFIG.PERIOD_LENGTH_MS);

    return {
        period: currentPeriod,
        periodStart,
        periodEnd,
        previousPeriods: Array.from({length: currentPeriod - 1}, (_, i) => i + 1)
    };
}

function formatDate(date) {
    return date.toLocaleString('en-US', { 
        timeZone: 'America/Los_Angeles',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

function makeRequest(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

function decodeRedeemLots(inputData) {
    try {
        const lotsHex = inputData.slice(10, 74);
        const lots = parseInt(lotsHex, 16);
        if (isNaN(lots)) return 0;
        return lots;
    } catch (error) {
        logger.error('Error decoding redeem lots:', { error: error.message });
        return 0;
    }
}

function calculateFeesPerLot(price, agent, assetType) {
    try {
        // Calculate actual lot value based on real transactions
        const avgLotValueUSD = agent.mintCount > 0 ? 
            agent.mintedUSD / agent.mintCount : 
            UNITS_PER_LOT[assetType] * price;
            
        // Calculate effective mint fee based on actual collected fees
        const effectiveMintFee = agent.mintCount > 0 ? 
            (agent.mintFeeCollected / agent.mintedUSD) * 100 : 
            agent.mintFee;

        // Calculate fees using actual rates
        const mintFeeUSD = avgLotValueUSD * (effectiveMintFee / 100);
        const redeemFeeUSD = avgLotValueUSD * (agent.redeemRate / 100);
        const totalFeeUSD = mintFeeUSD + redeemFeeUSD;

        return {
            unitsPerLot: UNITS_PER_LOT[assetType],
            usdValue: avgLotValueUSD,
            price,
            feeStructure: {
                mintFee: mintFeeUSD,
                redeemFee: redeemFeeUSD,
                totalFee: totalFeeUSD,
                mintPercentage: effectiveMintFee,
                redeemPercentage: agent.redeemRate
            },
            effectiveRates: {
                mintFeePercentage: effectiveMintFee,
                redeemFeePercentage: agent.redeemRate,
                avgLotValueUSD: avgLotValueUSD
            }
        };
    } catch (error) {
        logger.error('Error calculating fees per lot:', { 
            error: error.message, 
            agent: agent.name 
        });
        throw error;
    }
}

function calculateProfitMetrics(totalLots, feeStructure, assetType, historicalData = null) {
    try {
        const rewardsPerLot = totalLots > 0 ? BIWEEKLY_REWARDS[assetType] / totalLots : 0;
        const netProfitPerLot = rewardsPerLot - feeStructure.totalFee;
        const breakevenLots = Math.floor(BIWEEKLY_REWARDS[assetType] / feeStructure.totalFee);
        const roi = feeStructure.totalFee > 0 ? 
            (netProfitPerLot / feeStructure.totalFee) * 100 : 0;

        const metrics = {
            rewardsPerLot,
            netProfitPerLot,
            breakevenLots,
            isProfitable: netProfitPerLot > 0,
            roi
        };

       if (historicalData) {
            metrics.historical = {
                avgRewardsPerLot: historicalData.avgRewardsPerLot,
                avgNetProfitPerLot: historicalData.avgNetProfitPerLot,
                totalHistoricalProfit: historicalData.totalProfit,
                profitablePeriods: historicalData.profitablePeriods,
                totalPeriods: historicalData.totalPeriods
            };
        }

        return metrics;
    } catch (error) {
        logger.error('Error calculating profit metrics:', { error: error.message });
        throw error;
    }
}

function loadHistoricalData() {
    const filePath = path.join(__dirname, '../data/historical-data.json');
    try {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
        return { FXRP: {}, FDOGE: {} };
    } catch (error) {
        logger.error('Error loading historical data:', error);
        return { FXRP: {}, FDOGE: {} };
    }
}

function saveHistoricalData(data) {
    const filePath = path.join(__dirname, '../data/historical-data.json');
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        logger.info('Historical data saved successfully');
    } catch (error) {
        logger.error('Error saving historical data:', error);
        throw error;
    }
}

async function getAssetPrices() {
    try {
        const provider = new ethers.providers.JsonRpcProvider('https://songbird-api.flare.network/ext/C/rpc');
        const ftsoContract = new ethers.Contract(FTSO_READER_ADDRESS, FTSO_ABI, provider);
        // Log the raw response to debug
        const response = await ftsoContract.getFtsoV2CurrentFeedValues();
        const [values, decimals, timestamp] = response;
        
        logger.info('FTSO Raw Response:', {
            values: values.map(v => v.toString()),
            decimals: decimals.map(d => d.toString()),
            timestamp: timestamp.toString()
        });
        
        if (!values || !values[0] || !decimals || !decimals[0]) {
            logger.warn('Invalid FTSO response, using fallback values');
            return {
                FXRP: 0,
                FDOGE: 0
            };
        }
        
        return {
            FXRP: values[0].toNumber() / Math.pow(10, decimals[0]),
            FDOGE: values[1] ? values[1].toNumber() / Math.pow(10, decimals[1]) : 0
        };
    } catch (error) {
        logger.error('Error fetching prices from FTSO:', { error: error.message });
        // Return default values instead of throwing
        return {
            FXRP: 0,
            FDOGE: 0
        };
    }
}

async function analyzeTransactions() {
    try {
        logger.info('Starting rewards analysis');
        
        // Calculate current period from current date
        const now = new Date();
        const timeSinceStart = now.getTime() - PERIOD_CONFIG.PROGRAM_START.getTime();
        const currentPeriod = Math.floor(timeSinceStart / PERIOD_CONFIG.PERIOD_LENGTH_MS) + 1;

        const currentPeriodInfo = {
            period: currentPeriod,
            periodStart: new Date(PERIOD_CONFIG.PROGRAM_START.getTime() + ((currentPeriod - 1) * PERIOD_CONFIG.PERIOD_LENGTH_MS)),
            periodEnd: new Date(PERIOD_CONFIG.PROGRAM_START.getTime() + (currentPeriod * PERIOD_CONFIG.PERIOD_LENGTH_MS))
        };

        logger.info(`Current period: ${currentPeriodInfo.period}`, {
            periodStart: currentPeriodInfo.periodStart.toISOString(),
            periodEnd: currentPeriodInfo.periodEnd.toISOString()
        });
        
        // Load historical data and get prices
        const historicalData = loadHistoricalData();
        const assetResults = {};
        const assetPrices = await getAssetPrices();

        for (const assetType of ['FXRP', 'FDOGE']) {
            try {
                logger.info(`Processing ${assetType} transactions`);
                let periodData = new Map();
                
                // Determine which periods need scanning
                const periodsToScan = new Set();

                // Check historical data for any missing previous periods
                for (let periodNum = 1; periodNum < currentPeriod; periodNum++) {
                    if (!historicalData[assetType]?.[periodNum]) {
                        periodsToScan.add(periodNum);
                    }
                }

                // Always scan current period
                periodsToScan.add(currentPeriod);
                
                const periodsArray = Array.from(periodsToScan).sort((a, b) => a - b);
                logger.info(`${assetType} periods to scan: ${periodsArray.join(', ')}`);

                // Scan each required period
                for (const periodNumber of periodsArray) {
                    const periodStart = new Date(PERIOD_CONFIG.PROGRAM_START.getTime() + 
                        ((periodNumber - 1) * PERIOD_CONFIG.PERIOD_LENGTH_MS));
                    const periodEnd = new Date(periodStart.getTime() + PERIOD_CONFIG.PERIOD_LENGTH_MS);
                    
                    let page = 1;
                    let hasMoreData = true;
                    
                    while (hasMoreData) {
                        const url = `${API_BASE}?module=account&action=txlist&address=${CONTRACTS[assetType]}&startblock=0&page=${page}&offset=100&sort=asc`;
                        logger.info(`Fetching ${assetType} period ${periodNumber} page ${page}...`);
                        
                        const response = await makeRequest(url);
                        
                        if (!response.result || response.result.length === 0) {
                            hasMoreData = false;
                            break;
                        }

                        for (const tx of response.result) {
                            const timestamp = parseInt(tx.timeStamp) * 1000;
                            
                            // Skip if transaction is outside our period
                            if (timestamp < periodStart.getTime() || timestamp >= periodEnd.getTime()) {
                                continue;
                            }
                            
                            if (tx.input.startsWith('0x99646d1c')) {
                                const lots = decodeRedeemLots(tx.input);
                                
                                if (!periodData.has(periodNumber)) {
                                    periodData.set(periodNumber, {
                                        period: periodNumber,
                                        redeemEvents: 0,
                                        totalLots: 0,
                                        transactions: [],
                                        periodStart: periodStart.toISOString(),
                                        periodEnd: periodEnd.toISOString(),
                                        completed: periodNumber < currentPeriod,
                                        completedAt: periodNumber < currentPeriod ? now.toISOString() : null
                                    });
                                }

                                const data = periodData.get(periodNumber);
                                data.redeemEvents++;
                                data.totalLots += lots;
                                data.transactions.push({
                                    hash: tx.hash,
                                    timestamp,
                                    lots,
                                    block: tx.blockNumber
                                });
                            }
                        }
                        
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        page++;
                    }
                }

                // Process period data and update historical data
                for (const [periodNumber, data] of periodData) {
                    if (data.completed) {
                        if (!historicalData[assetType]) {
                            historicalData[assetType] = {};
                        }
                        historicalData[assetType][periodNumber] = {
                            ...data,
                            rewardsPerLot: data.totalLots > 0 ? 
                                BIWEEKLY_REWARDS[assetType] / data.totalLots : 0
                        };
                    }
                }

                // Combine historical and current data
                const combinedPeriodData = {
                    ...historicalData[assetType],
                    ...Object.fromEntries(periodData)
                };

                // Calculate system metrics
                const totalLotsRedeemed = Object.values(combinedPeriodData)
                    .reduce((sum, period) => sum + period.totalLots, 0);
                const totalEvents = Object.values(combinedPeriodData)
                    .reduce((sum, period) => sum + period.redeemEvents, 0);

                assetResults[assetType] = {
                    lastUpdated: now.toISOString(),
                    systemMetrics: {
                        currentPeriod: currentPeriodInfo.period,
                        biweeklyReward: BIWEEKLY_REWARDS[assetType],
                        totalLotsRedeemed,
                        totalEvents,
                        price: assetPrices[assetType],
                        lotsThisPeriod: periodData.get(currentPeriod)?.totalLots || 0,
                        eventsThisPeriod: periodData.get(currentPeriod)?.redeemEvents || 0
                    },
                    periodData: combinedPeriodData
                };

                // Calculate period-specific metrics
                for (const periodNumber of periodsArray) {
                    const periodData = combinedPeriodData[periodNumber];
                    if (periodData) {
                        const rewardsPerLot = periodData.totalLots > 0 ? 
                            BIWEEKLY_REWARDS[assetType] / periodData.totalLots : 0;
                        periodData.rewardsPerLot = rewardsPerLot;
                        periodData.metrics = {
                            avgLotsPerDay: periodData.totalLots / 14,
                            rewardsPerLot
                        };
                    }
                }

            } catch (error) {
                logger.error(`Error processing ${assetType}:`, error);
                assetResults[assetType] = {
                    lastUpdated: now.toISOString(),
                    error: error.message
                };
            }
        }

        // Save completed periods to historical data
        saveHistoricalData(historicalData);

        // Save current results
        const OUTPUT_PATH = process.env.REWARDS_DATA_PATH || path.join(__dirname, '../data/rewards-data.json');
        const outputDir = path.dirname(OUTPUT_PATH);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        fs.writeFileSync(OUTPUT_PATH, JSON.stringify(assetResults, null, 2));
        
        // Log completion status
        logger.info('Analysis completed successfully', {
            FXRP: {
                totalLots: assetResults.FXRP?.systemMetrics?.totalLotsRedeemed || 0,
                totalEvents: assetResults.FXRP?.systemMetrics?.totalEvents || 0,
                currentPeriodLots: assetResults.FXRP?.systemMetrics?.lotsThisPeriod || 0
            },
            FDOGE: {
                totalLots: assetResults.FDOGE?.systemMetrics?.totalLotsRedeemed || 0,
                totalEvents: assetResults.FDOGE?.systemMetrics?.totalEvents || 0,
                currentPeriodLots: assetResults.FDOGE?.systemMetrics?.lotsThisPeriod || 0
            }
        });

        return assetResults;

    } catch (error) {
        logger.error('Error analyzing transactions:', { error: error.message });
        throw error;
    }
}

// Export functions for testing or external use
module.exports = {
    analyzeTransactions,
    getAssetPrices,
    calculateFeesPerLot,
    calculateProfitMetrics,
    formatDate,
    loadHistoricalData,
    saveHistoricalData,
    UNITS_PER_LOT,
    BIWEEKLY_REWARDS,
    CONTRACTS
};

// Run if called directly
if (require.main === module) {
    analyzeTransactions().catch(console.error);
}
