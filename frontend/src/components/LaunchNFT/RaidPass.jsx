import React, { useState, useEffect } from 'react';
import { useContract } from '../hooks/useContract';

const SEASONS = ['Spring', 'Summer', 'Fall', 'Winter'];
const API_BASE_URL = 'http://localhost:3001/api';

/**
 * RaidPass Component
 * Seasonal raid pass purchase and tracking
 */
export const RaidPass = () => {
  const { account } = useContract();
  const [currentSeason, setCurrentSeason] = useState('');
  const [userPass, setUserPass] = useState(null);
  const [selectedTier, setSelectedTier] = useState('basic');
  const [purchasing, setPurchasing] = useState(false);

  const tiers = [
    {
      name: 'basic',
      displayName: 'Basic',
      price: '0.1 ETH',
      stakingWeight: '1.0×',
      benefits: [
        'Access to seasonal raids',
        'Basic staking weight multiplier',
        'Standard reward pool',
        'Community access'
      ],
      color: '#60a5fa'
    },
    {
      name: 'premium',
      displayName: 'Premium',
      price: '0.25 ETH',
      stakingWeight: '1.5×',
      benefits: [
        'Access to all raids',
        'Enhanced staking weight',
        'Priority reward pool',
        'Exclusive community channels',
        'NFT airdrop eligibility'
      ],
      color: '#a78bfa'
    },
    {
      name: 'elite',
      displayName: 'Elite',
      price: '0.5 ETH',
      stakingWeight: '2.0×',
      benefits: [
        'VIP raid access',
        'Maximum staking weight',
        'Elite reward pool',
        'Private community access',
        'Guaranteed NFT airdrops',
        'Governance voting rights'
      ],
      color: '#fbbf24'
    }
  ];

  // Fetch user's raid pass
  const fetchUserPass = async () => {
    if (!account) return;

    try {
      const response = await fetch(`${API_BASE_URL}/raid-passes/${account}`);
      const data = await response.json();
      
      setUserPass(data.hasPass ? data : null);
      if (data.currentSeason) {
        setCurrentSeason(data.currentSeason);
      }
    } catch (error) {
      console.error('Error fetching raid pass:', error);
    }
  };

  // Purchase raid pass
  const purchasePass = async () => {
    if (!account) {
      alert('Please connect your wallet first');
      return;
    }

    setPurchasing(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/raid-passes/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          address: account,
          tier: selectedTier
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`Successfully purchased ${selectedTier} raid pass!`);
        await fetchUserPass();
      } else {
        alert('Failed to purchase raid pass');
      }
    } catch (error) {
      console.error('Error purchasing raid pass:', error);
      alert('Error purchasing raid pass');
    } finally {
      setPurchasing(false);
    }
  };

  useEffect(() => {
    // Set current season
    const seasonIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 90)) % 4;
    setCurrentSeason(SEASONS[seasonIndex]);

    fetchUserPass();
    const interval = setInterval(fetchUserPass, 10000);
    return () => clearInterval(interval);
  }, [account]);

  return (
    <div className="raid-pass">
      <div className="raid-pass-header">
        <h2>Seasonal Raid Pass</h2>
        <div className="season-badge">
          <span className="season-icon">
            {currentSeason === 'Spring' && '🌸'}
            {currentSeason === 'Summer' && '☀️'}
            {currentSeason === 'Fall' && '🍂'}
            {currentSeason === 'Winter' && '❄️'}
          </span>
          <span className="season-name">{currentSeason} Season</span>
        </div>
      </div>

      {userPass ? (
        <div className="current-pass">
          <div className="pass-card active">
            <div className="pass-tier" style={{ borderColor: tiers.find(t => t.name === userPass.tier)?.color }}>
              <h3>{tiers.find(t => t.name === userPass.tier)?.displayName} Pass</h3>
              <div className="pass-status">Active</div>
            </div>
            <div className="pass-details">
              <div className="detail-row">
                <span className="label">Season:</span>
                <span className="value">{userPass.season}</span>
              </div>
              <div className="detail-row">
                <span className="label">Staking Weight:</span>
                <span className="value">{userPass.stakingWeight}×</span>
              </div>
              <div className="detail-row">
                <span className="label">Raids Completed:</span>
                <span className="value">{userPass.raidsCompleted}</span>
              </div>
              <div className="detail-row">
                <span className="label">Total Rewards:</span>
                <span className="value">{userPass.rewards} SL2</span>
              </div>
              <div className="detail-row">
                <span className="label">Purchase Date:</span>
                <span className="value">
                  {new Date(userPass.purchaseTime).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="purchase-section">
          <p className="purchase-description">
            Unlock exclusive seasonal content, increased staking rewards, and special NFT drops
            by purchasing a raid pass. Choose your tier based on your commitment level.
          </p>

          <div className="tier-selection">
            {tiers.map(tier => (
              <div
                key={tier.name}
                className={`tier-card ${selectedTier === tier.name ? 'selected' : ''}`}
                onClick={() => setSelectedTier(tier.name)}
                style={{
                  borderColor: selectedTier === tier.name ? tier.color : '#374151'
                }}
              >
                <div className="tier-header" style={{ background: tier.color }}>
                  <h3>{tier.displayName}</h3>
                  <div className="tier-price">{tier.price}</div>
                </div>
                <div className="tier-body">
                  <div className="tier-weight">
                    Staking Weight: <strong>{tier.stakingWeight}</strong>
                  </div>
                  <ul className="tier-benefits">
                    {tier.benefits.map((benefit, i) => (
                      <li key={i}>
                        <span className="check">✓</span> {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <button
            className="purchase-button"
            onClick={purchasePass}
            disabled={purchasing || !account}
            style={{
              background: tiers.find(t => t.name === selectedTier)?.color
            }}
          >
            {purchasing ? 'Processing...' : `Purchase ${tiers.find(t => t.name === selectedTier)?.displayName} Pass`}
          </button>

          {!account && (
            <p className="connect-wallet-message">
              Please connect your wallet to purchase a raid pass
            </p>
          )}
        </div>
      )}

      <div className="raid-pass-info">
        <h3>About Raid Passes</h3>
        <div className="info-grid">
          <div className="info-item">
            <h4>🎯 What are Raids?</h4>
            <p>
              Seasonal events where pass holders compete for exclusive rewards, 
              high-tier NFTs, and bonus staking multipliers.
            </p>
          </div>
          <div className="info-item">
            <h4>⚡ Staking Weight</h4>
            <p>
              Your pass tier multiplies your staking rewards. Higher tiers receive 
              significantly more rewards for the same stake amount.
            </p>
          </div>
          <div className="info-item">
            <h4>🔄 Seasonal Reset</h4>
            <p>
              Raid passes are valid for one season (3 months). New seasons bring 
              fresh content and opportunities.
            </p>
          </div>
          <div className="info-item">
            <h4>🎁 Exclusive Benefits</h4>
            <p>
              Pass holders get early access to NFT drops, governance rights, 
              and priority support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
