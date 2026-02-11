# SKYNT MATHEMATICAL APPENDIX

This appendix is written for cryptographers and protocol engineers.

---

## A. Snake-II State Transition

### A.1 State Space Definition

Let **S** be the state space where each state is a triple:

```
Sₙ = (Gₙ, Hₙ, Tₙ)
```

**Components:**

- **Gₙ ∈ G**: Grid state
  - G ⊆ ℤ^(w×h) where w, h are grid dimensions
  - Elements represent cell types (empty, snake, obstacle, food)

- **Hₙ ∈ H**: Historical trajectory
  - H = sequences of grid positions
  - Hₙ = [(x₀,y₀), (x₁,y₁), ..., (xₙ,yₙ)]

- **Tₙ ∈ T**: Temporal metadata
  - T = ℕ × ℝ₊ (step count × accumulated entropy)

### A.2 Transition Function

**Definition:**

```
F: S × ℕ × ℝᵈ → S
Sₙ₊₁ = F(Sₙ, k, O)
```

**Where:**
- **F** is deterministic (no randomness)
- **O ∈ ℝᵈ** is oracle hint vector (d-dimensional real vector)
- **k ∈ ℕ** is mandatory scalar (strictly increasing: kₙ₊₁ > kₙ)

**Properties:**

1. **Determinism**: ∀ S, k, O: F(S, k, O) is uniquely determined
2. **Boundedness**: ∃ N ∈ ℕ such that game terminates by step N
3. **Monotonicity**: k must be strictly increasing across attempts

### A.3 Grid Evolution Rules

For grid state Gₙ at position (x, y):

```
Gₙ₊₁(x, y) = ψ(Gₙ, move, k)
```

Where ψ enforces:
- Snake movement rules (no diagonal, continuous path)
- Collision detection (walls, self-intersection)
- Food consumption and growth
- Entropy injection via k

### A.4 Formal Correctness

**Theorem (Termination):**

For any initial state S₀, there exists N < ∞ such that:
```
∀ n ≥ N: game_over(Sₙ) = true
```

**Proof sketch:**
- Grid is finite (w × h cells)
- Snake cannot grow indefinitely (bounded by grid size)
- No infinite loops possible (k ensures progress)
- Terminal states are absorbing (game_over is sticky)

---

## B. Score Function

### B.1 Definition

The score function maps final states to real-valued scores:

```
Score: S → ℝ₊
Score(S) = α·H(G) + β·L − γ·C
```

**Where:**

- **H(G)**: Grid entropy
  ```
  H(G) = -∑ᵢⱼ p(i,j) log p(i,j)
  ```
  where p(i,j) is the probability distribution over grid cells

- **L**: Path efficiency
  ```
  L = (path_length) / (optimal_path_length)
  ```

- **C**: Collision penalty
  ```
  C = #{wall collisions} + #{self intersections}
  ```

**Parameters:**
- α, β, γ > 0 are protocol constants
- Tuned to balance exploration vs exploitation

### B.2 Properties

**Proposition (Determinism):**

For any state S and constants α, β, γ:
```
Score(S) is uniquely determined
```

**Proposition (Boundedness):**

```
0 ≤ Score(S) ≤ M
```

where M = α·log(w·h) + β·w·h is the theoretical maximum.

### B.3 Difficulty Relation

A block is valid if:

```
Score(Sₙ) ≥ Dₙ
```

where Dₙ is the current difficulty target.

---

## C. Difficulty Convergence

### C.1 Update Rule

The difficulty adjustment follows:

```
Dₙ₊₁ = Dₙ · (T_target / T_actual) · (1 + ε)
```

**Where:**
- **T_target**: Target time between blocks
- **T_actual**: Observed time between blocks
- **ε**: Bounded entropy correction, |ε| < ε_max

### C.2 Stability Analysis

**Linearized System:**

Near equilibrium (T_actual ≈ T_target), the system behaves as:

```
δDₙ₊₁ = (1 + ∂f/∂D)·δDₙ
```

**Stability Condition:**

System is stable if:

```
|∂Dₙ₊₁ / ∂Dₙ| < 1
```

