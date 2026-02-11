# SKYNT AUDIT CHECKLIST (MAINNET READINESS)

This checklist is structured the way top-tier auditors (Trail of Bits, OtterSec, Zellic, Quantstamp) expect.

---

## A. CONSENSUS & PoW (Snake-II)

### Correctness
- [ ] Deterministic Snake-II state transition function F(S, k, O)
- [ ] Scalar k is mandatory and strictly increasing per attempt
- [ ] No oracle input can directly mutate state (hints only)
- [ ] Grid evolution is bounded and terminates
- [ ] Score function is deterministic and replayable

### Safety
- [ ] No undefined grid states
- [ ] No overflow in score or entropy computation
- [ ] Snake path cannot escape grid bounds
- [ ] Invalid paths fail ZK verification

---

## B. DIFFICULTY & HALVING
- [ ] Difficulty PDA initialized exactly once (genesis guard)
- [ ] Retargeting uses only on-chain observable values
- [ ] No oracle influence on difficulty
- [ ] Halving schedule enforced at block boundary
- [ ] Emission never exceeds schedule

---

## C. ZERO-KNOWLEDGE CIRCUITS

### Block Circuit
- [ ] Enforces correct Snake evolution
- [ ] Enforces score ≥ difficulty
- [ ] Enforces correct k usage
- [ ] Prevents witness malleability

### Recursive Circuit
- [ ] Verifies previous proof inside circuit
- [ ] Prevents proof substitution
- [ ] Binds proof to block hash
- [ ] Epoch aggregation correct

---

## D. ORACLE SYSTEM
- [ ] Oracle stake required before participation
- [ ] Oracle hints are non-binding
- [ ] Reputation scoring deterministic
- [ ] Slashing irreversible and enforced
- [ ] Byzantine oracle cannot halt chain

---

## E. NFT & ASSET LOGIC

### Dynamic NFTs
- [ ] Trait updates deterministic
- [ ] Trait updates provably linked to events
- [ ] Metadata regeneration authenticated
- [ ] No trait inflation exploits

### Hashpower NFTs
- [ ] Reward splits correct
- [ ] Expiry enforced
- [ ] No double-claim possible
- [ ] Tradability does not affect reward logic

---

## F. BRIDGE SECURITY
- [ ] No multisig or admin mint
- [ ] Requires valid recursive ZK proof
- [ ] Verifies ECDSA (R1CS) correctly:
  - [ ] s·s⁻¹ ≡ 1 mod n
  - [ ] u₁ = z·s⁻¹ mod n
  - [ ] u₂ = r·s⁻¹ mod n
  - [ ] Rₓ = u₁Gₓ + u₂Qₓ
  - [ ] r′ ≡ Rₓ mod n
- [ ] Prevents replay across chains
- [ ] Enforces fee payment

---

## G. ECONOMICS & LEGAL
- [ ] Miner fees labeled protocol usage fees
- [ ] NFTs framed as digital collectibles
- [ ] No yield guarantees
- [ ] No custodial control
- [ ] Open participation

---

**Note**: This checklist should be completed and verified by a professional security auditor before mainnet launch.
