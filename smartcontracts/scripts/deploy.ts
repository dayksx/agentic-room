import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy WagmiToken
  const WagmiToken = await ethers.getContractFactory("WagmiToken");
  const wagmiToken = await WagmiToken.deploy(deployer.address);
  console.log("WagmiToken deployed to:", await wagmiToken.getAddress());

  // Deploy BuilderBadgeToken
  const BuilderBadgeToken = await ethers.getContractFactory("BuilderBadgeToken");
  const builderBadgeToken = await BuilderBadgeToken.deploy(await wagmiToken.getAddress(), deployer.address);
  console.log("BuilderBadgeToken deployed to:", await builderBadgeToken.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });