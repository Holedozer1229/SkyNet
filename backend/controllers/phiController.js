const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Load deployment data
let deploymentData = null;
try {
  const deploymentPath = path.join(__dirname, '../../deployed_admin.json');
  deploymentData = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
} catch (error) {
  console.warn('⚠️  deployed_admin.json not found. Deploy contracts first.');
}

// Initialize provider and contract
let provider, adminContract;
if (deploymentData && process.env.RPC_URL) {
  provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  
  const adminAbi = [
    "function computePhi() view returns (uint256)",
    "function getPhiDetails() view returns (uint256[] weights, uint256[] values, uint256[] eigenVectors, uint256 total)",
    "function phiParameterCount() view returns (uint256)",
    "function phiParameters(uint256) view returns (uint256 weight, uint256 value, uint256 eigenVector)"
  ];
  
  adminContract = new ethers.Contract(
    deploymentData.contracts.Admin.address,
    adminAbi,
    provider
  );
}

// In-memory phi history
const phiHistory = [];

/**
 * Compute current Φ value
 * Formula: Φ_total = Σ_i (w_i * φ_i) / N
 */
exports.computePhi = async (req, res) => {
  try {
    if (!adminContract) {
      // Return mock data if contract not deployed
      const mockPhi = 1500 + Math.floor(Math.random() * 500);
      return res.json({
        phiTotal: mockPhi,
        timestamp: Date.now(),
        source: 'mock'
      });
    }

    const phiTotal = await adminContract.computePhi();
    
    // Store in history
    phiHistory.push({
      value: phiTotal.toString(),
      timestamp: Date.now()
    });
    
    // Keep only last 100 values
    if (phiHistory.length > 100) {
      phiHistory.shift();
    }

    res.json({
      phiTotal: phiTotal.toString(),
      timestamp: Date.now(),
      source: 'contract'
    });
  } catch (error) {
    console.error('Error computing Φ:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get detailed Φ computation data
 */
exports.getPhiDetails = async (req, res) => {
  try {
    if (!adminContract) {
      // Return mock data
      const mockDetails = {
        weights: [100, 150, 200],
        values: [1000, 1500, 2000],
        eigenVectors: [150, 200, 250],
        total: 1500,
        parameterCount: 3,
        timestamp: Date.now(),
        source: 'mock'
      };
      return res.json(mockDetails);
    }

    const [weights, values, eigenVectors, total] = await adminContract.getPhiDetails();
    
    res.json({
      weights: weights.map(w => w.toString()),
      values: values.map(v => v.toString()),
      eigenVectors: eigenVectors.map(e => e.toString()),
      total: total.toString(),
      parameterCount: weights.length,
      timestamp: Date.now(),
      source: 'contract'
    });
  } catch (error) {
    console.error('Error getting Φ details:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get Φ value history
 */
exports.getPhiHistory = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const history = phiHistory.slice(-limit);
    
    res.json({
      history,
      count: history.length
    });
  } catch (error) {
    console.error('Error getting Φ history:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Calculate ΔS_total
 * Formula: ΔS_total = ΔS_geom + ΔS_protocol
 */
exports.calculateDeltaS = (phiParams) => {
  const deltaS_geom = phiParams.weights.reduce((sum, w, i) => {
    return sum + Math.sqrt(w * phiParams.values[i]);
  }, 0);
  
  const deltaS_protocol = phiParams.eigenVectors.reduce((sum, e) => sum + e, 0) / phiParams.eigenVectors.length;
  
  return {
    deltaS_geom,
    deltaS_protocol,
    deltaS_total: deltaS_geom + deltaS_protocol
  };
};
