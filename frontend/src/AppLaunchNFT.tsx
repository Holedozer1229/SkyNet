import React, { useState } from 'react';
import { useContract } from './hooks/useContract';
import { PhiVisualization } from './components/LaunchNFT/PhiVisualization';
import { YieldDashboard } from './components/LaunchNFT/YieldDashboard';
import { RaidPass } from './components/LaunchNFT/RaidPass';
import { CrossChain } from './components/LaunchNFT/CrossChain';
import { NFTRarityDashboard } from './components/LaunchNFT/NFTRarityDashboard';
import './AppLaunchNFT.css';

function App() {
  const { account, connected, connectWallet, disconnectWallet } = useContract();
  const [activeTab, setActiveTab] = useState('phi');

  const tabs = [
    { id: 'phi', label: 'Φ Visualization', icon: '🔮' },
    { id: 'yield', label: 'Yield Dashboard', icon: '💰' },
    { id: 'nfts', label: 'NFT Rarity', icon: '🎨' },
    { id: 'raid', label: 'Raid Pass', icon: '⚔️' },
    { id: 'crosschain', label: 'Cross-Chain', icon: '🌐' }
  ];

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="app-title">
              <span className="title-star">✨</span>
              StarLord2 × SKYNT
              <span className="title-badge">LaunchNFT</span>
            </h1>
            <p className="app-subtitle">Decentralized Launch Ecosystem</p>
          </div>

          <div className="wallet-section">
            {connected ? (
              <div className="wallet-connected">
                <div className="wallet-address">
                  {account?.slice(0, 6)}...{account?.slice(-4)}
                </div>
                <button 
                  className="btn-disconnect"
                  onClick={disconnectWallet}
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button 
                className="btn-connect"
                onClick={connectWallet}
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>

        <nav className="navigation">
          <div className="nav-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main className="app-main">
        <div className="content-container">
          {activeTab === 'phi' && <PhiVisualization />}
          {activeTab === 'yield' && <YieldDashboard />}
          {activeTab === 'nfts' && <NFTRarityDashboard />}
          {activeTab === 'raid' && <RaidPass />}
          {activeTab === 'crosschain' && <CrossChain />}
        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>StarLord2 × SKYNT LaunchNFT</h4>
            <p>A complete decentralized launch ecosystem</p>
          </div>
          
          <div className="footer-section">
            <h4>Features</h4>
            <ul>
              <li>Real-time Φ Computation</li>
              <li>Dynamic NFT Rarity</li>
              <li>Omega Infinite Yield</li>
              <li>Cross-Chain Mining</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><a href="/docs">Documentation</a></li>
              <li><a href="/STARLORD2_README.md">README</a></li>
              <li><a href="https://github.com/Holedozer1229/SkyNet">GitHub</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Status</h4>
            <div className="status-indicator">
              <span className="status-dot active"></span>
              <span>System Online</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 StarLord2 Team. All rights reserved.</p>
          <p>Built with ❤️ for the decentralized future</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
