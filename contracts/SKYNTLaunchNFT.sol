// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Admin.sol";

/**
 * @title SKYNTLaunchNFT
 * @dev NFT minting contract with rarity system and Φ-based attributes
 */
contract SKYNTLaunchNFT is ERC721, ERC721Enumerable, ReentrancyGuard, Ownable {
    Admin public adminContract;
    
    // NFT metadata
    struct NFTMetadata {
        uint256 rarity;
        uint256 phiValue;
        uint256 mintTime;
        uint256 supply;
        uint256 demand;
    }
    
    // State
    mapping(uint256 => NFTMetadata) public nftMetadata;
    uint256 public nextTokenId;
    uint256 public mintPrice;
    uint256 public constant MAX_SUPPLY = 10000;
    
    // Rarity tiers
    uint256 public constant COMMON_THRESHOLD = 50;
    uint256 public constant RARE_THRESHOLD = 75;
    uint256 public constant EPIC_THRESHOLD = 90;
    uint256 public constant LEGENDARY_THRESHOLD = 99;
    
    // Events
    event NFTMinted(address indexed minter, uint256 indexed tokenId, uint256 rarity, uint256 phiValue);
    event MintPriceUpdated(uint256 newPrice);
    
    constructor(address _adminContract) ERC721("SKYNT Launch NFT", "SLNFT") Ownable(msg.sender) {
        adminContract = Admin(_adminContract);
        mintPrice = 0.1 ether;
    }
    
    /**
     * @dev Mint a new NFT
     */
    function mint() external payable nonReentrant returns (uint256) {
        require(nextTokenId < MAX_SUPPLY, "Max supply reached");
        require(msg.value >= mintPrice, "Insufficient payment");
        
        uint256 tokenId = nextTokenId;
        nextTokenId++;
        
        // Get Φ value from admin contract
        uint256 phiValue = adminContract.computePhi();
        
        // Calculate rarity score based on Φ, supply, and pseudo-random demand
        uint256 supply = nextTokenId;
        uint256 demand = _calculateDemand(tokenId);
        uint256 rarityScore = _calculateRarity(supply, demand, phiValue);
        
        // Store metadata
        nftMetadata[tokenId] = NFTMetadata({
            rarity: rarityScore,
            phiValue: phiValue,
            mintTime: block.timestamp,
            supply: supply,
            demand: demand
        });
        
        _safeMint(msg.sender, tokenId);
        
        emit NFTMinted(msg.sender, tokenId, rarityScore, phiValue);
        
        return tokenId;
    }
    
    /**
     * @dev Calculate rarity score
     * Formula: R_i = f(supply, demand, Φ_i)
     * R_i = (demand * Φ_i) / (supply + 1)
     */
    function _calculateRarity(uint256 supply, uint256 demand, uint256 phiValue) 
        private 
        pure 
        returns (uint256) 
    {
        // Normalize to 0-100 range
        uint256 rawScore = (demand * phiValue) / ((supply + 1) * 100);
        return rawScore > 100 ? 100 : rawScore;
    }
    
    /**
     * @dev Calculate demand (pseudo-random based on block data)
     */
    function _calculateDemand(uint256 tokenId) private view returns (uint256) {
        uint256 randomness = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            tokenId,
            msg.sender
        )));
        
        return (randomness % 1000) + 500; // Range: 500-1499
    }
    
    /**
     * @dev Get NFT rarity tier
     */
    function getRarityTier(uint256 tokenId) public view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        
        uint256 rarity = nftMetadata[tokenId].rarity;
        
        if (rarity >= LEGENDARY_THRESHOLD) return "Legendary";
        if (rarity >= EPIC_THRESHOLD) return "Epic";
        if (rarity >= RARE_THRESHOLD) return "Rare";
        if (rarity >= COMMON_THRESHOLD) return "Uncommon";
        return "Common";
    }
    
    /**
     * @dev Get complete NFT metadata
     */
    function getMetadata(uint256 tokenId) external view returns (
        uint256 rarity,
        uint256 phiValue,
        uint256 mintTime,
        uint256 supply,
        uint256 demand,
        string memory rarityTier
    ) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        
        NFTMetadata memory meta = nftMetadata[tokenId];
        return (
            meta.rarity,
            meta.phiValue,
            meta.mintTime,
            meta.supply,
            meta.demand,
            getRarityTier(tokenId)
        );
    }
    
    /**
     * @dev Update mint price
     */
    function setMintPrice(uint256 newPrice) external onlyOwner {
        mintPrice = newPrice;
        emit MintPriceUpdated(newPrice);
    }
    
    /**
     * @dev Withdraw contract balance
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }
    
    /**
     * @dev Get tokens owned by address
     */
    function tokensOfOwner(address owner) external view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokens = new uint256[](tokenCount);
        
        for (uint256 i = 0; i < tokenCount; i++) {
            tokens[i] = tokenOfOwnerByIndex(owner, i);
        }
        
        return tokens;
    }
    
    // Override required functions
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
