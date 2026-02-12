// In-memory cross-chain state (in production, use database and oracles)
const crossChainState = {
  chains: {
    ethereum: {
      connected: true,
      blockHeight: 18000000,
      miningActive: true,
      hashrate: '125 TH/s',
      difficulty: 58000000000000,
      miners: 145
    },
    polygon: {
      connected: true,
      blockHeight: 48000000,
      miningActive: true,
      hashrate: '85 TH/s',
      difficulty: 42000000000000,
      miners: 98
    },
    arbitrum: {
      connected: true,
      blockHeight: 155000000,
      miningActive: true,
      hashrate: '95 TH/s',
      difficulty: 48000000000000,
      miners: 112
    },
    optimism: {
      connected: false,
      blockHeight: 0,
      miningActive: false,
      hashrate: '0 TH/s',
      difficulty: 0,
      miners: 0
    }
  },
  totalHashrate: '305 TH/s',
  totalMiners: 355,
  lastUpdate: Date.now()
};

/**
 * Get cross-chain mining state
 */
exports.getState = async (req, res) => {
  try {
    // Update timestamps
    crossChainState.lastUpdate = Date.now();
    
    // Simulate slight variations in hashrate
    const variation = () => (0.95 + Math.random() * 0.1);
    
    Object.keys(crossChainState.chains).forEach(chain => {
      if (crossChainState.chains[chain].connected) {
        const baseHashrate = parseInt(crossChainState.chains[chain].hashrate);
        crossChainState.chains[chain].hashrate = `${Math.floor(baseHashrate * variation())} TH/s`;
      }
    });

    res.json(crossChainState);
  } catch (error) {
    console.error('Error getting cross-chain state:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get cross-chain mining metrics
 */
exports.getMetrics = async (req, res) => {
  try {
    const metrics = {
      overview: {
        totalChains: Object.keys(crossChainState.chains).length,
        activeChains: Object.values(crossChainState.chains).filter(c => c.connected).length,
        totalHashrate: crossChainState.totalHashrate,
        totalMiners: crossChainState.totalMiners
      },
      byChain: {},
      efficiency: {}
    };

    // Calculate metrics by chain
    Object.entries(crossChainState.chains).forEach(([name, data]) => {
      if (data.connected) {
        metrics.byChain[name] = {
          hashrate: data.hashrate,
          miners: data.miners,
          difficulty: data.difficulty,
          avgHashratePerMiner: data.miners > 0 
            ? `${Math.floor(parseInt(data.hashrate) / data.miners)} GH/s`
            : '0 GH/s'
        };

        metrics.efficiency[name] = {
          hashrateShare: `${Math.floor((parseInt(data.hashrate) / parseInt(crossChainState.totalHashrate)) * 100)}%`,
          minerShare: `${Math.floor((data.miners / crossChainState.totalMiners) * 100)}%`
        };
      }
    });

    res.json(metrics);
  } catch (error) {
    console.error('Error getting cross-chain metrics:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get chain-specific data
 */
exports.getChainData = async (req, res) => {
  try {
    const { chain } = req.params;
    
    if (!crossChainState.chains[chain]) {
      return res.status(404).json({ error: 'Chain not found' });
    }

    res.json({
      chain,
      data: crossChainState.chains[chain],
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error getting chain data:', error);
    res.status(500).json({ error: error.message });
  }
};
