const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting StarLord2 × SKYNT LaunchNFT ecosystem deployment...\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString(), "\n");

  // Deploy Admin contract
  console.log("Deploying Admin contract...");
  const Admin = await hre.ethers.getContractFactory("Admin");
  const admin = await Admin.deploy();
  await admin.waitForDeployment();
  const adminAddress = await admin.getAddress();
  console.log("✅ Admin deployed to:", adminAddress);

  // Verify initialization
  const initialized = await admin.initialized();
  console.log("Admin initialized:", initialized);
  
  const phi = await admin.computePhi();
  console.log("Initial Φ value:", phi.toString(), "\n");

  // Deploy StarLord2 contract
  console.log("Deploying StarLord2 contract...");
  const StarLord2 = await hre.ethers.getContractFactory("StarLord2");
  const starLord2 = await StarLord2.deploy(adminAddress);
  await starLord2.waitForDeployment();
  const starLord2Address = await starLord2.getAddress();
  console.log("✅ StarLord2 deployed to:", starLord2Address, "\n");

  // Deploy SKYNTLaunchNFT contract
  console.log("Deploying SKYNTLaunchNFT contract...");
  const SKYNTLaunchNFT = await hre.ethers.getContractFactory("SKYNTLaunchNFT");
  const nft = await SKYNTLaunchNFT.deploy(adminAddress);
  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();
  console.log("✅ SKYNTLaunchNFT deployed to:", nftAddress, "\n");

  // Save deployment addresses
  const deploymentData = {
    network: hre.network.name,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      Admin: {
        address: adminAddress,
        phiValue: phi.toString(),
        initialized: initialized
      },
      StarLord2: {
        address: starLord2Address
      },
      SKYNTLaunchNFT: {
        address: nftAddress,
        mintPrice: (await nft.mintPrice()).toString()
      }
    }
  };

  // Write to deployed_admin.json
  const outputPath = path.join(__dirname, "..", "deployed_admin.json");
  fs.writeFileSync(outputPath, JSON.stringify(deploymentData, null, 2));
  console.log("✅ Deployment data saved to deployed_admin.json\n");

  // Display summary
  console.log("═══════════════════════════════════════════════════════");
  console.log("DEPLOYMENT SUMMARY");
  console.log("═══════════════════════════════════════════════════════");
  console.log("Network:           ", hre.network.name);
  console.log("Admin:             ", adminAddress);
  console.log("StarLord2:         ", starLord2Address);
  console.log("SKYNTLaunchNFT:    ", nftAddress);
  console.log("═══════════════════════════════════════════════════════\n");

  console.log("✅ All contracts deployed successfully!");
  console.log("\nNext steps:");
  console.log("1. Update frontend .env with contract addresses");
  console.log("2. Update backend .env with contract addresses");
  console.log("3. Run backend: npm start");
  console.log("4. Run frontend: npm run dev");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
