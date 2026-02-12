import { useState, useEffect } from 'react';

// Admin Contract ABI
const ADMIN_ABI = [
  "function computePhi() view returns (uint256)",
  "function getPhiDetails() view returns (uint256[] weights, uint256[] values, uint256[] eigenVectors, uint256 total)",
  "function getStakingConfig() view returns (tuple(uint256 minStake, uint256 maxStake, uint256 rewardRate, uint256 lockPeriod))",
  "function getAttackConfig(uint256 tier) view returns (tuple(uint256 baseDamage, uint256 cooldown, uint256 energyCost, uint256 tier))"
];

// StarLord2 Contract ABI
const STARLORD2_ABI = [
  "function stake(uint256 amount) external",
  "function unstake(uint256 amount) external",
  "function claimRewards() external",
  "function executeAttack(uint256 tier, address target) external",
  "function getStakeInfo(address user) view returns (uint256 amount, uint256 startTime, uint256 pendingRewards)",
  "function getCurrentEnergy(address user) view returns (uint256)"
];

// NFT Contract ABI
const NFT_ABI = [
  "function mint() payable returns (uint256)",
  "function getMetadata(uint256 tokenId) view returns (uint256 rarity, uint256 phiValue, uint256 mintTime, uint256 supply, uint256 demand, string rarityTier)",
  "function tokensOfOwner(address owner) view returns (uint256[])",
  "function mintPrice() view returns (uint256)"
];

export const useContract = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [contracts, setContracts] = useState({
    admin: null,
    starLord2: null,
    nft: null
  });
  const [connected, setConnected] = useState(false);

  // Connect wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not installed');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      // Use ethers v6 syntax
      const { BrowserProvider, Contract } = await import('ethers');
      const web3Provider = new BrowserProvider(window.ethereum);
      const web3Signer = await web3Provider.getSigner();

      setProvider(web3Provider);
      setSigner(web3Signer);
      setAccount(accounts[0]);
      setConnected(true);

      // Load contract addresses from environment or deployed_admin.json
      const adminAddress = import.meta.env.VITE_ADMIN_ADDRESS || '0x0000000000000000000000000000000000000000';
      const starLord2Address = import.meta.env.VITE_STARLORD2_ADDRESS || '0x0000000000000000000000000000000000000000';
      const nftAddress = import.meta.env.VITE_NFT_ADDRESS || '0x0000000000000000000000000000000000000000';

      // Initialize contracts
      const adminContract = new Contract(adminAddress, ADMIN_ABI, web3Signer);
      const starLord2Contract = new Contract(starLord2Address, STARLORD2_ABI, web3Signer);
      const nftContract = new Contract(nftAddress, NFT_ABI, web3Signer);

      setContracts({
        admin: adminContract,
        starLord2: starLord2Contract,
        nft: nftContract
      });

      return accounts[0];
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setContracts({ admin: null, starLord2: null, nft: null });
    setConnected(false);
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  // Contract interaction methods
  const computePhi = async () => {
    if (!contracts.admin) throw new Error('Admin contract not initialized');
    return await contracts.admin.computePhi();
  };

  const getPhiDetails = async () => {
    if (!contracts.admin) throw new Error('Admin contract not initialized');
    return await contracts.admin.getPhiDetails();
  };

  const stake = async (amount) => {
    if (!contracts.starLord2) throw new Error('StarLord2 contract not initialized');
    const tx = await contracts.starLord2.stake(amount);
    return await tx.wait();
  };

  const unstake = async (amount) => {
    if (!contracts.starLord2) throw new Error('StarLord2 contract not initialized');
    const tx = await contracts.starLord2.unstake(amount);
    return await tx.wait();
  };

  const claimRewards = async () => {
    if (!contracts.starLord2) throw new Error('StarLord2 contract not initialized');
    const tx = await contracts.starLord2.claimRewards();
    return await tx.wait();
  };

  const executeAttack = async (tier, target) => {
    if (!contracts.starLord2) throw new Error('StarLord2 contract not initialized');
    const tx = await contracts.starLord2.executeAttack(tier, target);
    return await tx.wait();
  };

  const mintNFT = async (value) => {
    if (!contracts.nft) throw new Error('NFT contract not initialized');
    const tx = await contracts.nft.mint({ value });
    return await tx.wait();
  };

  const getUserNFTs = async (address) => {
    if (!contracts.nft) throw new Error('NFT contract not initialized');
    return await contracts.nft.tokensOfOwner(address);
  };

  const getStakeInfo = async (address) => {
    if (!contracts.starLord2) throw new Error('StarLord2 contract not initialized');
    return await contracts.starLord2.getStakeInfo(address);
  };

  return {
    provider,
    signer,
    account,
    contracts,
    connected,
    connectWallet,
    disconnectWallet,
    // Contract methods
    computePhi,
    getPhiDetails,
    stake,
    unstake,
    claimRewards,
    executeAttack,
    mintNFT,
    getUserNFTs,
    getStakeInfo
  };
};
