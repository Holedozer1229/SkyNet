const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const phiController = require('./controllers/phiController');
const nftController = require('./controllers/nftController');
const raidController = require('./controllers/raidController');
const crosschainController = require('./controllers/crosschainController');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Φ computation endpoints
app.get('/api/phi', phiController.computePhi);
app.get('/api/phi/details', phiController.getPhiDetails);
app.get('/api/phi/history', phiController.getPhiHistory);

// NFT endpoints
app.get('/api/nfts', nftController.getAllNFTs);
app.get('/api/nfts/:tokenId', nftController.getNFT);
app.get('/api/nfts/:tokenId/rarity', nftController.getRarity);
app.get('/api/nfts/analytics/distribution', nftController.getRarityDistribution);

// Raid pass endpoints
app.get('/api/raid-passes', raidController.getRaidPasses);
app.get('/api/raid-passes/:address', raidController.getUserRaidPass);
app.post('/api/raid-passes/purchase', raidController.purchaseRaidPass);

// Cross-chain endpoints
app.get('/api/cross-chain/state', crosschainController.getState);
app.get('/api/cross-chain/metrics', crosschainController.getMetrics);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 StarLord2 × SKYNT API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔮 Φ computation: http://localhost:${PORT}/api/phi`);
});

module.exports = app;
