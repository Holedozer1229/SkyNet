// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title Admin
 * @dev Central admin contract for StarLord2 × SKYNT LaunchNFT ecosystem
 * Manages Φ computation, staking configs, and system parameters
 */
contract Admin is Ownable, ReentrancyGuard {
    // Φ parameters
    struct PhiParams {
        uint256 weight;
        uint256 value;
        uint256 eigenVector;
    }
    
    // Staking configuration
    struct StakingConfig {
        uint256 minStake;
        uint256 maxStake;
        uint256 rewardRate;
        uint256 lockPeriod;
    }
    
    // Attack configuration
    struct AttackConfig {
        uint256 baseDamage;
        uint256 cooldown;
        uint256 energyCost;
        uint256 tier;
    }
    
    // State variables
    mapping(uint256 => PhiParams) public phiParameters;
    StakingConfig public stakingConfig;
    mapping(uint256 => AttackConfig) public attackConfigs;
    
    uint256 public phiParameterCount;
    uint256 public totalPhiValue;
    bool public initialized;
    
    // Events
    event Initialized(address indexed by, uint256 timestamp);
    event PhiParameterUpdated(uint256 indexed id, uint256 weight, uint256 value, uint256 eigenVector);
    event StakingConfigUpdated(uint256 minStake, uint256 maxStake, uint256 rewardRate, uint256 lockPeriod);
    event AttackConfigUpdated(uint256 indexed tier, uint256 baseDamage, uint256 cooldown, uint256 energyCost);
    
    constructor() Ownable(msg.sender) {
        _initializeDefaults();
    }
    
    /**
     * @dev Initialize default parameters on deployment
     */
    function _initializeDefaults() private {
        // Initialize Φ parameters (3 default parameters)
        phiParameters[0] = PhiParams({
            weight: 100,
            value: 1000,
            eigenVector: 150
        });
        
        phiParameters[1] = PhiParams({
            weight: 150,
            value: 1500,
            eigenVector: 200
        });
        
        phiParameters[2] = PhiParams({
            weight: 200,
            value: 2000,
            eigenVector: 250
        });
        
        phiParameterCount = 3;
        
        // Initialize staking config with more reasonable values
        stakingConfig = StakingConfig({
            minStake: 1 ether, // 1 ETH minimum stake (adjustable)
            maxStake: 10000 ether,
            rewardRate: 500, // 5% in basis points
            lockPeriod: 30 days
        });
        
        // Initialize attack configs (3 tiers)
        attackConfigs[1] = AttackConfig({
            baseDamage: 100,
            cooldown: 1 hours,
            energyCost: 10,
            tier: 1
        });
        
        attackConfigs[2] = AttackConfig({
            baseDamage: 250,
            cooldown: 3 hours,
            energyCost: 25,
            tier: 2
        });
        
        attackConfigs[3] = AttackConfig({
            baseDamage: 500,
            cooldown: 6 hours,
            energyCost: 50,
            tier: 3
        });
        
        initialized = true;
        emit Initialized(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Compute total Φ value
     * Formula: Φ_total = Σ_i (w_i * φ_i) / N
     */
    function computePhi() public view returns (uint256) {
        if (phiParameterCount == 0) return 0;
        
        uint256 sum = 0;
        for (uint256 i = 0; i < phiParameterCount; i++) {
            sum += (phiParameters[i].weight * phiParameters[i].value);
        }
        
        return sum / phiParameterCount;
    }
    
    /**
     * @dev Get detailed Φ computation data
     */
    function getPhiDetails() public view returns (
        uint256[] memory weights,
        uint256[] memory values,
        uint256[] memory eigenVectors,
        uint256 total
    ) {
        weights = new uint256[](phiParameterCount);
        values = new uint256[](phiParameterCount);
        eigenVectors = new uint256[](phiParameterCount);
        
        for (uint256 i = 0; i < phiParameterCount; i++) {
            weights[i] = phiParameters[i].weight;
            values[i] = phiParameters[i].value;
            eigenVectors[i] = phiParameters[i].eigenVector;
        }
        
        total = computePhi();
    }
    
    /**
     * @dev Update Φ parameter
     */
    function updatePhiParameter(uint256 id, uint256 weight, uint256 value, uint256 eigenVector) 
        external 
        onlyOwner 
    {
        require(id < phiParameterCount, "Invalid parameter ID");
        
        phiParameters[id] = PhiParams({
            weight: weight,
            value: value,
            eigenVector: eigenVector
        });
        
        emit PhiParameterUpdated(id, weight, value, eigenVector);
    }
    
    /**
     * @dev Add new Φ parameter
     */
    function addPhiParameter(uint256 weight, uint256 value, uint256 eigenVector) 
        external 
        onlyOwner 
    {
        uint256 id = phiParameterCount;
        phiParameters[id] = PhiParams({
            weight: weight,
            value: value,
            eigenVector: eigenVector
        });
        
        phiParameterCount++;
        emit PhiParameterUpdated(id, weight, value, eigenVector);
    }
    
    /**
     * @dev Update staking configuration
     */
    function updateStakingConfig(
        uint256 minStake,
        uint256 maxStake,
        uint256 rewardRate,
        uint256 lockPeriod
    ) external onlyOwner {
        stakingConfig = StakingConfig({
            minStake: minStake,
            maxStake: maxStake,
            rewardRate: rewardRate,
            lockPeriod: lockPeriod
        });
        
        emit StakingConfigUpdated(minStake, maxStake, rewardRate, lockPeriod);
    }
    
    /**
     * @dev Update attack configuration
     */
    function updateAttackConfig(
        uint256 tier,
        uint256 baseDamage,
        uint256 cooldown,
        uint256 energyCost
    ) external onlyOwner {
        require(tier > 0 && tier <= 10, "Invalid tier");
        
        attackConfigs[tier] = AttackConfig({
            baseDamage: baseDamage,
            cooldown: cooldown,
            energyCost: energyCost,
            tier: tier
        });
        
        emit AttackConfigUpdated(tier, baseDamage, cooldown, energyCost);
    }
    
    /**
     * @dev Get staking configuration
     */
    function getStakingConfig() external view returns (StakingConfig memory) {
        return stakingConfig;
    }
    
    /**
     * @dev Get attack configuration for a tier
     */
    function getAttackConfig(uint256 tier) external view returns (AttackConfig memory) {
        return attackConfigs[tier];
    }
}
