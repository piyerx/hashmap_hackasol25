const hre = require("hardhat");

async function main() {
  console.log("Deploying LandRegistry contract...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  const LandRegistry = await hre.ethers.getContractFactory("LandRegistry");
  const landRegistry = await LandRegistry.deploy();

  await landRegistry.waitForDeployment();

  const contractAddress = await landRegistry.getAddress();
  console.log("LandRegistry deployed to:", contractAddress);
  console.log("Gram Sabha address:", deployer.address);

  console.log("\nSave this information:");
  console.log("====================");
  console.log(`CONTRACT_ADDRESS=${contractAddress}`);
  console.log(`GRAM_SABHA_ADDRESS=${deployer.address}`);
  console.log("\nAdd the CONTRACT_ADDRESS to your server/.env file");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
