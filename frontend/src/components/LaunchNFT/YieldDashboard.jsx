import React, { useState, useEffect } from 'react';
import { useContract } from '../../hooks/useContract';

/**
 * YieldDashboard Component
 * Omega Infinite yield engine visualization
 */
export const YieldDashboard = () => {
  const { account, getStakeInfo } = useContract();
  const [yieldData, setYieldData] = useState({
    totalYield: 0,
    apr: 0,
    stakingYield: 0,
    attackYield: 0,
    nftYield: 0,
    omegaMultiplier: 1.0
  });
  const [stakeInfo, setStakeInfo] = useState({
    amount: '0',
    startTime: 0,
    pendingRewards: '0'
  });

  // Fetch yield data
  const fetchYieldData = async () => {
    try {
      // Calculate Omega Infinite multiplier
      // Formula: Ω = 1 + (time_staked_days / 365) * 0.5
      const timeStaked = stakeInfo.startTime > 0 
        ? (Date.now() - stakeInfo.startTime * 1000) / (1000 * 60 * 60 * 24)
        : 0;
      const omegaMultiplier = 1 + (timeStaked / 365) * 0.5;

      // Calculate yields
      const stakingYield = parseFloat(stakeInfo.pendingRewards) || 0;
      const attackYield = Math.random() * 100; // Simulated
      const nftYield = Math.random() * 50; // Simulated
      
      const totalYield = (stakingYield + attackYield + nftYield) * omegaMultiplier;
      const apr = stakeInfo.amount > 0 
        ? (totalYield / parseFloat(stakeInfo.amount)) * 100 * 365 / Math.max(timeStaked, 1)
        : 0;

      setYieldData({
        totalYield,
        apr,
        stakingYield,
        attackYield,
        nftYield,
        omegaMultiplier
      });
    } catch (error) {
      console.error('Error fetching yield data:', error);
    }
  };

  // Fetch stake info
  useEffect(() => {
    const fetchStakeInfo = async () => {
      if (!account) return;
      
      try {
        const [amount, startTime, pendingRewards] = await getStakeInfo(account);
        setStakeInfo({
          amount: amount.toString(),
          startTime: Number(startTime),
          pendingRewards: pendingRewards.toString()
        });
      } catch (error) {
        console.error('Error fetching stake info:', error);
      }
    };

    fetchStakeInfo();
    const interval = setInterval(fetchStakeInfo, 5000);
    return () => clearInterval(interval);
  }, [account]);

  // Update yield data
  useEffect(() => {
    fetchYieldData();
    const interval = setInterval(fetchYieldData, 5000);
    return () => clearInterval(interval);
  }, [stakeInfo]);

  return (
    <div className="yield-dashboard">
      <div className="dashboard-header">
        <h2>Omega Infinite Yield Engine</h2>
        <div className="omega-badge">
          <span className="omega-symbol">Ω</span>
          <span className="multiplier">×{yieldData.omegaMultiplier.toFixed(2)}</span>
        </div>
      </div>

      <div className="yield-overview">
        <div className="yield-card primary">
          <h3>Total Yield</h3>
          <div className="yield-value">
            {yieldData.totalYield.toFixed(4)} <span className="token">SL2</span>
          </div>
          <div className="yield-apr">
            APR: <span className={yieldData.apr > 50 ? 'high' : ''}>{yieldData.apr.toFixed(2)}%</span>
          </div>
        </div>

        <div className="yield-sources">
          <div className="source-card">
            <div className="source-icon">🔒</div>
            <h4>Staking Yield</h4>
            <div className="source-value">{yieldData.stakingYield.toFixed(4)}</div>
            <div className="source-percentage">
              {yieldData.totalYield > 0 
                ? ((yieldData.stakingYield / yieldData.totalYield) * 100).toFixed(1)
                : 0}%
            </div>
          </div>

          <div className="source-card">
            <div className="source-icon">⚔️</div>
            <h4>Attack Yield</h4>
            <div className="source-value">{yieldData.attackYield.toFixed(4)}</div>
            <div className="source-percentage">
              {yieldData.totalYield > 0 
                ? ((yieldData.attackYield / yieldData.totalYield) * 100).toFixed(1)
                : 0}%
            </div>
          </div>

          <div className="source-card">
            <div className="source-icon">🎨</div>
            <h4>NFT Yield</h4>
            <div className="source-value">{yieldData.nftYield.toFixed(4)}</div>
            <div className="source-percentage">
              {yieldData.totalYield > 0 
                ? ((yieldData.nftYield / yieldData.totalYield) * 100).toFixed(1)
                : 0}%
            </div>
          </div>
        </div>
      </div>

      <div className="omega-info">
        <h3>Omega Infinite Multiplier</h3>
        <div className="omega-formula">
          <span className="formula">Ω = 1 + (time_staked_days / 365) × 0.5</span>
        </div>
        <div className="omega-description">
          <p>
            The Omega Infinite multiplier increases your yield over time, rewarding long-term stakers.
            The longer you stake, the higher your multiplier grows, approaching infinity as time increases.
          </p>
        </div>
        <div className="omega-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${Math.min((yieldData.omegaMultiplier - 1) * 100, 100)}%` }}
            />
          </div>
          <div className="progress-labels">
            <span>1.0×</span>
            <span>1.5×</span>
            <span>2.0×</span>
          </div>
        </div>
      </div>

      {account && (
        <div className="stake-summary">
          <h3>Your Stake</h3>
          <div className="stake-info">
            <div className="info-row">
              <span className="label">Staked Amount:</span>
              <span className="value">{(parseFloat(stakeInfo.amount) / 1e18).toFixed(4)} SL2</span>
            </div>
            <div className="info-row">
              <span className="label">Pending Rewards:</span>
              <span className="value">{(parseFloat(stakeInfo.pendingRewards) / 1e18).toFixed(4)} SL2</span>
            </div>
            <div className="info-row">
              <span className="label">Stake Time:</span>
              <span className="value">
                {stakeInfo.startTime > 0 
                  ? Math.floor((Date.now() - stakeInfo.startTime * 1000) / (1000 * 60 * 60 * 24))
                  : 0} days
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
