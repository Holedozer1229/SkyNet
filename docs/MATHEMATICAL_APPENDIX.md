# SKYNT Mathematical Appendix

This appendix provides formal mathematical specifications for cryptographers and protocol engineers.

---

## A. Snake-II State Transition

### A.1 State Space Definition

Let **S** be the state space:

```
S = G × H × T
```

Where:
- **G**: Grid state space (finite discrete space)
- **H**: Entropy accumulation space (ℝ₊)
- **T**: Temporal parameter space (ℕ)

### A.2 State Components

At step n, the state is:

```
Sₙ = (Gₙ, Hₙ, Tₙ)
```

Where:
- **Gₙ ∈ G**: Grid configuration at step n
- **Hₙ ∈ ℝ₊**: Accumulated entropy at step n
- **Tₙ ∈ ℕ**: Step count (Tₙ = n)

### A.3 Transition Function

The state evolution is governed by:

```
Sₙ₊₁ = F(Sₙ, k, O)
```

Where:
- **F: S × K × O → S** is the deterministic transition function
- **k ∈ K** is a mandatory scalar parameter (K ⊂ ℕ)
- **O ∈ ℝᵈ** is the oracle hint vector

### A.4 Determinism Property

For all inputs:

```
∀ Sₙ, k, O: F(Sₙ, k, O) is uniquely determined
```

This ensures:
- No randomness in state evolution
- Full replayability from initial state
- Cryptographic commitment to outcomes

### A.5 Scalar k Requirements

The scalar k must satisfy:

```
1. k ∈ ℕ
2. k > k_{previous}  (strictly increasing)
3. k is bound to miner identity
```

This prevents:
- Replay attacks
- Nonce reuse
- State manipulation

### A.6 Oracle Hint Properties

Oracle hints O satisfy:

```
1. O ∈ ℝᵈ (bounded d-dimensional vector)
2. ||O|| ≤ O_max (bounded magnitude)
3. F(S, k, O) does not directly depend on O for validity
```

This ensures:
- Oracles provide guidance, not control
- Hints cannot force invalid transitions
- System remains secure with Byzantine oracles

---

## B. Score Function

### B.1 Score Definition

The score for state Sₙ is:

```
Score(Sₙ) = α·H(Gₙ) + β·Lₙ − γ·Cₙ
```

Where:
- **α, β, γ > 0**: Weight parameters
- **H(G)**: Grid entropy function
- **Lₙ**: Path efficiency metric
- **Cₙ**: Collision/penalty term

### B.2 Grid Entropy Function

The grid entropy is computed as:

```
H(G) = −∑ᵢ pᵢ log(pᵢ)
```

Where:
- **pᵢ**: Probability distribution over grid cells
- Sum is over all occupied cells

### B.3 Path Efficiency

Path efficiency is defined as:

```
Lₙ = (distance_covered) / (optimal_distance)
```

This measures:
- How efficiently the snake navigates
- Ratio of actual to optimal path length
- Higher values indicate better performance

### B.4 Collision Penalty

The collision term is:

```
Cₙ = ∑ collision_events + ∑ boundary_violations
```

This penalizes:
- Self-intersections
- Boundary escapes
- Invalid moves

### B.5 Monotonicity Property

For honest evolution:

```
E[Score(Sₙ₊₁)] ≥ Score(Sₙ)
```

This ensures:
- Progress is generally increasing
- Random walks eventually succeed
- Mining is feasible

### B.6 Determinism

For any state S:

```
Score(S) is uniquely determined by S
```

This ensures:
- No ambiguity in validation
- Perfect replayability
- Consistent consensus

---

## C. Difficulty Convergence

### C.1 Difficulty Update Rule

The difficulty is updated periodically:

```
Dₙ₊₁ = Dₙ · (T_target / T_actual) · (1 + ε)
```

Where:
- **Dₙ**: Current difficulty
- **T_target**: Target block time
- **T_actual**: Actual block time
- **ε**: Bounded entropy correction

