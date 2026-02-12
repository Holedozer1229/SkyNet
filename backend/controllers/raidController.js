// In-memory raid pass state (in production, use database)
const raidPasses = new Map();
const SEASONS = ['Spring', 'Summer', 'Fall', 'Winter'];
const CURRENT_SEASON = SEASONS[Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 90)) % 4];

/**
 * Get all raid passes
 */
exports.getRaidPasses = async (req, res) => {
  try {
    const passes = Array.from(raidPasses.entries()).map(([address, data]) => ({
      address,
      ...data
    }));

    res.json({
      raidPasses: passes,
      currentSeason: CURRENT_SEASON,
      total: passes.length
    });
  } catch (error) {
    console.error('Error getting raid passes:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get user's raid pass
 */
exports.getUserRaidPass = async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!raidPasses.has(address)) {
      return res.json({
        address,
        hasPass: false,
        season: CURRENT_SEASON
      });
    }

    const passData = raidPasses.get(address);
    
    res.json({
      address,
      hasPass: true,
      ...passData,
      currentSeason: CURRENT_SEASON
    });
  } catch (error) {
    console.error('Error getting user raid pass:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Purchase raid pass
 */
exports.purchaseRaidPass = async (req, res) => {
  try {
    const { address, tier = 'basic' } = req.body;
    
    if (!address) {
      return res.status(400).json({ error: 'Address required' });
    }

    // Calculate staking weight based on tier
    const stakingWeights = {
      basic: 1.0,
      premium: 1.5,
      elite: 2.0
    };

    const passData = {
      tier,
      season: CURRENT_SEASON,
      purchaseTime: Date.now(),
      stakingWeight: stakingWeights[tier] || 1.0,
      raidsCompleted: 0,
      rewards: 0,
      active: true
    };

    raidPasses.set(address, passData);

    res.json({
      success: true,
      address,
      raidPass: passData
    });
  } catch (error) {
    console.error('Error purchasing raid pass:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get raid pass analytics
 */
exports.getRaidPassAnalytics = async (req, res) => {
  try {
    const analytics = {
      totalPasses: raidPasses.size,
      byTier: {
        basic: 0,
        premium: 0,
        elite: 0
      },
      totalRaids: 0,
      totalRewards: 0
    };

    for (const [, data] of raidPasses) {
      analytics.byTier[data.tier]++;
      analytics.totalRaids += data.raidsCompleted;
      analytics.totalRewards += data.rewards;
    }

    res.json({
      analytics,
      currentSeason: CURRENT_SEASON
    });
  } catch (error) {
    console.error('Error getting raid pass analytics:', error);
    res.status(500).json({ error: error.message });
  }
};