**Proof:**

Taking the derivative:

```
∂Dₙ₊₁/∂Dₙ = (T_target/T_actual)·(1 + ε)
```

At equilibrium (T_actual = T_target):

```
∂Dₙ₊₁/∂Dₙ = (1 + ε)
```

For stability, we require:
```
|1 + ε| < 1
⟹ -2 < ε < 0
```

In practice, ε is bounded: -0.1 < ε < 0.1, ensuring stability.

### C.3 Convergence Rate

**Theorem (Exponential Convergence):**

If |∂D/∂D| = λ < 1, then:

```
|Dₙ - D*| ≤ λⁿ·|D₀ - D*|
```

where D* is the equilibrium difficulty.

**Proof:**

By induction on the linearized system with contraction factor λ.

### C.4 Halving Schedule

Block reward follows:

```
R(n) = R₀ · 2^(-⌊n/N_halving⌋)
```

where:
- R₀ = initial reward (50 SKYNT)
- N_halving = 210,000 blocks

**Total Supply:**

```
Total = R₀ · N_halving · ∑ᵢ₌₀^∞ 2^(-i) = R₀ · N_halving · 2 = 21,000,000 SKYNT
```

---

## D. Recursive ZK Proof Soundness

### D.1 Proof System

**Setup:**

- Pairing-friendly curve: BLS12-381
- Proof system: Groth16 or PLONK
- Security parameter: λ = 128 bits

**Circuit Relations:**

1. **Block Circuit** R_block:
   ```
   R_block = {(x, w) : Sₙ = Fⁿ(S₀, k, O) ∧ Score(Sₙ) ≥ D}
   ```
   where x = (Sₙ, D) is public, w = (S₀, k, O) is witness

2. **Recursive Circuit** R_rec:
   ```
   R_rec = {(x, w) : Verify(π_prev, x_prev) = 1 ∧ x = Hash(x_prev, block_data)}
   ```

### D.2 Base Soundness

**Theorem (Base Circuit Soundness):**

For any polynomial-time adversary A:

```
Pr[A produces π where Verify(π) = 1 but R_block(x, w) = 0] ≤ negl(λ)
```

This follows from the soundness of the underlying proof system (Groth16/PLONK).

### D.3 Recursive Soundness

**Theorem (Recursive Composition):**

If base circuit has soundness error ε_base, then after n recursive steps:

```
Pr[Accept invalid chain] ≤ n · ε_base
```

**Proof (Induction):**

*Base case (n=1):* 
- Direct application of base soundness
- Error probability: ε_base

*Inductive step:*
- Assume soundness holds for chain of length n
- For chain n+1:
  - Verify(πₙ₊₁) succeeds
  - Either πₙ₊₁ is sound (probability 1 - ε_base)
  - Or πₙ₊₁ is unsound (probability ε_base)
- Total error: n·ε_base + ε_base = (n+1)·ε_base

**Note:** For λ = 128, ε_base ≈ 2^(-128), making n·ε_base negligible for practical n.

### D.4 Knowledge Soundness

**Theorem (Witness Extractability):**

For any prover P that succeeds with probability δ:

```
∃ Extractor E such that E^P extracts valid witness w with probability ≥ δ - negl(λ)
```

This ensures the prover actually knows the solution, not just a valid-looking proof.

### D.5 Proof Aggregation

For epoch of N blocks, proof size and verification time:

```
|π_epoch| = O(1)  (constant size)
Verify_time = O(1)  (constant time)
```

Independent of N.

---

## E. Oracle Slashing Model

### E.1 Game-Theoretic Model

**Players:**
- Oracles: provide hints
- Miners: use hints to mine
- Protocol: enforces slashing

**Oracle Strategy Space:**

Each oracle chooses:
- Quality level q ∈ [0, 1] (0 = random, 1 = optimal)
- Participation rate p ∈ [0, 1]

### E.2 Expected Payoff

**Oracle expected reward:**

```
E[R_oracle] = p · (q·r_good + (1-q)·r_bad) - p·s_slash·(1-q)
```