### C.2 Entropy Correction

The entropy term ε is:

```
ε = κ · (H_actual − H_expected) / H_expected
```

Where:
- **κ**: Sensitivity parameter (0 < κ < 0.1)
- **H_actual**: Measured network entropy
- **H_expected**: Expected entropy at current difficulty

### C.3 Convergence Proof

The system converges to target block time if:

```
|∂Dₙ₊₁ / ∂Dₙ| < 1
```

**Proof sketch**:

Let the derivative be:

```
∂Dₙ₊₁ / ∂Dₙ = (T_target / T_actual) · (1 + ε)
```

If we assume T_actual is a decreasing function of D:

```
T_actual ∝ 1/D
```

Then:

```
∂Dₙ₊₁ / ∂Dₙ ≈ (T_target · D) / T_actual · (1 + ε)
```

At equilibrium (T_actual = T_target):

```
∂Dₙ₊₁ / ∂Dₙ ≈ 1 + ε
```

If |ε| < 1, the system is stable and converges. ∎

### C.4 Stability Conditions

For stable difficulty adjustment:

```
1. 0 < κ < 0.1  (small entropy sensitivity)
2. |ε| < 0.5     (bounded correction)
3. T_actual is monotonic in D
4. Update frequency is appropriate
```

### C.5 Halving Integration

Difficulty adjusts independently of halving:

```
Reward(n) = R₀ / (2^⌊n/H⌋)
Difficulty(n) = D(n) (from convergence algorithm)
```

Where:
- **H = 210,000**: Halving period
- **R₀**: Initial reward

This separates:
- Economic emission (halving)
- Security adjustment (difficulty)

---

## D. Recursive ZK Proof Soundness

### D.1 Base Proof Definition

Let **P₀** be the base block proof asserting:

```
P₀: ∃ witness w such that:
  1. Sₙ₊₁ = F(Sₙ, k, O)
  2. Score(Sₙ₊₁) ≥ D
  3. All constraints satisfied
```

### D.2 Recursive Verifier

Let **V** be the recursive verifier circuit that verifies proof Pₙ:

```
V(Pₙ, block_n) → {0, 1}
```

Returns 1 if proof is valid, 0 otherwise.

### D.3 Soundness via Induction

**Theorem**: If V(Pₙ) = 1, then all blocks 0 through n are valid.

**Proof by induction**:

**Base case (n=0)**:
- P₀ directly proves block 0 validity
- If V(P₀) = 1, then block 0 is valid ✓

**Inductive step**:
- Assume V(Pₖ) = 1 implies blocks 0..k are valid
- Consider Pₖ₊₁
- Pₖ₊₁ contains:
  - Verification of Pₖ (by IH, blocks 0..k valid)
  - Block k+1 validity proof
- If V(Pₖ₊₁) = 1:
  - V(Pₖ) = 1 (by circuit enforcement)
  - Block k+1 is valid (by circuit enforcement)
  - Therefore blocks 0..k+1 are valid ✓

By induction, the theorem holds for all n. ∎

### D.4 Aggregation Soundness

For epoch aggregation:

```
π_epoch = Aggregate(π₁, π₂, ..., πₙ)
```

**Theorem**: If V(π_epoch) = 1, then V(πᵢ) = 1 for all i ∈ [1,n].

**Proof**:
- Aggregation circuit enforces verification of all component proofs
- Circuit constraints ensure:
  ```
  V(π_epoch) = 1 ⟹ ⋀ᵢ V(πᵢ) = 1
  ```
- By soundness of underlying proof system ∎

### D.5 Cryptographic Assumptions

Soundness relies on:

1. **Discrete Logarithm Hardness**: In the elliptic curve group
2. **Knowledge of Exponent Assumption**: For extractability
3. **Random Oracle Model**: For Fiat-Shamir transform

Under these assumptions:

```
P[Adversary produces valid proof for invalid statement] ≤ 2^{-λ}
```

