import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();
const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    arbitrumSepolia: {
      url: "https://sepolia-rollup.arbitrum.io/rpc", // Replace with the actual RPC URL for Arbitrum Sepolia
      chainId: 421614, // Replace with the actual chain ID for Arbitrum Sepolia
      accounts: [process.env.EVM_PRIVATE_KEY || ""], // Replace with your private key or use environment variables
    },
    lineaSepolia: {
      url: "https://rpc.sepolia.linea.build", // Replace with the actual RPC URL for Linea Sepolia
      chainId: 59141, // Replace with the actual chain ID for Linea Sepolia
      accounts: [process.env.EVM_PRIVATE_KEY || ""], // Replace with your private key or use environment variables
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }, gasReporter: {
    enabled: true,
    coinmarketcap: process.env.COIN_MARKET_CAP_API_KEY,
  },
};

export default config;
