import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3001/api';

/**
 * CrossChain Component
 * Cross-chain mining state visualization
 */
export const CrossChain = () => {
  const [chainState, setChainState] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch cross-chain state
  const fetchState = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cross-chain/state`);
      const data = await response.json();
      setChainState(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cross-chain state:', error);
      setLoading(false);
    }
  };

  // Fetch metrics
  const fetchMetrics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cross-chain/metrics`);
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  useEffect(() => {
    fetchState();
    fetchMetrics();
    
    const interval = setInterval(() => {
      fetchState();
      fetchMetrics();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="cross-chain loading">
        <div className="loader">Loading cross-chain data...</div>
      </div>
    );
  }

  return (
    <div className="cross-chain">
      <div className="cross-chain-header">
        <h2>Cross-Chain Mining State</h2>
        <div className="last-update">
          Last updated: {chainState ? new Date(chainState.lastUpdate).toLocaleTimeString() : 'N/A'}
        </div>
      </div>

      {metrics && (
        <div className="overview-stats">
          <div className="stat-card">
            <h3>Total Hashrate</h3>
            <div className="stat-value">{metrics.overview.totalHashrate}</div>
            <div className="stat-label">Combined Power</div>
          </div>
          <div className="stat-card">
            <h3>Active Chains</h3>
            <div className="stat-value">
              {metrics.overview.activeChains}/{metrics.overview.totalChains}
            </div>
            <div className="stat-label">Connected Networks</div>
          </div>
          <div className="stat-card">
            <h3>Total Miners</h3>
            <div className="stat-value">{metrics.overview.totalMiners}</div>
            <div className="stat-label">Active Participants</div>
          </div>
        </div>
      )}

      <div className="chain-grid">
        {chainState && Object.entries(chainState.chains).map(([name, data]) => (
          <div
            key={name}
            className={`chain-card ${data.connected ? 'connected' : 'disconnected'}`}
          >
            <div className="chain-header">
              <div className="chain-name">
                <span className="chain-icon">
                  {name === 'ethereum' && '🔷'}
                  {name === 'polygon' && '🟣'}
                  {name === 'arbitrum' && '🔵'}
                  {name === 'optimism' && '🔴'}
                </span>
                <h3>{name.charAt(0).toUpperCase() + name.slice(1)}</h3>
              </div>
              <div className={`status-indicator ${data.connected ? 'active' : 'inactive'}`}>
                {data.connected ? '● Online' : '○ Offline'}
              </div>
            </div>

            {data.connected ? (
              <div className="chain-stats">
                <div className="stat-row">
                  <span className="label">Hashrate:</span>
                  <span className="value">{data.hashrate}</span>
                </div>
                <div className="stat-row">
                  <span className="label">Miners:</span>
                  <span className="value">{data.miners}</span>
                </div>
                <div className="stat-row">
                  <span className="label">Block Height:</span>
                  <span className="value">{data.blockHeight.toLocaleString()}</span>
                </div>
                <div className="stat-row">
                  <span className="label">Difficulty:</span>
                  <span className="value">{(data.difficulty / 1e12).toFixed(2)} T</span>
                </div>
                <div className="stat-row">
                  <span className="label">Status:</span>
                  <span className="value mining-active">
                    {data.miningActive ? '⛏️ Mining' : '⏸️ Paused'}
                  </span>
                </div>

                {metrics && metrics.byChain[name] && (
                  <div className="chain-metrics">
                    <div className="metric">
                      <span className="metric-label">Avg per Miner:</span>
                      <span className="metric-value">
                        {metrics.byChain[name].avgHashratePerMiner}
                      </span>
                    </div>
                    <div className="metric-bars">
                      <div className="metric-bar">
                        <span className="bar-label">Hashrate Share</span>
                        <div className="bar">
                          <div
                            className="bar-fill"
                            style={{
                              width: metrics.efficiency[name].hashrateShare
                            }}
                          />
                        </div>
                        <span className="bar-value">
                          {metrics.efficiency[name].hashrateShare}
                        </span>
                      </div>
                      <div className="metric-bar">
                        <span className="bar-label">Miner Share</span>
                        <div className="bar">
                          <div
                            className="bar-fill"
                            style={{
                              width: metrics.efficiency[name].minerShare
                            }}
                          />
                        </div>
                        <span className="bar-value">
                          {metrics.efficiency[name].minerShare}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="chain-offline">
                <p>Chain is currently offline</p>
                <button className="connect-button" disabled>
                  Coming Soon
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="cross-chain-info">
        <h3>About Cross-Chain Mining</h3>
        <div className="info-content">
          <div className="info-section">
            <h4>🌐 Multi-Chain Support</h4>
            <p>
              Mine across multiple blockchain networks simultaneously. Your mining power 
              is distributed intelligently based on difficulty and profitability.
            </p>
          </div>
          <div className="info-section">
            <h4>⚖️ Load Balancing</h4>
            <p>
              The system automatically balances mining operations across chains to 
              maximize efficiency and rewards for all participants.
            </p>
          </div>
          <div className="info-section">
            <h4>🔗 Unified Rewards</h4>
            <p>
              Rewards from all chains are consolidated into your StarLord2 account, 
              providing a seamless multi-chain experience.
            </p>
          </div>
          <div className="info-section">
            <h4>📊 Real-Time Monitoring</h4>
            <p>
              Track hashrate, difficulty, and miner activity across all connected 
              chains in real-time with automatic updates every 5 seconds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