Where λ ≥ 128 is the security parameter.

---

## E. Oracle Slashing Model

### E.1 Expected Payoff

An oracle's expected payoff is:

```
E[R] = p·r − (1−p)·s
```

Where:
- **p ∈ [0,1]**: Correctness probability
- **r > 0**: Reward for correct hint
- **s > 0**: Slash amount for incorrect hint

### E.2 Honest Strategy Dominance

For rational actors, honest behavior dominates if:

```
p_honest·r − (1−p_honest)·s > p_dishonest·r − (1−p_dishonest)·s
```

Rearranging:

```
(p_honest − p_dishonest)(r + s) > 0
```

Since p_honest > p_dishonest by definition, honest strategy strictly dominates when:

```
r + s > 0  (always true for r,s > 0)
```

Therefore, **honest behavior is the unique Nash equilibrium**. ∎

### E.3 Slashing Parameters

To ensure honest participation:

```
1. s ≥ 2r  (slash exceeds twice the reward)
2. r covers oracle costs
3. Reputation decay adds long-term cost
```

### E.4 Reputation Dynamics

Oracle reputation evolves as:

```
Rₙ₊₁ = λ·Rₙ + (1−λ)·qₙ
```

Where:
- **Rₙ ∈ [0,1]**: Reputation at step n
- **qₙ ∈ {0,1}**: Quality of hint at step n
- **λ ∈ (0,1)**: Memory parameter

This creates:
- Exponential decay of old behavior
- Weighted moving average of quality
- Long-term incentive alignment

### E.5 Byzantine Tolerance

Even with Byzantine oracles:

```
P[Chain halts] = 0  (oracles cannot halt chain)
P[Invalid block] = 0  (oracles cannot force invalidity)
```

Because:
- Miners can ignore all hints
- Consensus does not depend on oracle participation
- ZK proofs enforce validity regardless of hints

---

## F. ECDSA Verification (R1CS)

### F.1 ECDSA Signature Scheme

An ECDSA signature (r, s) on message m satisfies:

```
1. Compute z = H(m) (message hash)
2. Compute w = s^{-1} mod n
3. Compute u₁ = z·w mod n
4. Compute u₂ = r·w mod n
5. Compute R = u₁·G + u₂·Q (elliptic curve point)
6. Verify r ≡ R_x mod n
```

Where:
- **G**: Generator point
- **Q**: Public key
- **n**: Curve order
- **R_x**: X-coordinate of R

### F.2 R1CS Circuit Constraints

The bridge circuit enforces in R1CS:

#### Constraint 1: Modular Inverse
```
s·s^{-1} ≡ 1 (mod n)
```

Ensures s^{-1} is computed correctly.

#### Constraint 2: Hash Multiplication
```
u₁ = z·s^{-1} mod n
```

Computes first scalar multiple.

#### Constraint 3: Signature Component Multiplication
```
u₂ = r·s^{-1} mod n
```

Computes second scalar multiple.

#### Constraint 4: Point Addition
```
R = u₁·G + u₂·Q
```

Elliptic curve point addition enforced via:
- Field arithmetic constraints
- Point doubling formulas
- Montgomery ladder (for efficiency)

#### Constraint 5: Signature Verification
```
r′ ≡ R_x mod n
```

Final check that computed R matches signature.

### F.3 Field Arithmetic

All operations are in:
- **𝔽_p**: Base field for curve coordinates
- **𝔽_n**: Scalar field for discrete logarithms

Non-native field arithmetic requires:
- Limb decomposition
- Range proofs
- Modular reduction circuits

### F.4 Security Properties

The circuit ensures:

1. **Completeness**: Valid signatures always verify
2. **Soundness**: Invalid signatures never verify (except with negligible probability)
3. **No Malleability**: Witness cannot be manipulated
4. **Binding**: Signature binds to specific message and public key

### F.5 Efficiency Considerations

Circuit size (number of constraints):

```
ECDSA verification ≈ 1.5M R1CS constraints
```

