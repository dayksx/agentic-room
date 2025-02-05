import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("WagmiToken and BuilderBadgeToken", function () {
  async function deployTokensFixture() {
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const WagmiToken = await hre.ethers.getContractFactory("WagmiToken");
    const wagmiToken = await WagmiToken.deploy(owner.address);

    const BuilderBadgeToken = await hre.ethers.getContractFactory("BuilderBadgeToken");
    const builderBadgeToken = await BuilderBadgeToken.deploy(wagmiToken.getAddress(), owner.address);

    return { wagmiToken, builderBadgeToken, owner, otherAccount };
  }

  describe("WagmiToken", function () {
    it("Should have correct name and symbol", async function () {
      const { wagmiToken } = await loadFixture(deployTokensFixture);

      expect(await wagmiToken.name()).to.equal("WAGMI Token");
      expect(await wagmiToken.symbol()).to.equal("WAGMI");
    });

    it("Should mint tokens correctly", async function () {
      const { wagmiToken, owner, otherAccount } = await loadFixture(deployTokensFixture);

      await wagmiToken.mint(otherAccount.address, 1000);
      expect(await wagmiToken.balanceOf(otherAccount.address)).to.equal(1000);
    });

    it("Should burn tokens correctly", async function () {
      const { wagmiToken, owner, otherAccount } = await loadFixture(deployTokensFixture);

      await wagmiToken.mint(otherAccount.address, 1000);
      await wagmiToken.connect(otherAccount).burn(500);
      expect(await wagmiToken.balanceOf(otherAccount.address)).to.equal(500);
    });

    it("Should burn tokens from another account correctly", async function () {
      const { wagmiToken, owner, otherAccount } = await loadFixture(deployTokensFixture);

      await wagmiToken.mint(otherAccount.address, 1000);
      await wagmiToken.connect(otherAccount).approve(owner.address, 500);
      await wagmiToken.burnFrom(otherAccount.address, 500);
      expect(await wagmiToken.balanceOf(otherAccount.address)).to.equal(500);
    });
  });

  describe("BuilderBadgeToken", function () {
    it("Should mint badges correctly", async function () {
      const { wagmiToken, builderBadgeToken, owner, otherAccount } = await loadFixture(deployTokensFixture);

      await wagmiToken.mint(otherAccount.address, 1000);
      await wagmiToken.connect(otherAccount).approve(builderBadgeToken.getAddress(), 100);

      await builderBadgeToken.connect(otherAccount).mintBadge(1);
      expect(await builderBadgeToken.balanceOf(otherAccount.address, 1)).to.equal(1);
    });

    it("Should revert if insufficient $WAGMI tokens", async function () {
      const { builderBadgeToken, otherAccount } = await loadFixture(deployTokensFixture);

      await expect(builderBadgeToken.connect(otherAccount).mintBadge(1)).to.be.revertedWith("Insufficient $WAGMI tokens");
    });

    it("Should revert if invalid badge ID", async function () {
      const { wagmiToken, builderBadgeToken, otherAccount } = await loadFixture(deployTokensFixture);

      await wagmiToken.mint(otherAccount.address, 1000);
      await wagmiToken.connect(otherAccount).approve(builderBadgeToken.getAddress(), 100);

      await expect(builderBadgeToken.connect(otherAccount).mintBadge(99)).to.be.revertedWith("Invalid badge ID");
    });

    it("Should burn the correct amount of $WAGMI tokens when minting a badge", async function () {
      const { wagmiToken, builderBadgeToken, owner, otherAccount } = await loadFixture(deployTokensFixture);

      await wagmiToken.mint(otherAccount.address, 1000);
      await wagmiToken.connect(otherAccount).approve(builderBadgeToken.getAddress(), 100);

      await builderBadgeToken.connect(otherAccount).mintBadge(1);
      expect(await wagmiToken.balanceOf(otherAccount.address)).to.equal(900);
    });
  });
});