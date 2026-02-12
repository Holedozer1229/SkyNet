const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

/**
 * Generate witness for Φ computation circuit
 * Pulls live data from Admin contract
 */
async function generatePhiWitness() {
  try {
    // Load deployment data
    const deploymentPath = path.join(__dirname, '../../deployed_admin.json');
    const deploymentData = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
    
    // Connect to contract
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'http://localhost:8545');
    const adminAbi = [
      "function getPhiDetails() view returns (uint256[] weights, uint256[] values, uint256[] eigenVectors, uint256 total)"
    ];
    
    const adminContract = new ethers.Contract(
      deploymentData.contracts.Admin.address,
      adminAbi,
      provider
    );
    
    // Fetch data
    const [weights, values, eigenVectors, total] = await adminContract.getPhiDetails();
    
    // Prepare witness input
    const witness = {
      weights: weights.map(w => w.toString()),
      values: values.map(v => v.toString()),
      eigenVectors: eigenVectors.map(e => e.toString())
    };
    
    // Save witness
    const outputPath = path.join(__dirname, '../witness/phi_input.json');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(witness, null, 2));
    
    console.log('✅ Φ witness generated successfully');
    console.log('Weights:', witness.weights);
    console.log('Values:', witness.values);
    console.log('EigenVectors:', witness.eigenVectors);
    console.log('Expected Φ total:', total.toString());
    
    return witness;
  } catch (error) {
    console.error('Error generating Φ witness:', error);
    throw error;
  }
}

/**
 * Generate witness for NFT rarity circuit
 */
async function generateNFTWitness(tokenId) {
  try {
    // Load deployment data
    const deploymentPath = path.join(__dirname, '../../deployed_admin.json');
    const deploymentData = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
    
    // Connect to contracts
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'http://localhost:8545');
    
    const nftAbi = [
      "function getMetadata(uint256) view returns (uint256 rarity, uint256 phiValue, uint256 mintTime, uint256 supply, uint256 demand, string rarityTier)"
    ];
    
    const nftContract = new ethers.Contract(
      deploymentData.contracts.SKYNTLaunchNFT.address,
      nftAbi,
      provider
    );
    
    // Fetch NFT data
    const [rarity, phiValue, , supply, demand] = await nftContract.getMetadata(tokenId);
    
    // Prepare witness input
    const witness = {
      demand: demand.toString(),
      phiValue: phiValue.toString(),
      supply: supply.toString()
    };
    
    // Save witness
    const outputPath = path.join(__dirname, `../witness/nft_${tokenId}_input.json`);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(witness, null, 2));
    
    console.log(`✅ NFT #${tokenId} witness generated successfully`);
    console.log('Demand:', witness.demand);
    console.log('Φ Value:', witness.phiValue);
    console.log('Supply:', witness.supply);
    console.log('Expected rarity:', rarity.toString());
    
    return witness;
  } catch (error) {
    console.error('Error generating NFT witness:', error);
    throw error;
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (command === 'phi') {
    generatePhiWitness()
      .then(() => process.exit(0))
      .catch((error) => {
        console.error(error);
        process.exit(1);
      });
  } else if (command === 'nft') {
    const tokenId = args[1];
    if (!tokenId) {
      console.error('Please provide token ID');
      process.exit(1);
    }
    
    generateNFTWitness(tokenId)
      .then(() => process.exit(0))
      .catch((error) => {
        console.error(error);
        process.exit(1);
      });
  } else {
    console.log('Usage:');
    console.log('  node generate_witness.js phi');
    console.log('  node generate_witness.js nft <tokenId>');
    process.exit(1);
  }
}

module.exports = {
  generatePhiWitness,
  generateNFTWitness
};
