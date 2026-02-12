// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Admin.sol";

/**
 * @title StarLord2
 * @dev Main staking and attack logic contract for StarLord2 × SKYNT ecosystem
 */
contract StarLord2 is ERC20, ReentrancyGuard, Ownable {
    Admin public adminContract;
    
    // Staking structure
    struct Stake {
        uint256 amount;
        uint256 startTime;
        uint256 lastClaimTime;
        uint256 rewards;
    }
    
    // Attack structure
    struct Attack {
        uint256 tier;
        uint256 timestamp;
        uint256 damage;
        address target;
    }
    
    // User data
    mapping(address => Stake) public stakes;
    mapping(address => Attack[]) public userAttacks;
    mapping(address => uint256) public lastAttackTime;
    mapping(address => uint256) public energy;
    
    uint256 public totalStaked;
    uint256 public constant ENERGY_REGEN_RATE = 1; // 1 energy per hour
    uint256 public constant MAX_ENERGY = 100;
    
    // Events
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    event AttackExecuted(address indexed attacker, address indexed target, uint256 tier, uint256 damage);
    event EnergyRestored(address indexed user, uint256 amount);
    
    constructor(address _adminContract) ERC20("StarLord2", "SL2") Ownable(msg.sender) {
        adminContract = Admin(_adminContract);
        _mint(msg.sender, 1000000 * 10**18); // Initial supply
    }
    
    /**
     * @dev Stake tokens
     */
    function stake(uint256 amount) external nonReentrant {
        Admin.StakingConfig memory config = adminContract.getStakingConfig();
        require(amount >= config.minStake, "Below minimum stake");
        require(amount <= config.maxStake, "Above maximum stake");
        
        _transfer(msg.sender, address(this), amount);
        
        if (stakes[msg.sender].amount > 0) {
            _claimRewards(msg.sender);
        }
        
        stakes[msg.sender].amount += amount;
        stakes[msg.sender].startTime = block.timestamp;
        stakes[msg.sender].lastClaimTime = block.timestamp;
        totalStaked += amount;
        
        emit Staked(msg.sender, amount);
    }
    
    /**
     * @dev Unstake tokens
     */
    function unstake(uint256 amount) external nonReentrant {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.amount >= amount, "Insufficient stake");
        
        Admin.StakingConfig memory config = adminContract.getStakingConfig();
        require(block.timestamp >= userStake.startTime + config.lockPeriod, "Still locked");
        
        _claimRewards(msg.sender);
        
        userStake.amount -= amount;
        totalStaked -= amount;
        _transfer(address(this), msg.sender, amount);
        
        emit Unstaked(msg.sender, amount);
    }
    
    /**
     * @dev Claim staking rewards
     */
    function claimRewards() external nonReentrant {
        _claimRewards(msg.sender);
    }
    
    /**
     * @dev Internal function to claim rewards
     */
    function _claimRewards(address user) private {
        Stake storage userStake = stakes[user];
        if (userStake.amount == 0) return;
        
        uint256 rewards = calculateRewards(user);
        if (rewards > 0) {
            userStake.rewards = 0;
            userStake.lastClaimTime = block.timestamp;
            _mint(user, rewards);
            
            emit RewardsClaimed(user, rewards);
        }
    }
    
    /**
     * @dev Calculate pending rewards
     */
    function calculateRewards(address user) public view returns (uint256) {
        Stake memory userStake = stakes[user];
        if (userStake.amount == 0) return 0;
        
        Admin.StakingConfig memory config = adminContract.getStakingConfig();
        uint256 timeStaked = block.timestamp - userStake.lastClaimTime;
        uint256 rewards = (userStake.amount * config.rewardRate * timeStaked) / (10000 * 365 days);
        
        return rewards + userStake.rewards;
    }
    
    /**
     * @dev Execute attack
     */
    function executeAttack(uint256 tier, address target) external nonReentrant {
        require(tier > 0 && tier <= 3, "Invalid tier");
        require(target != address(0), "Invalid target");
        require(target != msg.sender, "Cannot attack self");
        
        Admin.AttackConfig memory config = adminContract.getAttackConfig(tier);
        
        // Check cooldown
        require(
            block.timestamp >= lastAttackTime[msg.sender] + config.cooldown,
            "Attack on cooldown"
        );
        
        // Check and consume energy
        _regenerateEnergy(msg.sender);
        require(energy[msg.sender] >= config.energyCost, "Insufficient energy");
        energy[msg.sender] -= config.energyCost;
        
        // Calculate damage with Φ modifier
        uint256 phiValue = adminContract.computePhi();
        uint256 damage = (config.baseDamage * phiValue) / 1000;
        
        // Record attack
        userAttacks[msg.sender].push(Attack({
            tier: tier,
            timestamp: block.timestamp,
            damage: damage,
            target: target
        }));
        
        lastAttackTime[msg.sender] = block.timestamp;
        
        emit AttackExecuted(msg.sender, target, tier, damage);
    }
    
    /**
     * @dev Regenerate energy based on time passed
     */
    function _regenerateEnergy(address user) private {
        uint256 timePassed = block.timestamp - lastAttackTime[user];
        uint256 energyToAdd = (timePassed * ENERGY_REGEN_RATE) / 1 hours;
        
        if (energyToAdd > 0) {
            energy[user] = (energy[user] + energyToAdd > MAX_ENERGY) 
                ? MAX_ENERGY 
                : energy[user] + energyToAdd;
        }
    }
    
    /**
     * @dev Get user's current energy
     */
    function getCurrentEnergy(address user) external view returns (uint256) {
        uint256 timePassed = block.timestamp - lastAttackTime[user];
        uint256 energyToAdd = (timePassed * ENERGY_REGEN_RATE) / 1 hours;
        uint256 currentEnergy = energy[user] + energyToAdd;
        
        return currentEnergy > MAX_ENERGY ? MAX_ENERGY : currentEnergy;
    }
    
    /**
     * @dev Get user's attack history
     */
    function getUserAttacks(address user) external view returns (Attack[] memory) {
        return userAttacks[user];
    }
    
    /**
     * @dev Get user's stake info
     */
    function getStakeInfo(address user) external view returns (
        uint256 amount,
        uint256 startTime,
        uint256 pendingRewards
    ) {
        Stake memory userStake = stakes[user];
        return (
            userStake.amount,
            userStake.startTime,
            calculateRewards(user)
        );
    }
}
