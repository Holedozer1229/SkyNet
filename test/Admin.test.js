const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Admin Contract", function () {
  let admin;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    
    const Admin = await ethers.getContractFactory("Admin");
    admin = await Admin.deploy();
    await admin.waitForDeployment();
  });

  describe("Initialization", function () {
    it("Should initialize with default parameters", async function () {
      expect(await admin.initialized()).to.equal(true);
      expect(await admin.phiParameterCount()).to.equal(3);
    });

    it("Should compute initial Φ value correctly", async function () {
      const phi = await admin.computePhi();
      expect(phi).to.be.gt(0);
    });
  });

  describe("Φ Computation", function () {
    it("Should get detailed Φ data", async function () {
      const [weights, values, eigenVectors, total] = await admin.getPhiDetails();
      
      expect(weights.length).to.equal(3);
      expect(values.length).to.equal(3);
      expect(eigenVectors.length).to.equal(3);
      expect(total).to.be.gt(0);
    });
  });
});
