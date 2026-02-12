const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Load deployment data
let deploymentData = null;
try {
  const deploymentPath = path.join(__dirname, '../../deployed_admin.json');
  deploymentData = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
} catch (error) {
  console.warn('⚠️  deployed_admin.json not found.');
}

// Initialize contracts
let provider, nftContract, adminContract;
if (deploymentData && process.env.RPC_URL) {
  provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  
  const nftAbi = [
    "function nextTokenId() view returns (uint256)",
    "function getMetadata(uint256) view returns (uint256 rarity, uint256 phiValue, uint256 mintTime, uint256 supply, uint256 demand, string rarityTier)",
    "function getRarityTier(uint256) view returns (string)",
    "function ownerOf(uint256) view returns (address)",
    "function totalSupply() view returns (uint256)"
  ];
  
  const adminAbi = [
    "function computePhi() view returns (uint256)"
  ];
  
  nftContract = new ethers.Contract(
    deploymentData.contracts.SKYNTLaunchNFT.address,
    nftAbi,
    provider
  );
  
  adminContract = new ethers.Contract(
    deploymentData.contracts.Admin.address,
    adminAbi,
    provider
  );
}

/**
 * Get all NFTs with metadata
 */
exports.getAllNFTs = async (req, res) => {
  try {
    if (!nftContract) {
      // Return mock data
      const mockNFTs = Array.from({ length: 10 }, (_, i) => ({
        tokenId: i,
        rarity: Math.floor(Math.random() * 100),
        phiValue: 1500,
        rarityTier: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'][Math.floor(Math.random() * 5)],
        owner: '0x' + '0'.repeat(40),
        mintTime: Date.now() - Math.floor(Math.random() * 86400000)
      }));
      
      return res.json({
        nfts: mockNFTs,
        total: mockNFTs.length,
        source: 'mock'
      });
    }

    const totalSupply = await nftContract.totalSupply();
    const nfts = [];
    
    for (let i = 0; i < totalSupply && i < 100; i++) {
      try {
        const [rarity, phiValue, mintTime, supply, demand, rarityTier] = await nftContract.getMetadata(i);
        const owner = await nftContract.ownerOf(i);
        
        nfts.push({
          tokenId: i,
          rarity: rarity.toString(),
          phiValue: phiValue.toString(),
          mintTime: mintTime.toString(),
          supply: supply.toString(),
          demand: demand.toString(),
          rarityTier,
          owner
        });
      } catch (err) {
        console.error(`Error fetching NFT ${i}:`, err.message);
      }
    }

    res.json({
      nfts,
      total: totalSupply.toString(),
      source: 'contract'
    });
  } catch (error) {
    console.error('Error getting NFTs:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get single NFT metadata
 */
exports.getNFT = async (req, res) => {
  try {
    const { tokenId } = req.params;
    
    if (!nftContract) {
      // Return mock data
      return res.json({
        tokenId,
        rarity: Math.floor(Math.random() * 100),
        phiValue: 1500,
        rarityTier: 'Rare',
        owner: '0x' + '0'.repeat(40),
        mintTime: Date.now(),
        source: 'mock'
      });
    }

    const [rarity, phiValue, mintTime, supply, demand, rarityTier] = await nftContract.getMetadata(tokenId);
    const owner = await nftContract.ownerOf(tokenId);

    res.json({
      tokenId,
      rarity: rarity.toString(),
      phiValue: phiValue.toString(),
      mintTime: mintTime.toString(),
      supply: supply.toString(),
      demand: demand.toString(),
      rarityTier,
      owner,
      source: 'contract'
    });
  } catch (error) {
    console.error('Error getting NFT:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Calculate NFT rarity score
 * Formula: R_i = f(supply, demand, Φ_i)
 */
exports.getRarity = async (req, res) => {
  try {
    const { tokenId } = req.params;
    
    if (!nftContract || !adminContract) {
      // Return mock data
      return res.json({
        tokenId,
        rarityScore: Math.floor(Math.random() * 100),
        formula: 'R_i = (demand * Φ_i) / (supply + 1)',
        source: 'mock'
      });
    }

    const [rarity, phiValue, , supply, demand] = await nftContract.getMetadata(tokenId);
    
    // Calculate using formula: R_i = (demand * Φ_i) / (supply + 1)
    const rarityScore = (Number(demand) * Number(phiValue)) / (Number(supply) + 1);

    res.json({
      tokenId,
      rarityScore: Math.floor(rarityScore / 100),
      rarity: rarity.toString(),
      phiValue: phiValue.toString(),
      supply: supply.toString(),
      demand: demand.toString(),
      formula: 'R_i = (demand * Φ_i) / (supply + 1)',
      source: 'contract'
    });
  } catch (error) {
    console.error('Error calculating rarity:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get rarity distribution analytics
 */
exports.getRarityDistribution = async (req, res) => {
  try {
    if (!nftContract) {
      // Return mock data
      return res.json({
        distribution: {
          Common: 45,
          Uncommon: 30,
          Rare: 15,
          Epic: 8,
          Legendary: 2
        },
        total: 100,
        source: 'mock'
      });
    }

    const totalSupply = await nftContract.totalSupply();
    const distribution = {
      Common: 0,
      Uncommon: 0,
      Rare: 0,
      Epic: 0,
      Legendary: 0
    };

    for (let i = 0; i < totalSupply && i < 1000; i++) {
      try {
        const rarityTier = await nftContract.getRarityTier(i);
        distribution[rarityTier] = (distribution[rarityTier] || 0) + 1;
      } catch (err) {
        console.error(`Error fetching rarity for NFT ${i}:`, err.message);
      }
    }

    res.json({
      distribution,
      total: totalSupply.toString(),
      source: 'contract'
    });
  } catch (error) {
    console.error('Error getting rarity distribution:', error);
    res.status(500).json({ error: error.message });
  }
};