**Where:**
- **p**: participation probability
- **q**: hint quality (correctness probability)
- **r_good**: reward for good hints
- **r_bad**: reward for bad hints (0 or negative)
- **s_slash**: slashing amount for bad hints

**Simplification:**

Assuming r_bad = 0:

```
E[R] = p · (q·r - (1-q)·s)
```

### E.3 Nash Equilibrium

**Theorem (Honest Oracle Dominance):**

If s > r, then the unique Nash equilibrium is:
```
q* = 1  (provide optimal hints)
p* = 1  (always participate)
```

**Proof:**

Taking derivatives:

```
∂E/∂q = p·(r + s) > 0
```

Since r, s, p > 0, E is strictly increasing in q.

Maximum occurs at q = 1.

Similarly:

```
∂E/∂p = q·r - (1-q)·s
```

At q = 1:
```
∂E/∂p = r > 0
```

Maximum occurs at p = 1.

### E.4 Collusion Resistance

**Theorem (Collusion Unprofitability):**

For k colluding oracles (k < n/3), the expected profit from collusion:

```
E[Profit_collusion] < E[Profit_honest]
```

if detection probability δ > r/(r + s·k).

**Proof sketch:**
- Collusion requires coordination cost c
- Detection leads to slashing of all colluding oracles
- Expected cost: δ·s·k
- Must satisfy: benefit < honest_payoff - collusion_cost - detection_cost

---

## F. ECDSA Verification (R1CS)

### F.1 ECDSA Signature Scheme

**Setup:**
- Elliptic curve: secp256k1 (same as Bitcoin/Ethereum)
- Generator point: G
- Order: n (prime)
- Private key: d ∈ [1, n-1]
- Public key: Q = d·G

### F.2 Signature Generation

To sign message m:

1. Compute z = Hash(m) mod n
2. Choose random k ∈ [1, n-1]
3. Compute R = k·G, let r = Rₓ mod n
4. Compute s = k⁻¹(z + r·d) mod n
5. Signature: (r, s)

### F.3 R1CS Constraints

The ZK circuit enforces:

**Constraint 1: Inverse Correctness**
```
s · s⁻¹ ≡ 1 (mod n)
```

**Constraint 2: u₁ Computation**
```
u₁ = z · s⁻¹ (mod n)
```

**Constraint 3: u₂ Computation**
```
u₂ = r · s⁻¹ (mod n)
```

**Constraint 4: Point Recovery**
```
R = u₁·G + u₂·Q
```

This requires:
- Scalar multiplication (elliptic curve operation)
- Point addition (elliptic curve operation)

**Constraint 5: Signature Verification**
```
r′ ≡ Rₓ (mod n)
```

where r′ is the claimed r value.

### F.4 Circuit Implementation

**Complexity:**

- **Scalar multiplication**: ~150,000 R1CS constraints per multiplication
- **Point addition**: ~1,000 R1CS constraints
- **Field arithmetic**: ~100-500 constraints per operation

**Total circuit size:**
```
Total ≈ 2 × 150,000 + 5,000 ≈ 305,000 constraints
```

### F.5 Security Analysis

**Theorem (ECDSA Soundness in R1CS):**

If the prover can produce a satisfying assignment for the R1CS constraints, then:

```
(r, s) is a valid ECDSA signature for message m under public key Q
```

**Proof:**

The constraints enforce the ECDSA verification equation:

```
R = z·s⁻¹·G + r·s⁻¹·Q
  = s⁻¹(z·G + r·Q)
  = s⁻¹(z·G + r·d·G)
  = s⁻¹·k·s·G    (by signature equation)
  = k·G
```

Therefore Rₓ mod n = r, confirming signature validity.

### F.6 Optimizations

**Non-native Field Arithmetic:**

Since secp256k1 field ≠ BLS12-381 field, we use:

1. **Limb decomposition**: Represent secp256k1 elements as multiple BLS12-381 elements
2. **Range checks**: Ensure limbs are in valid ranges
3. **Reduction**: Implement modular reduction circuits

**Elliptic Curve Operations:**

1. **Windowed multiplication**: Precompute multiples of base points
2. **Affine coordinates**: Use affine rather than projective when possible
3. **Point compression**: Transmit only x-coordinate + sign bit

