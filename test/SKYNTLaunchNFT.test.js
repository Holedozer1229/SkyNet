const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SKYNTLaunchNFT Contract", function () {
  let admin;
  let nft;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    
    const Admin = await ethers.getContractFactory("Admin");
    admin = await Admin.deploy();
    await admin.waitForDeployment();
    
    const NFT = await ethers.getContractFactory("SKYNTLaunchNFT");
    nft = await NFT.deploy(await admin.getAddress());
    await nft.waitForDeployment();
  });

  describe("Minting", function () {
    it("Should mint NFT with correct payment", async function () {
      const mintPrice = await nft.mintPrice();
      
      await expect(
        nft.connect(addr1).mint({ value: mintPrice })
      ).to.emit(nft, "NFTMinted");
      
      expect(await nft.balanceOf(addr1.address)).to.equal(1);
    });
  });
});
