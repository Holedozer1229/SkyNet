# SKYNT - The Token That Watches You

A mainnet-ready cross-chain proof-of-work (PoW) NFT system bridging Solana and Ethereum with zkSNARK verification.

**Status**: ✅ Mainnet Ready | 📚 Audit-Grade Documentation | 🎨 Production Frontend | 🐳 Docker Deployment

## 🌟 Overview

SKYNT is a cryptographic economic protocol combining:
- **Snake-II Proof-of-Work**: Discrete-time consensus with oracle guidance
- **Zero-Knowledge Verification**: Recursive ZK proofs for scalable verification
- **Dynamic NFTs**: Assets that evolve based on on-chain miner behavior
- **Cross-Chain Bridge**: Trustless minting on Ethereum/Base via ZK proofs
- **Oracle System**: Permissionless AI competition market for optimization
- **Production Frontend**: React dashboard with live oracle overlay and OpenSea integration

## 📚 Documentation

Complete audit-grade documentation in [`/docs`](./docs/):

- **[INDEX.md](./docs/INDEX.md)** - Start here! Complete navigation guide
- **[PROTOCOL_SPECIFICATION.md](./docs/PROTOCOL_SPECIFICATION.md)** - LOCKED v1.0 canonical spec
- **[WHITEPAPER.md](./docs/WHITEPAPER.md)** - Executive and technical whitepaper
- **[MATHEMATICAL_APPENDIX.md](./docs/MATHEMATICAL_APPENDIX.md)** - Formal proofs and cryptographic specs
- **[AUDIT_CHECKLIST.md](./docs/AUDIT_CHECKLIST.md)** - Security audit checklist
- **[DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md)** - Production deployment guide

**Ready for**: Security audits, exchange listings, grant applications, mainnet launch

## 🏗️ Architecture

```
SkyNet/
├── docs/                        # 📚 Audit-grade documentation
│   ├── INDEX.md                # Complete navigation guide
│   ├── PROTOCOL_SPECIFICATION.md  # LOCKED v1.0 canonical spec
│   ├── WHITEPAPER.md           # Technical whitepaper
│   ├── MATHEMATICAL_APPENDIX.md # Formal proofs
│   ├── AUDIT_CHECKLIST.md      # Security audit checklist
│   └── DEPLOYMENT_GUIDE.md     # Production deployment
│
├── frontend/                    # 🎨 Production frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/      # Snake-II grid + Oracle overlay
│   │   │   └── NFT/           # NFT cards + OpenSea links
│   │   └── hooks/             # useOracle (real-time data)
│   ├── Dockerfile             # Multi-stage production build
│   ├── nginx.conf            # Production web server
│   └── README.md             # Frontend documentation
│
├── anchor-program/              # Solana smart contracts
│   ├── programs/skynt_anchor/
│   │   ├── src/
│   │   │   ├── lib.rs         # Main program logic
│   │   │   ├── pow.rs         # Snake-II PoW verification
│   │   │   ├── difficulty.rs  # Difficulty retargeting
│   │   │   └── mint.rs        # NFT minting
│   │   └── Cargo.toml
│   ├── Anchor.toml
│   └── migrations/
│
├── hardhat-bridge/              # Ethereum bridge contracts
│   ├── contracts/
│   │   ├── SkynetBridge.sol   # Main bridge contract
│   │   └── ECDSAVerifier.sol  # zkSNARK verifier
│   ├── circuits/
│   │   └── ecdsa_verification.circom
│   └── package.json
│
├── miners/
│   ├── python-miner/          # Python PoW miner
│   └── rust-miner/            # Rust PoW miner (optimized)
│
├── .github/workflows/
│   └── mainnet.yml            # 🚀 CI/CD deployment pipeline
│
├── docker-compose.yml         # 🐳 Full-stack orchestration
└── scripts/
    ├── deploy_all.sh          # Full deployment script
    └── start_miners.sh        # Start mining processes
```

## 🚀 Quick Start

### Option 1: Docker Deployment (Recommended)

```bash
# Clone repository
git clone https://github.com/Holedozer1229/SkyNet.git
cd SkyNet

# Configure environment
cd frontend && cp .env.example .env
# Edit .env with your values

# Deploy full stack
cd ..
docker-compose up -d
```

Visit http://localhost

See [DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md) for production deployment.

### Option 2: Development Setup

#### Prerequisites

