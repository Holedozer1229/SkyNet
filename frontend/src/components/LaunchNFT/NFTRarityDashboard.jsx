import React, { useState, useEffect } from 'react';
import { useContract } from '../../hooks/useContract';

const API_BASE_URL = 'http://localhost:3001/api';

/**
 * NFTRarityDashboard Component
 * NFT rarity analytics and distribution visualization
 */
export const NFTRarityDashboard = () => {
  const { account, getUserNFTs } = useContract();
  const [nfts, setNfts] = useState([]);
  const [distribution, setDistribution] = useState(null);
  const [userNFTs, setUserNFTs] = useState([]);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all NFTs
  const fetchNFTs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/nfts`);
      const data = await response.json();
      setNfts(data.nfts || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      setLoading(false);
    }
  };

  // Fetch rarity distribution
  const fetchDistribution = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/nfts/analytics/distribution`);
      const data = await response.json();
      setDistribution(data.distribution);
    } catch (error) {
      console.error('Error fetching distribution:', error);
    }
  };

  // Fetch user's NFTs
  const fetchUserNFTs = async () => {
    if (!account) return;

    try {
      const tokenIds = await getUserNFTs(account);
      const userNFTData = await Promise.all(
        tokenIds.map(async (tokenId) => {
          const response = await fetch(`${API_BASE_URL}/nfts/${tokenId}`);
          return await response.json();
        })
      );
      setUserNFTs(userNFTData);
    } catch (error) {
      console.error('Error fetching user NFTs:', error);
    }
  };

  // Get NFT details
  const selectNFT = async (tokenId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/nfts/${tokenId}`);
      const data = await response.json();
      setSelectedNFT(data);
    } catch (error) {
      console.error('Error fetching NFT details:', error);
    }
  };

  useEffect(() => {
    fetchNFTs();
    fetchDistribution();
    
    const interval = setInterval(() => {
      fetchNFTs();
      fetchDistribution();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchUserNFTs();
  }, [account]);

  const getRarityColor = (tier) => {
    const colors = {
      'Legendary': '#fbbf24',
      'Epic': '#a78bfa',
      'Rare': '#60a5fa',
      'Uncommon': '#34d399',
      'Common': '#9ca3af'
    };
    return colors[tier] || '#9ca3af';
  };

  if (loading) {
    return (
      <div className="nft-rarity-dashboard loading">
        <div className="loader">Loading NFT data...</div>
      </div>
    );
  }

  return (
    <div className="nft-rarity-dashboard">
      <div className="dashboard-header">
        <h2>NFT Rarity Analytics</h2>
        <div className="header-stats">
          <span>Total NFTs: {nfts.length}</span>
          {account && <span>Your NFTs: {userNFTs.length}</span>}
        </div>
      </div>

      {distribution && (
        <div className="rarity-distribution">
          <h3>Rarity Distribution</h3>
          <div className="distribution-chart">
            {Object.entries(distribution).map(([tier, count]) => {
              const total = Object.values(distribution).reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? (count / total) * 100 : 0;
              
              return (
                <div key={tier} className="distribution-bar-container">
                  <div className="distribution-label">
                    <span 
                      className="rarity-dot" 
                      style={{ background: getRarityColor(tier) }}
                    />
                    <span className="tier-name">{tier}</span>
                    <span className="tier-count">{count}</span>
                  </div>
                  <div className="distribution-bar">
                    <div
                      className="distribution-fill"
                      style={{
                        width: `${percentage}%`,
                        background: getRarityColor(tier)
                      }}
                    />
                  </div>
                  <div className="distribution-percentage">
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="rarity-formula">
        <h3>Rarity Calculation Formula</h3>
        <div className="formula-box">
          <code>R_i = (demand × Φ_i) / (supply + 1)</code>
        </div>
        <p className="formula-description">
          Each NFT's rarity score is calculated based on market demand, the current Φ value, 
          and total supply at the time of minting. This creates a dynamic rarity system 
          that reflects both intrinsic and market-driven value.
        </p>
      </div>

      {account && userNFTs.length > 0 && (
        <div className="user-nfts">
          <h3>Your NFT Collection</h3>
          <div className="nft-grid">
            {userNFTs.map((nft) => (
              <div
                key={nft.tokenId}
                className="nft-card"
                onClick={() => selectNFT(nft.tokenId)}
                style={{
                  borderColor: getRarityColor(nft.rarityTier)
                }}
              >
                <div className="nft-id">#{nft.tokenId}</div>
                <div 
                  className="nft-rarity-tier"
                  style={{ background: getRarityColor(nft.rarityTier) }}
                >
                  {nft.rarityTier}
                </div>
                <div className="nft-stats">
                  <div className="nft-stat">
                    <span className="stat-label">Rarity Score:</span>
                    <span className="stat-value">{nft.rarity}</span>
                  </div>
                  <div className="nft-stat">
                    <span className="stat-label">Φ Value:</span>
                    <span className="stat-value">{nft.phiValue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="recent-nfts">
        <h3>Recently Minted</h3>
        <div className="nft-list">
          {nfts.slice(0, 10).map((nft) => (
            <div
              key={nft.tokenId}
              className="nft-list-item"
              onClick={() => selectNFT(nft.tokenId)}
            >
              <div className="nft-list-id">#{nft.tokenId}</div>
              <div 
                className="nft-list-tier"
                style={{ color: getRarityColor(nft.rarityTier) }}
              >
                {nft.rarityTier}
              </div>
              <div className="nft-list-rarity">{nft.rarity}</div>
              <div className="nft-list-owner">
                {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}
              </div>
              <div className="nft-list-time">
                {new Date(parseInt(nft.mintTime) * 1000).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedNFT && (
        <div className="nft-modal" onClick={() => setSelectedNFT(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedNFT(null)}>
              ×
            </button>
            <h2>NFT #{selectedNFT.tokenId}</h2>
            <div 
              className="modal-tier"
              style={{ 
                background: getRarityColor(selectedNFT.rarityTier),
                color: '#000'
              }}
            >
              {selectedNFT.rarityTier}
            </div>
            <div className="modal-details">
              <div className="detail-row">
                <span className="label">Rarity Score:</span>
                <span className="value">{selectedNFT.rarity}</span>
              </div>
              <div className="detail-row">
                <span className="label">Φ Value:</span>
                <span className="value">{selectedNFT.phiValue}</span>
              </div>
              <div className="detail-row">
                <span className="label">Supply at Mint:</span>
                <span className="value">{selectedNFT.supply}</span>
              </div>
              <div className="detail-row">
                <span className="label">Demand:</span>
                <span className="value">{selectedNFT.demand}</span>
              </div>
              <div className="detail-row">
                <span className="label">Mint Time:</span>
                <span className="value">
                  {new Date(parseInt(selectedNFT.mintTime) * 1000).toLocaleString()}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Owner:</span>
                <span className="value">
                  {selectedNFT.owner.slice(0, 10)}...{selectedNFT.owner.slice(-8)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
