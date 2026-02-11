const { ethers } = require("hardhat");

async function main() {
    // Replace with your deployed bridge address
    const bridgeAddr = process.env.BRIDGE_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    
    const [minter] = await ethers.getSigners();
    console.log("Minting with account:", minter.address);

    const Bridge = await ethers.getContractFactory("SkynetBridge");
    const bridge = Bridge.attach(bridgeAddr);

    // Create a dummy proof for demonstration
    const proof = ethers.hexlify(ethers.randomBytes(65));
    const solNonce = Math.floor(Math.random() * 1000000);

    console.log("\nMinting NFT from Solana PoW...");
    console.log("Solana nonce:", solNonce);
    console.log("Proof:", proof);

    const tx = await bridge.mintFromSolana(proof, solNonce);
    console.log("Transaction hash:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("Transaction confirmed in block:", receipt.blockNumber);
    
    const tokenId = await bridge.tokenId();
    console.log("Current token ID:", tokenId.toString());
    console.log("NFT minted successfully!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
