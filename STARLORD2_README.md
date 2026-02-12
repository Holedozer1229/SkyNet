# StarLord2 × SKYNT LaunchNFT Ecosystem

## 🚀 Complete Launch-Ready Repository

A comprehensive DeFi ecosystem featuring:
- **Smart Contracts**: Admin, StarLord2 staking, and SKYNTLaunchNFT with dynamic rarity
- **Backend API**: Real-time Φ computation, NFT analytics, raid passes, cross-chain state
- **Frontend**: Interactive dashboard with Φ visualization, yield tracking, NFT marketplace
- **ZK Circuits**: Circom circuits for verifiable computations
- **CI/CD**: Automated deployment pipeline

---

## 📋 Table of Contents

1. [Architecture](#architecture)
2. [Quick Start](#quick-start)
3. [Smart Contracts](#smart-contracts)
4. [Backend API](#backend-api)
5. [Frontend](#frontend)
6. [ZK Circuits](#zk-circuits)
7. [Deployment](#deployment)
8. [Testing](#testing)
9. [Mathematical Formulas](#mathematical-formulas)

---

## 🏗 Architecture

```
StarLord2 × SKYNT Ecosystem/
├── contracts/               # Smart contracts
│   ├── Admin.sol           # Central admin & Φ computation
│   ├── StarLord2.sol       # Staking & attack logic
│   └── SKYNTLaunchNFT.sol  # NFT minting & rarity
│
├── backend/                # Node.js/Express API
│   ├── server.js          # Main server
│   └── controllers/       # API endpoints
│       ├── phiController.js
│       ├── nftController.js
│       ├── raidController.js
│       └── crosschainController.js
│
├── frontend/              # React + Vite dashboard
│   └── src/
│       ├── hooks/
│       │   └── useContract.js
│       └── components/LaunchNFT/
│           ├── PhiVisualization.jsx
│           ├── YieldDashboard.jsx
│           ├── RaidPass.jsx
│           ├── CrossChain.jsx
│           └── NFTRarityDashboard.jsx
│
├── circuits/              # ZK circuits (Circom)
│   ├── phi_computation.circom
│   ├── nft_rarity.circom
│   └── scripts/
│       └── generate_witness.js
│
├── test/                  # Smart contract tests
├── scripts/               # Deployment scripts
│   └── deploy.js
│
├── .github/workflows/     # CI/CD pipelines
│   └── starlord2-ci.yml
│
└── docs/
    └── formulas.tex       # LaTeX mathematical documentation
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v20+
- **npm** or **yarn**
- **MetaMask** or compatible Web3 wallet
- **Hardhat** (installed via npm)

### 1. Clone & Install

```bash
git clone https://github.com/Holedozer1229/SkyNet.git
cd SkyNet
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Deploy Smart Contracts

```bash
# Start local Hardhat node
npm run node

# In another terminal, deploy contracts
npm run deploy:localhost
```

This will:
- Deploy Admin, StarLord2, and SKYNTLaunchNFT contracts
- Initialize Φ parameters and staking configs
- Save deployment addresses to `deployed_admin.json`

### 4. Start Backend

```bash
cd backend
npm install
npm start
```

Backend runs on `http://localhost:3001`

### 5. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 📜 Smart Contracts

### Admin.sol

Central administration contract managing:
- **Φ Computation**: `Φ_total = Σ(w_i × φ_i) / N`
- **Staking Configuration**: Min/max stake, reward rates, lock periods
- **Attack Configuration**: Tier-based attack parameters

**Key Functions:**
```solidity
function computePhi() public view returns (uint256)
function getPhiDetails() public view returns (...)
function updatePhiParameter(uint256 id, ...) external onlyOwner
function getStakingConfig() external view returns (StakingConfig memory)
```

### StarLord2.sol

ERC20 token with staking and attack mechanics:
- **Staking**: Lock tokens to earn rewards
- **Attacks**: Execute tiered attacks consuming energy
- **Energy System**: Auto-regenerating energy (1 per hour)
- **Rewards**: Based on stake amount, time, and Φ value

**Key Functions:**
```solidity
function stake(uint256 amount) external
function unstake(uint256 amount) external
function executeAttack(uint256 tier, address target) external
function claimRewards() external
```

### SKYNTLaunchNFT.sol

ERC721 NFT with dynamic rarity system:
- **Rarity Formula**: `R_i = (demand × Φ_i) / (supply + 1)`
- **Rarity Tiers**: Legendary, Epic, Rare, Uncommon, Common
- **Φ-Based Attributes**: NFT rarity tied to Φ at mint time

**Key Functions:**
```solidity
function mint() external payable returns (uint256)
function getMetadata(uint256 tokenId) external view returns (...)
function getRarityTier(uint256 tokenId) public view returns (string memory)
```

---

## 🔌 Backend API

### Endpoints

#### Φ Computation
- `GET /api/phi` - Current Φ value
- `GET /api/phi/details` - Detailed Φ parameters
- `GET /api/phi/history` - Historical Φ values

#### NFT Analytics
- `GET /api/nfts` - All NFTs with metadata
- `GET /api/nfts/:tokenId` - Single NFT details
- `GET /api/nfts/:tokenId/rarity` - Rarity calculation
- `GET /api/nfts/analytics/distribution` - Rarity distribution

#### Raid Passes
- `GET /api/raid-passes` - All raid passes
- `GET /api/raid-passes/:address` - User's raid pass
- `POST /api/raid-passes/purchase` - Purchase raid pass

#### Cross-Chain
- `GET /api/cross-chain/state` - Cross-chain mining state
- `GET /api/cross-chain/metrics` - Mining metrics

---

## 🎨 Frontend Components

### PhiVisualization

Real-time Φ computation with particle flow visualization:
- Eigenvector particle effects using M-shift optimization
- Historical Φ tracking chart
- ΔS_total calculation (geometric + protocol shifts)

### YieldDashboard

Omega Infinite yield engine:
- Total yield calculation
- APR tracking
- Omega multiplier: `Ω = 1 + (days_staked / 365) × 0.5`
- Yield sources breakdown

### RaidPass

Seasonal raid pass purchase and management:
- Three tiers: Basic, Premium, Elite
- Staking weight multipliers
- Season tracking

### CrossChain

Multi-chain mining state visualization:
- Real-time hashrate monitoring
- Chain-specific metrics
- Load balancing visualization

### NFTRarityDashboard

NFT rarity analytics:
- Rarity distribution charts
- User NFT collection
- Recently minted NFTs
- Rarity score calculations

---

## 🔐 ZK Circuits

### Φ Computation Circuit

Verifies Φ calculations:
```circom
Φ_total = Σ(w_i × φ_i) / N
ΔS_total = ΔS_geom + ΔS_protocol
```

### NFT Rarity Circuit

Verifies NFT rarity scores:
```circom
R_i = (demand × Φ_i) / (supply + 1)
```

### Generate Witness

```bash
cd circuits/scripts
node generate_witness.js phi
node generate_witness.js nft <tokenId>
```

---

## 🚀 Deployment

### Local Development

```bash
# Terminal 1: Start Hardhat node
npm run node

# Terminal 2: Deploy contracts
npm run deploy:localhost

# Terminal 3: Start backend
cd backend && npm start

# Terminal 4: Start frontend
cd frontend && npm run dev
```

### Testnet Deployment

```bash
# Configure .env with Sepolia RPC and private key
npm run deploy:sepolia
```

### Production Deployment

```bash
# Using PM2
npm install -g pm2
pm2 start ecosystem.config.js

# Or using Docker
docker-compose up -d
```

### Auto-Deploy Admin Contract

The deployment script automatically:
1. Deploys Admin contract
2. Initializes Φ parameters
3. Sets staking and attack configurations
4. Saves addresses to `deployed_admin.json`

---

## 🧪 Testing

### Smart Contract Tests

```bash
npm test
```

Tests cover:
- Admin contract Φ computation
- StarLord2 staking and attacks
- SKYNTLaunchNFT minting and rarity

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

---

## 📊 Mathematical Formulas

See `docs/formulas.tex` for complete mathematical documentation.

### Key Formulas

**Φ Total:**
```
Φ_total = Σ(w_i × φ_i) / N
```

**ΔS Total:**
```
ΔS_total = ΔS_geom + ΔS_protocol
ΔS_geom = Σ√(w_i × φ_i)
ΔS_protocol = (1/N)Σe_i
```

**NFT Rarity:**
```
R_i = (demand × Φ_i) / (supply + 1)
```

**Omega Multiplier:**
```
Ω(t) = 1 + (t_days / 365) × 0.5
```

**Attack Damage:**
```
D = (D_base × Φ_current) / 1000
```

---

## 🔧 Configuration

### Environment Variables

```env
# Smart Contracts
PRIVATE_KEY=your_private_key
SEPOLIA_RPC_URL=https://sepolia.infura.io/...
MAINNET_RPC_URL=https://mainnet.infura.io/...

# Contract Addresses
ADMIN_ADDRESS=0x...
STARLORD2_ADDRESS=0x...
NFT_ADDRESS=0x...

# Backend
PORT=3001
RPC_URL=http://localhost:8545

# Frontend
VITE_API_URL=http://localhost:3001
VITE_ADMIN_ADDRESS=0x...
```

---

## 🤝 CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/starlord2-ci.yml`):

1. **Smart Contracts**: Compile and test
2. **Backend**: Install, test, build
3. **Frontend**: Lint, build, upload artifacts
4. **ZK Circuits**: Compile Circom circuits
5. **Deploy**: Auto-deploy on main branch
6. **Sync**: Update Φ, NFT, raid pass, cross-chain data
7. **Rollback**: Automatic rollback on failure

---

## 📄 License

MIT License - see LICENSE file

---

## 🔗 Links

- **Documentation**: `/docs`
- **Whitepaper**: `/docs/WHITEPAPER.md`
- **Mathematical Appendix**: `/docs/formulas.tex`

---

## ⚠️ Security

- Contracts use OpenZeppelin libraries
- ReentrancyGuard on all value transfers
- Access control via Ownable
- Test thoroughly before mainnet deployment

---

## 🎯 Features Summary

✅ **Complete Smart Contracts**
- Admin with Φ computation
- StarLord2 staking and attacks
- SKYNTLaunchNFT with dynamic rarity

✅ **Full Backend API**
- Φ computation endpoints
- NFT rarity analytics
- Raid pass management
- Cross-chain monitoring

✅ **Interactive Frontend**
- Real-time Φ visualization with particle effects
- Omega Infinite yield dashboard
- Seasonal raid pass UI
- Cross-chain mining state
- NFT rarity analytics

✅ **ZK Circuits**
- Φ computation verification
- NFT rarity proof generation

✅ **CI/CD Pipeline**
- Automated testing
- Auto-deployment
- Rollback on failure

✅ **Documentation**
- LaTeX mathematical formulas
- Comprehensive README
- Inline code documentation

---

Built with ❤️ by the StarLord2 Team