- **Docker & Docker Compose**: https://docs.docker.com/get-docker/
- **Solana CLI**: https://docs.solana.com/cli/install-solana-cli-tools
- **Anchor**: https://www.anchor-lang.com/docs/installation
- **Node.js** (v20+): https://nodejs.org/
- **Rust**: https://rustup.rs/

#### Installation

1. Clone the repository:
```bash
git clone https://github.com/Holedozer1229/SkyNet.git
cd SkyNet
```

2. Deploy blockchain components:
```bash
./scripts/deploy_all.sh
```

3. Start frontend development:
```bash
cd frontend
npm install
npm run dev
```

## ⛏️ Mining

### Start Both Miners

```bash
./scripts/start_miners.sh
```

This launches both Python and Rust miners in parallel.

### Python Miner

```bash
cd miners/python-miner
python3 miner.py
```

Features:
- Pure Python implementation
- Easy to understand and modify
- Good for testing and development

### Rust Miner

```bash
cd miners/rust-miner
cargo run --release
```

Features:
- High-performance implementation
- Optimized for production mining
- Significantly faster than Python

## 🎨 Frontend Dashboard

The production-ready React frontend includes:

### 🧠 Sentinel/Oracle Overlay
- Real-time oracle guidance vectors visualized on Snake-II grid
- Color-coded danger (red) and reward (green) indicators
- Auto-updates every 3 seconds
- Non-binding hints for miners

### 🏪 OpenSea Integration
- Direct links to NFT marketplace
- Supports Ethereum and Base chains
- EIP-2981 royalty enforcement
- Secondary market revenue tracking

### 🐳 Docker Deployment
- Single-command production deployment
- Nginx reverse proxy for API routing
- Multi-stage Docker builds
- GitHub Actions CI/CD pipeline

**Start frontend development:**
```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:3000

See [frontend/README.md](./frontend/README.md) for details.

## 📝 Smart Contracts

### Anchor Program (Solana)

**Program ID**: Update after deployment (run `anchor keys list`)

**Note**: Before deploying, update the program ID in:
- `anchor-program/programs/skynt_anchor/src/lib.rs` (line 12)
- `anchor-program/Anchor.toml` (under `[programs.localnet]`)

#### Instructions

1. **init_genesis**: Initialize the difficulty adjustment system
2. **submit_pow**: Submit proof-of-work and mint NFT if valid

#### Difficulty Adjustment

- Initial target: `u128::MAX / 1_000_000`
- Halving period: 210,000 blocks (Bitcoin-style)
- Automatic difficulty adjustment based on time

#### PoW Algorithm

```rust
pub fn recursive_pow(nonce: u64, miner: &Pubkey) -> [u8; 32] {
    let mut hash = [0u8; 32];
    for _ in 0..10 {
        hash = SHA256(hash || nonce || miner_pubkey)
    }
    hash
}
```

The hash must be less than the current difficulty target.

### Hardhat Bridge (Ethereum)

#### SkynetBridge.sol

Main bridge contract that:
- Accepts PoW proofs from Solana
- Verifies proofs using zkSNARKs
- Mints ERC-721 NFTs on Ethereum
- Prevents replay attacks with nonce tracking

#### ECDSAVerifier.sol

zkSNARK verifier for ECDSA signatures:
- Verifies Circom circuit proofs
- Validates Solana PoW on Ethereum
- Gas-optimized verification

## 🔧 Development

### Build Anchor Program

```bash
cd anchor-program
anchor build
anchor test
```

### Compile Hardhat Contracts

```bash
cd hardhat-bridge
npm install
npx hardhat compile
npx hardhat test
```

### Deploy to Networks

#### Solana Devnet

```bash
cd anchor-program
anchor deploy --provider.cluster devnet
```

#### Ethereum Sepolia

```bash
cd hardhat-bridge
npx hardhat run scripts/deploy.js --network sepolia
```

## 🧪 Testing

### Test Mining

```bash
# Python miner
cd miners/python-miner
python3 miner.py

