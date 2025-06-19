#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const toml = require('toml');
require('dotenv').config();
const { ethers } = require('ethers');

function loadContractAddresses() {
  const configPath = path.join(__dirname, 'mounts', 'system-client', 'config.toml');
  if (!fs.existsSync(configPath)) {
    throw new Error(`❌ Missing TOML config at: ${configPath}`);
  }

  const content = fs.readFileSync(configPath, 'utf8');
  const parsed = toml.parse(content);
  const addresses = parsed.contract_addresses || parsed.ContractAddresses;

  if (!addresses || !addresses.systems_manager || !addresses.voter_preregistry || !addresses.voter_registry) {
    throw new Error("❌ Required contract addresses not found in config.toml");
  }

  return {
    systemsManager: addresses.systems_manager,
    preregistry: addresses.voter_preregistry,
    registry: addresses.voter_registry
  };
}

(async () => {
  const { NODE_RPC_URL, SIGNING_PK, IDENTITY } = process.env;

  if (!NODE_RPC_URL || !SIGNING_PK || !IDENTITY) {
    console.error("❌ Missing required environment variables: NODE_RPC_URL, SIGNING_PK, or IDENTITY");
    process.exit(1);
  }

  const contractAddrs = loadContractAddresses();

  const provider = new ethers.providers.JsonRpcProvider(NODE_RPC_URL);
  const wallet = new ethers.Wallet(SIGNING_PK, provider);

  console.log("✅ Loaded wallet:", wallet.address);
  console.log("🔗 RPC:", NODE_RPC_URL);
  console.log("📄 Identity:", IDENTITY);

  // --- Contract ABIs ---
  const registryAbi = [
    "function register(uint256 rewardEpoch, address voter) public",
    "function preregister(uint256 rewardEpoch, address voter) public"
  ];

  // --- Instantiate contracts ---
  const preregistry = new ethers.Contract(contractAddrs.preregistry, registryAbi, wallet);
  const registry = new ethers.Contract(contractAddrs.registry, registryAbi, wallet);

  // --- Fetch current reward epoch ---
  const systemsManagerAbi = [
    "function getCurrentRewardEpochId() public view returns (uint256)"
  ];
  const systemsManager = new ethers.Contract(contractAddrs.systemsManager, systemsManagerAbi, provider);
  const currentEpoch = await systemsManager.getCurrentRewardEpochId();

  const nextEpoch = currentEpoch.add(1);
  console.log("📈 Current Epoch:", currentEpoch.toString());
  console.log("🕓 Attempting to preregister and register for Epoch:", nextEpoch.toString());

  try {
    const tx1 = await preregistry.preregister(nextEpoch, IDENTITY);
    console.log("⏳ Preregister tx sent:", tx1.hash);
    await tx1.wait();
    console.log("✅ Preregistered successfully");

    const tx2 = await registry.register(nextEpoch, IDENTITY);
    console.log("⏳ Register tx sent:", tx2.hash);
    await tx2.wait();
    console.log("✅ Registered successfully");
  } catch (err) {
    console.error("❌ Error during registration:", err.reason || err.message || err);
  }
})();