Optimizations:
- Windowed scalar multiplication
- Precomputed tables for G
- GLV decomposition for secp256k1
- Batch verification for multiple signatures

### F.6 Integration with Bridge

The bridge uses ECDSA verification to:

```
1. Verify Solana transaction signatures
2. Bind proofs to specific transactions
3. Prevent signature replay
4. Authenticate minter identity
```

Combined with recursive ZK proofs:

```
π_bridge = {
  ∃ (π_recursive, sig, msg) such that:
    1. V(π_recursive) = 1
    2. ECDSA_Verify(sig, msg, Q) = 1
    3. msg binds to π_recursive
    4. Nonce is fresh
}
```

---

## G. Complexity Analysis

### G.1 Verification Complexity

| Component | Time | Space |
|-----------|------|-------|
| Block proof verification | O(1) | O(1) |
| Recursive proof verification | O(1) | O(1) |
| ECDSA circuit | O(1) | O(1) |
| Aggregated epoch | O(1) | O(1) |

All verification is constant time regardless of:
- Number of blocks
- Complexity of state transitions
- Number of oracle hints

### G.2 Proof Generation Complexity

| Component | Time | Space |
|-----------|------|-------|
| Single block proof | O(n log n) | O(n) |
| Recursive proof | O(m log m) | O(m) |
| Aggregation | O(k log k) | O(k) |

Where:
- **n**: Circuit size for block
- **m**: Circuit size for recursion
- **k**: Number of proofs to aggregate

### G.3 On-Chain Storage

| Component | Size |
|-----------|------|
| Proof | ~256 bytes |
| Public inputs | ~128 bytes |
| Total per block | ~384 bytes |

Constant regardless of:
- Block complexity
- Number of transactions
- Historical chain length

---

## H. Formal Properties Summary

### H.1 Safety Properties

1. **State Validity**: All states are well-formed
2. **Score Determinism**: Score function is deterministic
3. **No Overflows**: All arithmetic is bounded
4. **Proof Soundness**: Invalid proofs are rejected

### H.2 Liveness Properties

1. **Chain Progress**: New blocks can always be added
2. **Oracle Independence**: Chain progresses without oracles
3. **Difficulty Convergence**: Target block time is achieved
4. **Bridge Availability**: Assets can always be bridged

### H.3 Security Properties

1. **Byzantine Oracle Tolerance**: Up to 33% Byzantine oracles
2. **Long-Range Attack Resistance**: Rewriting history is infeasible
3. **Bridge Security**: No unauthorized minting
4. **Economic Security**: Rational actors behave honestly

---

## I. References

### Cryptography
1. Boneh, D., & Shoup, V. (2020). A Graduate Course in Applied Cryptography.
2. Groth, J. (2016). On the Size of Pairing-based Non-interactive Arguments. EUROCRYPT.
3. Bünz, B., et al. (2020). Recursive Proof Composition from Accumulation Schemes.

### Zero-Knowledge Proofs
4. Ben-Sasson, E., et al. (2014). Succinct Non-Interactive Zero Knowledge for a von Neumann Architecture. USENIX Security.
5. Gabizon, A., et al. (2019). PLONK: Permutations over Lagrange-bases for Oecumenical Noninteractive arguments. IACR ePrint.

### Blockchain Consensus
6. Nakamoto, S. (2008). Bitcoin: A Peer-to-Peer Electronic Cash System.
7. Pass, R., & Shi, E. (2017). The Sleepy Model of Consensus. ASIACRYPT.

### Economic Mechanisms
8. Roughgarden, T. (2021). Transaction Fee Mechanism Design. ACM SIGecom Exchanges.
9. Chitra, T., et al. (2021). Agent-Based Simulations of Blockchain Protocols.

---

## Document Status

- **Version**: 1.0
- **Status**: ✔ Complete
- **Audience**: Cryptographers, protocol engineers, auditors
- **Last Updated**: 2026-02-11
