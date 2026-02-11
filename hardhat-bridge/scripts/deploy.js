const hre = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying bridge with account:", deployer.address);
    console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

    // Deploy ECDSAVerifier first
    console.log("\nDeploying ECDSAVerifier...");
    const Verifier = await ethers.getContractFactory("ECDSAVerifier");
    const verifier = await Verifier.deploy();
    await verifier.waitForDeployment();
    const verifierAddress = await verifier.getAddress();
    console.log("ECDSAVerifier deployed to:", verifierAddress);

    // Deploy SkynetBridge
    console.log("\nDeploying SkynetBridge...");
    const Bridge = await ethers.getContractFactory("SkynetBridge");
    const bridge = await Bridge.deploy(verifierAddress);
    await bridge.waitForDeployment();
    const bridgeAddress = await bridge.getAddress();
    console.log("SkynetBridge deployed to:", bridgeAddress);

    console.log("\nDeployment complete!");
    console.log("Verifier:", verifierAddress);
    console.log("Bridge:", bridgeAddress);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
