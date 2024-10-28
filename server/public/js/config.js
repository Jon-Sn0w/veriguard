const CHAIN_CONFIG = {
    'songbird': {
        contractAddress: process.env.SONGBIRD_CONTRACT_ADDRESS,
        rpcUrl: process.env.SONGBIRD_RPC_URL
    },
    'flare': {
        contractAddress: process.env.FLARE_CONTRACT_ADDRESS,
        rpcUrl: process.env.FLARE_RPC_URL
    }
};

export const getChainConfig = (chain) => {
    const chainKey = chain.toLowerCase();
    if (!CHAIN_CONFIG[chainKey]) {
        throw new Error(`Unsupported chain: ${chain}`);
    }
    return CHAIN_CONFIG[chainKey];
};