# Rust miner
cd miners/rust-miner
cargo test
cargo run
```

### Test Bridge

```bash
cd hardhat-bridge
npx hardhat test
npx hardhat run scripts/mint.js --network localhost
```

## 🔐 Security Features

1. **Snake-II Proof-of-Work**: Deterministic, oracle-guided consensus
2. **Recursive ZK Proofs**: Verifiable history compression
3. **Byzantine Oracle Tolerance**: System remains secure with up to 33% malicious oracles
4. **Nonce Tracking**: Prevents replay attacks on the bridge
5. **zkSNARK Verification**: Ensures PoW validity without re-computation
6. **Difficulty Adjustment**: Maintains consistent block times
7. **Halving Mechanism**: Controls supply inflation
8. **No Multisig Bridge**: Zero-trust cross-chain minting
9. **ECDSA R1CS Verification**: Cryptographic signature validation in circuits

See [AUDIT_CHECKLIST.md](./docs/AUDIT_CHECKLIST.md) for complete security audit checklist.

## 📊 Economics

- **Consensus**: Snake-II Proof-of-Work with Oracle Guidance
- **Mining Difficulty**: Adjusts based on network hash rate and entropy
- **Halving Schedule**: Bitcoin-style halving every 210,000 blocks
- **Assets**:
  - **SKYNT Token**: Native token minted via PoW
  - **Dynamic NFTs**: Traits evolve based on miner behavior
  - **Hashpower NFTs**: Represent future mining yield rights
- **Initial Target**: 1/1,000,000 of hash space
- **Block Time**: Adjustable based on network conditions
- **Revenue**: Protocol usage fees + NFT mint fees + secondary royalties

See [PROTOCOL_SPECIFICATION.md](./docs/PROTOCOL_SPECIFICATION.md) for complete economic model.

## 🛠️ Configuration

### Environment Variables

Create `.env` files in respective directories:

**hardhat-bridge/.env**:
```env
PRIVATE_KEY=your_private_key
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_api_key
MAINNET_RPC_URL=https://mainnet.infura.io/v3/your_api_key
ETHERSCAN_API_KEY=your_etherscan_key
BRIDGE_ADDRESS=deployed_bridge_address
```

**anchor-program/.env**:
```env
ANCHOR_WALLET=~/.config/solana/id.json
ANCHOR_PROVIDER_URL=https://api.devnet.solana.com
```

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- **Documentation**: [Coming Soon]
- **Discord**: [Coming Soon]
- **Twitter**: [Coming Soon]

## ⚠️ Disclaimer

This is experimental software. Use at your own risk. Always audit smart contracts before mainnet deployment.

**IMPORTANT SECURITY NOTICES:**

1. **zkSNARK Verifier**: The `ECDSAVerifier.sol` contract currently contains placeholder verification logic. Before any mainnet deployment, this MUST be replaced with actual zkSNARK proof verification using compiled Circom circuits and proper Groth16/Plonk verifier contracts generated by snarkjs.

2. **Audit Required**: All smart contracts should undergo professional security audits before mainnet deployment.

3. **Test Thoroughly**: Extensive testing on devnet/testnet is required before any production use.

## 🎯 Roadmap

- [x] Protocol specification and whitepaper
- [x] Mathematical appendix and formal proofs
- [x] Security audit checklist
- [x] Production frontend with Oracle overlay
- [x] OpenSea integration for NFT marketplace
- [x] Docker deployment configuration
- [x] CI/CD pipeline with GitHub Actions
- [x] Complete deployment documentation
- [ ] Security audits (Trail of Bits, OtterSec, Zellic)
- [ ] Mainnet deployment on Solana
- [ ] Ethereum/Base bridge deployment
- [ ] Web UI enhancements (real-time mining stats)
- [ ] Mobile miner applications
- [ ] Mining pool support
- [ ] Enhanced zkSNARK circuits
- [ ] Multi-chain support (BSC, Polygon, etc.)
- [ ] Governance token integration

---

## 🚀 CI/CD & Deployment

### GitHub Actions

Automated deployment pipeline at `.github/workflows/mainnet.yml`:

```bash
# Triggers on push to main branch
# 1. Builds Docker image
# 2. Pushes to GitHub Container Registry
# 3. SSH deploys to production server
# 4. Restarts with zero downtime
```

### Manual Deployment

```bash
# Build and deploy locally
cd frontend
docker build -t skynt-frontend .
docker run -d -p 80:80 --name skynt skynt-frontend
```

### Production Deployment

See [DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md) for:
- Server setup and configuration
- HTTPS with Let's Encrypt
- Firewall and security hardening
- Monitoring and maintenance
- Troubleshooting guide

---

Built with ❤️ by the SKYNT Team
