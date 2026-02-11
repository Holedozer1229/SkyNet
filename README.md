# SKYNT - The Token That Watches You

A mainnet-ready cross-chain proof-of-work (PoW) NFT system bridging Solana and Ethereum with zkSNARK verification.

## 🌟 Overview

SKYNT is a decentralized, proof-of-work based NFT minting system that:
- Runs PoW mining on Solana using Anchor programs
- Bridges mined NFTs to Ethereum via zkSNARK verification
- Implements Bitcoin-style difficulty adjustment and halving
- Provides miners in both Python and Rust for optimal performance

## 🏗️ Architecture

```
skynt-monorepo/
├── anchor-program/          # Solana smart contracts
│   ├── programs/skynt_anchor/
│   │   ├── src/
│   │   │   ├── lib.rs      # Main program logic
│   │   │   ├── pow.rs      # Proof-of-work verification
│   │   │   ├── difficulty.rs # Difficulty adjustment
│   │   │   └── mint.rs     # NFT minting
│   │   └── Cargo.toml
│   ├── Anchor.toml
│   └── migrations/
│
├── hardhat-bridge/          # Ethereum bridge contracts
│   ├── contracts/
│   │   ├── SkynetBridge.sol     # Main bridge contract
│   │   └── ECDSAVerifier.sol    # zkSNARK verifier
│   ├── circuits/
│   │   └── ecdsa_verification.circom
│   ├── scripts/
│   │   ├── deploy.js
│   │   └── mint.js
│   ├── hardhat.config.js
│   └── package.json
│
├── miners/
│   ├── python-miner/       # Python PoW miner
│   └── rust-miner/         # Rust PoW miner (optimized)
│
└── scripts/
    ├── deploy_all.sh       # Full deployment script
    └── start_miners.sh     # Start mining processes
```

## 🚀 Quick Start

### Prerequisites

- **Solana CLI**: https://docs.solana.com/cli/install-solana-cli-tools
- **Anchor**: https://www.anchor-lang.com/docs/installation
- **Node.js** (v16+): https://nodejs.org/
- **Rust**: https://rustup.rs/
- **Python 3.8+**: https://www.python.org/

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Holedozer1229/SkyNet.git
cd SkyNet
```

2. Deploy all components:
```bash
./scripts/deploy_all.sh
```

This will:
- Build and deploy the Anchor program to Solana
- Compile and deploy the Hardhat bridge to Ethereum
- Set up all necessary dependencies

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

## 📝 Smart Contracts

### Anchor Program (Solana)

**Program ID**: `SKYNTAnchor1111111111111111111111111111111111`

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
    for i in 0..10 {
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

1. **Proof-of-Work**: Prevents spam and ensures fair distribution
2. **Nonce Tracking**: Prevents replay attacks on the bridge
3. **zkSNARK Verification**: Ensures PoW validity without re-computation
4. **Difficulty Adjustment**: Maintains consistent block times
5. **Halving Mechanism**: Controls supply inflation

## 📊 Economics

- **Mining Difficulty**: Adjusts every 210,000 blocks
- **Halving Schedule**: Bitcoin-style halving
- **Initial Target**: 1/1,000,000 of hash space
- **Block Time**: Adjustable based on network conditions

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

## 🎯 Roadmap

- [ ] Mainnet deployment
- [ ] Web UI for mining and bridging
- [ ] Mobile miner applications
- [ ] Mining pool support
- [ ] Enhanced zkSNARK circuits
- [ ] Multi-chain support (BSC, Polygon, etc.)
- [ ] Governance token integration

---

Built with ❤️ by the SKYNT Team
