// Constants for DOM insertion
const SCRIPT_ROOT = document.currentScript.parentElement;
const ROOT_ELEMENT = document.getElementById('root');

// Constants
const PROGRAM_START = new Date('2024-12-18T13:00:00.000Z');
const BIWEEKLY_PERIOD_MS = 14 * 24 * 60 * 60 * 1000;
const BIWEEKLY_REWARDS = {
    FXRP: 14857,
    FDOGE: 14857
};
const XRP_PER_LOT = 100;
const DOGE_PER_LOT = 200;
const REDEEM_FEE_PERCENTAGE = 0.5;
const API_ENDPOINTS = {
    FXRP: 'https://fasset.oracle-daemon.com/minting/sgb/backend/api/pools?fasset%5B0%5D=FXRP',
    FDOGE: 'https://fasset.oracle-daemon.com/minting/sgb/backend/api/pools?fasset%5B0%5D=FDOGE'
};

// FTSO Configuration
const FTSO_READER_ADDRESS = '0x78f2D93a84635a0B42756e2bbf7779cf227A0a23'; // Updated address
const FTSO_ABI = [
    {
        "inputs": [],
        "name": "getFtsoV2CurrentFeedValues",
        "outputs": [
            {"internalType": "uint256[]", "name": "_feedValues", "type": "uint256[]"},
            {"internalType": "int8[]", "name": "_decimals", "type": "int8[]"},
            {"internalType": "uint64", "name": "_timestamp", "type": "uint64"}
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// Utility functions
const formatNumber = (num) => num != null ? num.toLocaleString() : '0';
const formatUSD = (num) => `$${Number(num || 0).toFixed(2)}`;
const formatAsset = (num, assetType) => `${Number(num || 0).toFixed(2)} ${assetType.slice(1)}`;
const formatPercentage = (num) => `${Number(num || 0).toFixed(2)}%`;

const calculatePeriodDates = (periodNumber) => {
    const periodStart = new Date(PROGRAM_START.getTime() + (periodNumber * BIWEEKLY_PERIOD_MS));
    const periodEnd = new Date(periodStart.getTime() + BIWEEKLY_PERIOD_MS);
    return { periodStart, periodEnd };
};

// Calculate P/L metrics for different fee structures
const calculatePeriodMetrics = (periodLots, price, assetType) => {
    const lotsPerUnit = assetType === 'FXRP' ? XRP_PER_LOT : DOGE_PER_LOT;
    const lotValueUSD = lotsPerUnit * price;
    const redeemFeeUSD = lotValueUSD * (REDEEM_FEE_PERCENTAGE / 100);
    
    // 2% fee structure
    const mintFeeLowUSD = lotValueUSD * (2 / 100);
    const totalFeeLow = mintFeeLowUSD + redeemFeeUSD;
    
    // 5% fee structure
    const mintFeeHighUSD = lotValueUSD * (5 / 100);
    const totalFeeHigh = mintFeeHighUSD + redeemFeeUSD;
    
    // Calculate rewards and P/L
    const rewardsPerLot = periodLots > 0 ? BIWEEKLY_REWARDS[assetType] / periodLots : 0;
    
    return {
        lowFee: {
            mintFee: mintFeeLowUSD,
            redeemFee: redeemFeeUSD,
            totalFee: totalFeeLow,
            rewardsPerLot: rewardsPerLot,
            netProfitPerLot: rewardsPerLot - totalFeeLow,
            breakevenLots: Math.floor(BIWEEKLY_REWARDS[assetType] / totalFeeLow)
        },
        highFee: {
            mintFee: mintFeeHighUSD,
            redeemFee: redeemFeeUSD,
            totalFee: totalFeeHigh,
            rewardsPerLot: rewardsPerLot,
            netProfitPerLot: rewardsPerLot - totalFeeHigh,
            breakevenLots: Math.floor(BIWEEKLY_REWARDS[assetType] / totalFeeHigh)
        }
    };
};

// Get asset prices from FTSO
async function getAssetPrices() {
    const provider = new ethers.providers.JsonRpcProvider('https://songbird-api.flare.network/ext/C/rpc');
    const ftsoContract = new ethers.Contract(FTSO_READER_ADDRESS, FTSO_ABI, provider);
    
    try {
        const [values, decimals] = await ftsoContract.callStatic.getFtsoV2CurrentFeedValues();

        return {
            FXRP: values[0] ? values[0].toNumber() / Math.pow(10, decimals[0]) : 0,
            FDOGE: values[1] ? values[1].toNumber() / Math.pow(10, decimals[1]) : 0
        };
    } catch (error) {
        console.error('Error fetching FTSO prices:', error);
        return {
            FXRP: 0,
            FDOGE: 0
        };
    }
}

// CollateralBar Component
function CollateralBar({ 
    label,
    symbol,
    currentCR,
    liquidationCR,
    minimumCR,
    safetyCR,
    mintingCR,
    topupCR,
    exitCR
}) {
    const calculatePercentage = () => {
        const minValue = liquidationCR || (symbol === 'SGB' ? 1.4 : 1.1);
        const maxValue = 2.5; // Fixed maximum value
        const clampedCR = Math.min(Math.max(currentCR || 0, minValue), maxValue);
        return ((clampedCR - minValue) / (maxValue - minValue)) * 100;
    };
    const percentage = calculatePercentage();
    
    const getHealthColor = () => {
        if (!currentCR || currentCR < minimumCR) return 'text-red-500';
        if (currentCR < safetyCR) return 'text-yellow-500';
        return 'text-green-500';
    };
    const thresholds = [
        { value: liquidationCR, label: 'Liquidation', color: 'border-red-500' },
        { value: minimumCR, label: 'Minimum', color: 'border-orange-500' },
        { value: safetyCR, label: 'Safety', color: 'border-yellow-500' },
        topupCR && { value: topupCR, label: 'Top-up', color: 'border-lime-500' },
        { value: mintingCR, label: 'Minting', color: 'border-green-500' },
        exitCR && { value: exitCR, label: 'Exit', color: 'border-emerald-500' }
    ].filter(Boolean);
    return React.createElement('div', { className: 'space-y-2' }, [
        React.createElement('div', { className: 'flex justify-between items-center' },
            React.createElement('div', { className: 'flex items-center gap-2' },
                React.createElement('span', { className: 'text-sm text-gray-400' }, label),
                React.createElement('span', { className: 'text-xs bg-gray-700 px-2 py-0.5 rounded' }, symbol)
            ),
            React.createElement('span', { className: `font-medium ${getHealthColor()}` },
                `${(currentCR || 0).toFixed(2)}x CR`
            )
        ),
        React.createElement('div', { className: 'relative h-3 rounded-full overflow-hidden bg-gray-900' }, [
            React.createElement('div', { 
                className: 'absolute inset-0 w-full h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500' 
            }),
            React.createElement('div', {
                className: 'absolute top-0 w-1 h-full bg-white shadow-lg',
                style: { left: `${percentage}%` }
            }),
            // Add right-side indicator for SGB when CR > 2.5
            symbol === 'SGB' && currentCR > 2.5 && React.createElement('div', {
                className: 'absolute top-0 w-1 h-full bg-white shadow-lg',
                style: { right: '0%' }
            })
        ]),
        React.createElement('div', { className: 'relative h-8 mt-1' },
            thresholds.map((threshold, index) => {
                if (!threshold?.value) return null;
                const markerLeft = ((threshold.value - (liquidationCR || (symbol === 'SGB' ? 1.4 : 1.1))) / 
                    (2.5 - (liquidationCR || (symbol === 'SGB' ? 1.4 : 1.1)))) * 100;
                
                return React.createElement('div', {
                    key: index,
                    className: 'absolute',
                    style: { left: `${Math.min(Math.max(markerLeft, 0), 100)}%` }
                }, [
                    React.createElement('div', { className: `h-2 border-l ${threshold.color}` }),
                    React.createElement('div', { className: 'text-xs text-gray-400 -ml-4 mt-1' },
                        threshold.value.toFixed(2)
                    )
                ]);
            })
        )
    ]);
}

// CollateralHealthBar Component
function CollateralHealthBar({ 
    poolCR = 0,
    vaultCR = 0,
    poolCCBCR = 0,
    vaultCCBCR = 0,
    poolMinCR = 0,
    vaultMinCR = 0,
    poolSafetyCR = 0,
    vaultSafetyCR = 0,
    mintingPoolCR = 0,
    mintingVaultCR = 0,
    poolTopupCR = 0,
    poolExitCR = 0
}) {
    return React.createElement('div', { className: 'space-y-4' },
        React.createElement(CollateralBar, {
            label: 'Pool Collateral',
            symbol: 'SGB',
            currentCR: poolCR,
            liquidationCR: poolCCBCR,
            minimumCR: poolMinCR,
            safetyCR: poolSafetyCR,
            mintingCR: mintingPoolCR,
            topupCR: poolTopupCR,
            exitCR: poolExitCR
        }),
        React.createElement(CollateralBar, {
            label: 'Vault Collateral',
            symbol: 'USDX',
            currentCR: vaultCR,
            liquidationCR: vaultCCBCR,
            minimumCR: vaultMinCR,
            safetyCR: vaultSafetyCR,
            mintingCR: mintingVaultCR
        })
    );
}

// MetricCard Component for consistent metric display
function MetricCard({ title, value, subtitle, subtitleColor = 'text-blue-500' }) {
    return React.createElement('div', {
        className: 'bg-gray-800 rounded-lg p-6'
    }, [
        React.createElement('h3', {
            className: 'text-gray-400 text-sm'
        }, title),
        React.createElement('div', {
            className: 'text-2xl font-bold mt-1'
        }, value),
        React.createElement('div', {
            className: `text-sm ${subtitleColor} mt-1`
        }, subtitle)
    ]);
}

// AgentCard Component
function AgentCard({ agent, assetType, price, currentPeriodLots }) {
    // Helper function to clean numeric strings
    const parseNumericString = (str) => {
        if (typeof str === 'string') {
            return Number(str.replace(/,/g, ''));
        }
        return Number(str || 0);
    };
    const lotsPerUnit = assetType === 'FXRP' ? XRP_PER_LOT : DOGE_PER_LOT;
    
    const fees = {
        usd: {
            mintFee: lotsPerUnit * price * (parseNumericString(agent.mintFee) / 100),
            redeemFee: lotsPerUnit * price * (REDEEM_FEE_PERCENTAGE / 100)
        }
    };
    
    fees.usd.totalFee = fees.usd.mintFee + fees.usd.redeemFee;
    fees.asset = {
        mintFee: fees.usd.mintFee / price,
        redeemFee: fees.usd.redeemFee / price,
        totalFee: fees.usd.totalFee / price
    };
    // Calculate standard metrics
    const rewardsPerLot = currentPeriodLots > 0 ? BIWEEKLY_REWARDS[assetType] / currentPeriodLots : 0;
    const netProfitPerLot = rewardsPerLot - fees.usd.totalFee;
    const metrics = {
        rewardsPerLot,
        netProfitPerLot,
        breakevenLots: Math.floor(BIWEEKLY_REWARDS[assetType] / fees.usd.totalFee),
        isProfitable: netProfitPerLot > 0,
        roi: fees.usd.totalFee > 0 ? (netProfitPerLot / fees.usd.totalFee) * 100 : 0
    };
    // Calculate comparison metrics
    const comparisonMetrics = calculatePeriodMetrics(currentPeriodLots, price, assetType);
    return React.createElement('div', { className: 'bg-gray-800 rounded-lg p-4' }, [
        // Agent Header
        React.createElement('div', { className: 'flex items-center gap-2 mb-3' }, [
            agent.url && React.createElement('img', {
                src: agent.url,
                alt: agent.agentName || agent.name,
                className: 'w-6 h-6 rounded-full',
                onError: (e) => e.target.style.display = 'none'
            }),
            React.createElement('span', { className: 'font-semibold' }, 
                agent.agentName || agent.name
            ),
            React.createElement('span', { 
                className: `ml-auto ${agent.status ? 'text-green-500' : 'text-red-500'}` 
            }, agent.status ? '●' : '○')
        ]),
        
        // Collateral Health Bar
        React.createElement('div', { className: 'mb-3 pb-3 border-b border-gray-600' },
            React.createElement(CollateralHealthBar, {
                poolCR: Number(agent.poolCR),
                vaultCR: Number(agent.vaultCR),
                poolCCBCR: Number(agent.poolCCBCR),
                vaultCCBCR: Number(agent.vaultCCBCR),
                poolMinCR: Number(agent.poolMinCR),
                vaultMinCR: Number(agent.vaultMinCR),
                poolSafetyCR: Number(agent.poolSafetyCR),
                vaultSafetyCR: Number(agent.vaultSafetyCR),
                mintingPoolCR: Number(agent.mintingPoolCR),
                mintingVaultCR: Number(agent.mintingVaultCR),
                poolTopupCR: Number(agent.poolTopupCR),
                poolExitCR: Number(agent.poolExitCR)
            })
        ),
        // Fee Information
        React.createElement('div', { className: 'space-y-2 mb-3 pb-3 border-b border-gray-600' }, [
            React.createElement('div', { className: 'flex justify-between' },
                React.createElement('span', {}, `Current Mint Fee (${agent.mintFee}%):`),
                React.createElement('span', { className: 'text-right' }, [
                    React.createElement('div', {}, formatUSD(fees.usd.mintFee)),
                    React.createElement('div', { className: 'text-sm text-gray-400' }, 
                        formatAsset(fees.asset.mintFee, assetType)
                    )
                ])
            ),
            React.createElement('div', { className: 'flex justify-between' },
                React.createElement('span', {}, `Redeem Fee (${REDEEM_FEE_PERCENTAGE}%):`),
                React.createElement('span', { className: 'text-right' }, [
                    React.createElement('div', {}, formatUSD(fees.usd.redeemFee)),
                    React.createElement('div', { className: 'text-sm text-gray-400' }, 
                        formatAsset(fees.asset.redeemFee, assetType)
                    )
                ])
            ),
            React.createElement('div', { className: 'flex justify-between font-semibold' },
                React.createElement('span', {}, 'Total Fee:'),
                React.createElement('span', { className: 'text-right' }, [
                    React.createElement('div', {}, formatUSD(fees.usd.totalFee)),
                    React.createElement('div', { className: 'text-sm text-gray-400' }, 
                        formatAsset(fees.asset.totalFee, assetType)
                    )
                ])
            )
        ]),
        // Profitability Metrics
        React.createElement('div', { className: 'space-y-2 mb-3 pb-3 border-b border-gray-600' }, [
            React.createElement('div', { className: 'flex justify-between' },
                React.createElement('span', {}, 'Rewards/Lot:'),
                React.createElement('span', { className: 'text-right' },
                    React.createElement('div', {}, formatUSD(metrics.rewardsPerLot))
                )
            ),
            React.createElement('div', { className: 'flex justify-between' },
                React.createElement('span', {}, `Current Fee (${agent.mintFee}%) P/L:`),
                React.createElement('span', { 
                    className: `text-right ${metrics.isProfitable ? 'text-green-500' : 'text-red-500'}` 
                }, formatUSD(metrics.netProfitPerLot))
            ),
            React.createElement('div', { className: 'flex justify-between' },
                React.createElement('span', {}, 'ROI:'),
                React.createElement('span', { 
                    className: `text-right ${metrics.roi >= 0 ? 'text-green-500' : 'text-red-500'}` 
                }, formatPercentage(metrics.roi))
            ),
            React.createElement('div', { className: 'flex justify-between' },
                React.createElement('span', {}, 'Breakeven Lots:'),
                React.createElement('span', { className: 'text-right' }, 
                    formatNumber(metrics.breakevenLots)
                )
            )
        ]),
        // Agent Stats
        React.createElement('div', { className: 'grid grid-cols-2 gap-2 text-sm' }, [
            React.createElement('div', {}, `Mint Count: ${formatNumber(agent.mintCount)}`),
            React.createElement('div', {}, `Redeem Rate: ${parseNumericString(agent.redeemRate)}%`),
            React.createElement('div', {}, `All Lots: ${formatNumber(agent.allLots)}`),
            React.createElement('div', {}, `Free Lots: ${formatNumber(agent.freeLots)}`),
            React.createElement('div', {}, `Minted USD: ${formatUSD(parseNumericString(agent.mintedUSD))}`),
            React.createElement('div', {}, `Collateral: ${formatUSD(parseNumericString(agent.poolCollateralUSD))}`),
            React.createElement('div', {}, `Pool CR: ${parseNumericString(agent.poolCR)}x`),
            React.createElement('div', {}, `Vault CR: ${parseNumericString(agent.vaultCR)}x`)
        ])
    ]);
}

// Main Dashboard Component
const RewardsDashboard = (() => {
    const data = {
        FXRP: { agents: [] },
        FDOGE: { agents: [] }
    };
    let loading = true;
    let error = null;
    let lastUpdated = new Date();
    let currentAsset = 'FXRP';
    let prices = {
        FXRP: null,
        FDOGE: null
    };

    async function fetchData() {
        try {
            loading = true;
            // First fetch FXRP data and prices
            const [fxrpResponse, assetPrices] = await Promise.all([
                fetch(API_ENDPOINTS.FXRP),
                getAssetPrices()
            ]);
            
            // Then attempt to fetch FDOGE data if available
            let fdogeResponse;
            try {
                fdogeResponse = await fetch(API_ENDPOINTS.FDOGE);
            } catch (error) {
                console.warn('FDOGE data not yet available:', error);
                fdogeResponse = { ok: true, json: async () => [] };
            }

            if (!fxrpResponse.ok || !fdogeResponse.ok) {
                throw new Error('Failed to fetch agent data');
            }

            const fxrpData = await fxrpResponse.json();
            const fdogeData = await fdogeResponse.json();

            prices = assetPrices;
            data.FXRP.agents = Array.isArray(fxrpData) ? fxrpData : [];
            data.FDOGE.agents = Array.isArray(fdogeData) ? fdogeData : [];
            
            lastUpdated = new Date();
            error = null;
            renderDashboard();
        } catch (err) {
            console.error('Error fetching data:', err);
            error = err.message;
        } finally {
            loading = false;
            renderDashboard();
        }
    }

    function renderDashboard() {
        if (!ROOT_ELEMENT) return;

        if (loading) {
            return ReactDOM.render(
                React.createElement('div', { 
                    className: 'flex items-center justify-center min-h-screen' 
                }, React.createElement('div', { 
                    className: 'text-xl text-gray-400' 
                }, 'Loading agent data...')),
                ROOT_ELEMENT
            );
        }

        if (error) {
            return ReactDOM.render(
                React.createElement('div', { 
                    className: 'flex items-center justify-center min-h-screen' 
                }, React.createElement('div', { 
                    className: 'bg-red-900 text-white p-6 rounded-lg max-w-2xl mx-auto' 
                }, [
                    React.createElement('h2', { 
                        className: 'text-xl font-bold mb-2'
                    }, 'Error Loading Data'),
                    React.createElement('p', {}, error)
                ])),
                ROOT_ELEMENT
            );
        }

        const activeAgents = data[currentAsset].agents.filter(agent => agent.status);
        const systemMetrics = {
            totalMintedUSD: activeAgents.reduce((sum, agent) => 
                sum + Number(String(agent.mintedUSD).replace(/,/g, '') || 0), 0),
            totalMintCount: activeAgents.reduce((sum, agent) => 
                sum + Number(agent.mintCount || 0), 0),
            currentPeriodLots: activeAgents.reduce((sum, agent) => 
                sum + Number(agent.allLots || 0), 0),
            totalCollateral: activeAgents.reduce((sum, agent) => 
                sum + Number(String(agent.poolCollateralUSD).replace(/,/g, '') || 0), 0),
            activeAgentCount: activeAgents.length,
            price: prices[currentAsset]
        };

        ReactDOM.render(
            React.createElement('div', { className: 'min-h-screen bg-animated-gradient' }, [
                // Navigation Bar
                React.createElement('nav', { 
                    className: 'bg-gray-800 p-4 shadow-md'
                }, React.createElement('div', { 
                    className: 'container mx-auto flex justify-between items-center' 
                }, [
                    // Asset Selection
                    React.createElement('div', { 
                        className: 'flex space-x-4' 
                    }, [
                        React.createElement('button', {
                            className: `px-4 py-2 rounded ${currentAsset === 'FXRP' ? 'bg-blue-600' : 'bg-gray-700'}`,
                            onClick: () => {
                                currentAsset = 'FXRP';
                                renderDashboard();
                            }
                        }, 'FXRP'),
                        React.createElement('button', {
                            className: `px-4 py-2 rounded ${currentAsset === 'FDOGE' ? 'bg-blue-600' : 'bg-gray-700'}`,
                            onClick: () => {
                                currentAsset = 'FDOGE';
                                renderDashboard();
                            }
                        }, 'FDOGE')
                    ]),
                    
                    // Menu Dropdown
                    React.createElement('div', { 
                        className: 'relative' 
                    }, [
                        React.createElement('button', {
                            className: 'bg-gray-700 text-white font-bold py-2 px-4 rounded inline-flex items-center',
                            onClick: () => {
                                const menu = document.querySelector('.dropdown-menu');
                                if (menu) menu.classList.toggle('hidden');
                            }
                        }, [
                            React.createElement('span', {}, 'Menu'),
                            React.createElement('svg', {
                                className: 'fill-current h-4 w-4 ml-2',
                                viewBox: '0 0 20 20'
                            },
                                React.createElement('path', {
                                    d: 'M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z'
                                })
                            )
                        ]),
                        React.createElement('ul', { 
                            className: 'dropdown-menu absolute hidden right-0 w-48 py-2 mt-2 bg-white rounded-lg shadow-xl text-gray-700'
                        }, [
                            React.createElement('li', {}, 
                                React.createElement('a', { 
                                    className: 'block px-4 py-2 hover:bg-gray-100', 
                                    href: '/' 
                                }, 'Home')
                            ),
                            React.createElement('li', {}, 
                                React.createElement('a', { 
                                    className: 'block px-4 py-2 hover:bg-gray-100', 
                                    href: '/addnft' 
                                }, 'Add NFT')
                            ),
                            React.createElement('li', {}, 
                                React.createElement('a', { 
                                    className: 'block px-4 py-2 hover:bg-gray-100', 
                                    href: '/removenft' 
                                }, 'Remove NFT')
                            ),
                            React.createElement('li', {}, 
                                React.createElement('a', { 
                                    className: 'block px-4 py-2 hover:bg-gray-100', 
                                    href: '/registerrole' 
                                }, 'Role Registry By Count')
                            ),
                            React.createElement('li', {}, 
                                React.createElement('a', { 
                                    className: 'block px-4 py-2 hover:bg-gray-100', 
                                    href: '/registervaluerole' 
                                }, 'Value Based Role Registry')
                            ),
                            React.createElement('li', {}, 
                                React.createElement('a', { 
                                    className: 'block px-4 py-2 hover:bg-gray-100 text-blue-600', 
                                    href: 'https://discord.com/oauth2/authorize?client_id=1211054291486253116',
                                    target: '_blank'
                                }, 'Add Bot to Discord')
                            )
                        ])
                    ])
                ])),
                // Main Content
                React.createElement('div', { 
                    className: 'container mx-auto px-4 py-8 max-w-6xl' 
                }, [
                    // System Metrics Grid
                    React.createElement('div', {
                        className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'
                    }, [
                        React.createElement(MetricCard, {
                            title: 'Total Value Locked',
                            value: formatUSD(systemMetrics.totalCollateral),
                            subtitle: `${formatNumber(systemMetrics.activeAgentCount)} Active Agents`,
                            subtitleColor: 'text-green-500'
                        }),
                        React.createElement(MetricCard, {
                            title: 'Total Minted Value',
                            value: formatUSD(systemMetrics.totalMintedUSD),
                            subtitle: `${formatNumber(systemMetrics.totalMintCount)} Mints`
                        }),
                        React.createElement(MetricCard, {
                            title: 'Current Period Lots',
                            value: formatNumber(systemMetrics.currentPeriodLots),
                            subtitle: `${formatUSD(BIWEEKLY_REWARDS[currentAsset])} Biweekly Rewards`,
                            subtitleColor: 'text-yellow-500'
                        }),
                        React.createElement(MetricCard, {
                            title: `Current ${currentAsset.slice(1)} Price`,
                            value: formatUSD(systemMetrics.price),
                            subtitle: 'Live FTSO Feed'
                        })
                    ]),
                    
                    // Agent Cards Grid
                    React.createElement('div', {
                        className: 'bg-gray-800 rounded-lg p-6'
                    }, [
                        React.createElement('h2', {
                            className: 'text-xl font-bold mb-4'
                        }, `Active Agents (${systemMetrics.activeAgentCount})`),
                        React.createElement('div', {
                            className: 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'
                        }, activeAgents.map((agent, index) => 
                            React.createElement(AgentCard, {
                                key: agent.vault || index,
                                agent,
                                assetType: currentAsset,
                                price: systemMetrics.price,
                                currentPeriodLots: systemMetrics.currentPeriodLots
                            })
                        ))
                    ])
                ])
            ]),
            ROOT_ELEMENT
        );
    }

    // Initial setup
    fetchData();
    setInterval(fetchData, 60000);

    return {
        refresh: fetchData
    };
})();

// Add global refresh function
window.refreshDashboard = RewardsDashboard.refresh;