---

## G. Additional Notation and Definitions

### G.1 Common Notation

| Symbol | Definition |
|--------|-----------|
| ℕ | Natural numbers {0, 1, 2, ...} |
| ℤ | Integers {..., -1, 0, 1, ...} |
| ℝ | Real numbers |
| ℝ₊ | Non-negative real numbers |
| ℝᵈ | d-dimensional real vector space |
| ⌊x⌋ | Floor function (greatest integer ≤ x) |
| ∑ᵢ | Sum over index i |
| ∏ᵢ | Product over index i |
| ∃ | Exists (existential quantifier) |
| ∀ | For all (universal quantifier) |
| ≡ | Congruent modulo (mod n) |
| ≈ | Approximately equal |
| negl(λ) | Negligible function in λ |

### G.2 Cryptographic Assumptions

**Discrete Logarithm Assumption (DLog):**

Given G and Q = d·G, it is computationally infeasible to find d.

**Decisional Diffie-Hellman (DDH):**

Cannot distinguish (G, aG, bG, abG) from (G, aG, bG, cG) for random a, b, c.

**Knowledge of Exponent Assumption (KEA):**

If A outputs (G, H, aG, aH) without knowing discrete logs, it must know a.

---

## H. Implementation Constants

### H.1 Snake-II Parameters

```
Grid dimensions: w = 32, h = 32
Max steps per game: N_max = 1024
Score coefficients: α = 1.0, β = 0.5, γ = 2.0
Oracle vector dimension: d = 16
```

### H.2 Difficulty Parameters

```
Initial difficulty: D₀ = 1000
Target block time: T_target = 10 minutes = 600 seconds
Entropy bound: |ε| < 0.1
Retargeting period: Every 2016 blocks
```

### H.3 ZK Proof Parameters

```
Curve: BLS12-381
Security level: λ = 128 bits
Proof system: Groth16
Proof size: 128 bytes (2 G1 elements + 1 G2 element)
```

### H.4 Economic Parameters

```
Initial block reward: R₀ = 50 SKYNT
Halving period: N_halving = 210,000 blocks
Total supply: 21,000,000 SKYNT
Oracle minimum stake: 1,000 SKYNT
Slash amount: 100 SKYNT per violation
```

---

## I. Security Parameter Choices

### I.1 Rationale

**128-bit security:**
- Industry standard for long-term security
- Quantum resistance: ~64 bits (still secure against Grover's algorithm)
- Collision resistance: 2^128 operations infeasible

**BLS12-381 curve:**
- Efficient pairing operations
- Well-studied security properties
- Compatible with major ZK libraries (arkworks, bellman)

**Groth16 proof system:**
- Smallest proof size (128 bytes)
- Fast verification (~1ms)
- Trusted setup acceptable for consensus (community ceremony)

### I.2 Alternative Choices

**For trustless setup:**
- Use PLONK or Halo2 (no trusted setup)
- Trade-off: Larger proofs (~512 bytes) and slower verification

**For post-quantum security:**
- Use lattice-based signatures (Dilithium)
- Trade-off: Much larger signatures (~2.5 KB)

---

## References

1. Groth, J. (2016). "On the Size of Pairing-based Non-interactive Arguments." EUROCRYPT.
2. Gabizon, A., Williamson, Z. J., & Ciobotaru, O. (2019). "PLONK: Permutations over Lagrange-bases for Oecumenical Noninteractive arguments of Knowledge." IACR ePrint.
3. Bünz, B., Chiesa, A., Mishra, P., & Spooner, N. (2020). "Recursive Proof Composition from Accumulation Schemes." TCC.
4. Johnson, D., Menezes, A., & Vanstone, S. (2001). "The Elliptic Curve Digital Signature Algorithm (ECDSA)." International Journal of Information Security.
5. Boneh, D., Lynn, B., & Shacham, H. (2001). "Short Signatures from the Weil Pairing." ASIACRYPT.

---

*This appendix provides the mathematical foundation for the SKYNT protocol. For implementation details, see the technical documentation and source code.*
