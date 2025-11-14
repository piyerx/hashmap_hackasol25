const hre = require("hardhat");

async function main() {
  console.log("Deploying LandRegistry with Council Voting System...");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Define 5 council member addresses
  // For testing, we'll use the deployer address multiple times
  // In production, these should be 5 different trusted addresses
  const councilMembers = [
    deployer.address, // Council Member 1
    deployer.address, // Council Member 2 - Replace with actual addresses
    deployer.address, // Council Member 3 - Replace with actual addresses
    deployer.address, // Council Member 4 - Replace with actual addresses
    deployer.address  // Council Member 5 - Replace with actual addresses
  ];

  console.log("\nCouncil Members:");
  councilMembers.forEach((member, index) => {
    console.log(`  Member ${index + 1}: ${member}`);
  });

  // Deploy the contract
  const LandRegistry = await hre.ethers.getContractFactory("LandRegistry");
  const landRegistry = await LandRegistry.deploy(councilMembers);

  await landRegistry.waitForDeployment();
  const contractAddress = await landRegistry.getAddress();

  console.log("\n✅ LandRegistry deployed to:", contractAddress);
  console.log("Gram Sabha Admin:", deployer.address);
  console.log("Required Votes: 5");
  console.log("Council Size:", councilMembers.length);

  // Verify council was set up correctly
  const registeredCouncil = await landRegistry.getCouncilMembers();
  console.log("\nVerified Council Members on Contract:");
  registeredCouncil.forEach((member, index) => {
    console.log(`  ${index + 1}. ${member}`);
  });

  console.log("\n🎉 Deployment Complete!");
  console.log("\nNext Steps:");
  console.log("1. Update CONTRACT_ADDRESS in server/.env to:", contractAddress);
  console.log("2. Create 5 council member user accounts in the database");
  console.log("3. Map each council member's wallet address to their user account");
  console.log("4. Test the voting system with all 5 council members");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
