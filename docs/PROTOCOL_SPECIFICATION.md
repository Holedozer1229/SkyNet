# SKYNT PROTOCOL — FINAL SPECIFICATION (v1.0)

**Status**: Mainnet-ready  
**Consensus**: Snake-II Proof-of-Work with Oracle Guidance  
**Security**: Recursive ZK Proofs + Byzantine Oracle Slashing  
**Execution**: Solana (Anchor) + Ethereum/Base (Bridge)  
**Assets**: SKYNT token + Dynamic NFTs + Hashpower NFTs

---

## 1. SYSTEM OVERVIEW

SKYNT is a cryptographic economic protocol combining:
- **Discrete-time Proof-of-Work (Snake-II)**
- **Oracle-assisted optimization**
- **Zero-Knowledge verification and compression**
- **Dynamic NFTs tied to miner behavior**
- **Cross-chain trustless minting and bridging**
- **On-chain difficulty, halving, and revenue accounting**

The protocol is self-regulating, permissionless, and provably verifiable across chains.

---

## 2. CONSENSUS: SNAKE-II PROOF-OF-WORK

### 2.1 State Space

Each block corresponds to a discrete dynamical system:

```
State Sₙ = (Gridₙ, Headₙ, Tailₙ, OracleHintsₙ)
```

- **Grid**: finite 2D lattice
- **Snake path evolves deterministically**
- **Oracle hints bias but do not determine motion**

### 2.2 Time / Nonce (Scalar k)

- Scalar **k** is mandatory
- Represents:
  - Extranonce
  - Time step
  - State evolution index

```
Sₙ₊₁ = F(Sₙ, k, OracleHints)
```

**No block exists without a valid k.**

### 2.3 Difficulty

A block is valid if:

```
Score(Sₙ) ≥ Difficultyₙ
```

Score is derived from:
- Grid entropy
- Path efficiency
- Target acquisition

---

## 3. DIFFICULTY RETARGETING & HALVING

### 3.1 On-Chain Difficulty PDA

Stored on Solana:

```rust
pub struct DifficultyState {
    pub current_difficulty: u128,
    pub last_adjustment_slot: u64,
    pub target_block_time: u64,
    pub halving_interval: u64,
    pub emission_rate: u64,
}
```

### 3.2 Retarget Formula

```
Dₙ₊₁ = Dₙ × (T_target / T_actual) × f(entropy)
```

- Fully deterministic
- Oracle-independent
- Enforced on-chain

### 3.3 Halving

- Emission halves every **H** blocks
- Stored and enforced on-chain
- Applies to:
  - Miner rewards
  - Hashpower NFT payouts

---

## 4. ZERO-KNOWLEDGE VERIFICATION

### 4.1 Block Proof

Each block includes a ZK proof asserting:

```
Given (prev_hash, grid_root, oracle_commitment, k, difficulty)
the Snake evolution reaches a valid terminal state.
```

Circuit enforces:
- Deterministic evolution
- Score ≥ difficulty
- Correct nonce usage

### 4.2 Recursive Rollups

Blocks are recursively verified:

```
Proofₙ₊₁ = ZK( verify(Proofₙ), Blockₙ₊₁ )
```

Epoch proofs compress thousands of blocks into one.

### 4.3 Verification Targets

- Solana PDAs
- Ethereum/Base bridge contracts
- NFT mint authorization

---

## 5. ORACLE SYSTEM

### 5.1 Oracle Role

Oracles provide guidance vectors, not control.
- Heuristic hints
- Optimization suggestions
- No direct state mutation

### 5.2 Reputation & Slashing

```rust
pub struct OracleReputation {
    pub oracle: Pubkey,
    pub score: i64,
    pub stake: u64,
    pub slashed: bool,
}
```

Scoring:

```
score += valid_blocks − invalid_blocks − entropy_loss
```

- Below threshold → slashed
- Byzantine behavior → permanent ban

### 5.3 Oracle Market

- Oracles stake SKYNT
- Miners select oracle feeds
- Best oracles earn fees + reputation

This creates a **permissionless AI competition market**.

---

## 6. ASSETS

### 6.1 SKYNT Token

- Minted per valid block
- Emission controlled by halving
- Used for:
  - Fees
  - Oracle staking
  - Governance

### 6.2 Dynamic NFTs (LaunchNFT)

NFT traits evolve based on on-chain behavior:

| Trait Source | Effect |
|--------------|--------|
| Blocks mined | Power |
| Oracle alignment | Wisdom |
| ZK inclusion | Rarity |
| Longevity | Endurance |

Traits are:
- Deterministic
- On-chain verified
- Cross-chain mutable

### 6.3 Hashpower / Miner Futures NFTs

NFTs representing future mining yield:

```rust
pub struct HashpowerNFT {
    pub miner: Pubkey,
    pub share_bps: u16,
    pub expiry_block: u64,
}
```

- Tradable
- Non-inflationary
- Auto-paid on block rewards

---

## 7. CROSS-CHAIN BRIDGE

### 7.1 Trust Model

**Zero trust. No multisigs.**

Bridge verifies:
- Recursive ZK proofs
- ECDSA signatures (R1CS)
- Merkle inclusion

### 7.2 Ethereum / Base Minting

Conditions:
1. Valid epoch proof
2. Valid miner signature
3. Fee payment verified

Result:
- SKYNT minted on EVM
- NFT mirrored or mutated

---

## 8. REVENUE & MONETIZATION

### 8.1 Fees

- Miner usage fee
- NFT mint fee
- Secondary royalties

Stored on-chain:

```rust
pub struct RevenueState {
    pub total_miner_fees: u64,
    pub total_mint_fees: u64,
    pub total_royalties: u64,
}
```

### 8.2 Legal Framing

- Miner fee = protocol usage fee
- NFTs = digital collectibles
- Hashpower NFTs = usage rights

**No profit guarantees. No custodial control.**

---

## 9. FRONTEND & OPERATIONS

- Live Snake-II grid visualization
- Oracle overlay
- Revenue analytics
- Miner dashboards
- OpenSea integration
- Docker + CI/CD deployment

---

## 10. SECURITY PROPERTIES

✔ Deterministic consensus  
✔ ZK-verifiable history  
✔ Byzantine oracle tolerance  
✔ No trusted bridge actors  
✔ Economically aligned incentives

---

## 11. FINAL CHARACTERIZATION

SKYNT is:
- A PoW system with provable efficiency
- A ZK-compressed, cross-chain ledger
- A living NFT ecosystem
- A permissionless AI oracle market
- A self-auditing cryptoeconomic machine

---

## ✅ STATUS: LOCKED SPEC

This specification is now final and canonical.

---

## Document Metadata

- **Version**: 1.0
- **Status**: LOCKED - Mainnet Ready
- **Last Updated**: 2026-02-11
- **Authority**: Canonical Protocol Specification
- **Audience**: Auditors, Grant Committees, Launch Partners, Infrastructure Providers, Miners/Validators
