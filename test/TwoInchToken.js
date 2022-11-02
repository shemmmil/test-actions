const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TwoInchToken", () => {
    let myToken;
    let deployer, user1, user2;
    const capSupply = ethers.utils.parseEther("2000000000");
    const name = "TwoInchToken",
        symbol = "2INCH";

    before(async () => {
        [deployer, user1, user2] = await ethers.getSigners();

        const MyToken = await ethers.getContractFactory("TwoInchToken");
        myToken = await MyToken.deploy(name, symbol, capSupply);
        await myToken.deployed();
    });

    it("Check deployment", async () => {
        expect(await myToken.name()).to.equal(name);
        expect(await myToken.symbol()).to.equal(symbol);
        expect(await myToken.decimals()).to.equal(18);
        expect(await myToken.cap()).to.equal(capSupply);
        expect(await myToken.totalSupply()).to.equal(ethers.utils.parseEther("1000000000"));
        expect(await myToken.balanceOf(deployer.address)).to.equal(ethers.utils.parseEther("1000000000"));
        expect(await myToken.hasRole(await myToken.DEFAULT_ADMIN_ROLE(), deployer.address)).to.be.true;
        expect(await myToken.hasRole(await myToken.MINTER_ROLE(), deployer.address)).to.be.true;
    });

    it("Should mint", async () => {
        const amountToMint = ethers.utils.parseEther("500000000");
        const balanceBefore = await myToken.balanceOf(deployer.address);
        const totalSupplyBefore = await myToken.totalSupply();

        await myToken.mint(amountToMint);

        expect(await myToken.balanceOf(deployer.address)).to.equal(balanceBefore.add(amountToMint));
        expect(await myToken.totalSupply()).to.equal(totalSupplyBefore.add(amountToMint));
    });

    it("Should mint for another user", async () => {
        const amountToMint = ethers.utils.parseEther("500000000");
        const totalSupplyBefore = await myToken.totalSupply();

        await myToken.mintFor(user1.address, amountToMint);

        expect(await myToken.balanceOf(user1.address)).to.equal(amountToMint);
        expect(await myToken.totalSupply()).to.equal(totalSupplyBefore.add(amountToMint));
    });

    it("Should not let mint user without Minter role", async () => {
        const amountToMint = ethers.utils.parseEther("500000000");
        await expect(myToken.connect(user1).mint(amountToMint)).to.be.reverted;
    });

    it("Should not let mint more than cap supply", async () => {
        const amountToMint = (await myToken.cap()).sub(await myToken.totalSupply()).add(ethers.utils.parseEther("1"));
        await expect(myToken.mint(amountToMint)).to.be.revertedWith("ERC20Capped: cap exceeded");
    });

    it("Should burn", async () => {
        const amountToBurn = ethers.utils.parseEther("500000000");
        const balanceBefore = await myToken.balanceOf(deployer.address);
        const totalSupplyBefore = await myToken.totalSupply();

        await myToken.burn(amountToBurn);

        expect(await myToken.balanceOf(deployer.address)).to.equal(balanceBefore.sub(amountToBurn));
        expect(await myToken.totalSupply()).to.equal(totalSupplyBefore.sub(amountToBurn));
    });

    it("Should burn from another user", async () => {
        const amountToBurn = ethers.utils.parseEther("250000000");
        const balanceBefore = await myToken.balanceOf(user1.address);
        const totalSupplyBefore = await myToken.totalSupply();

        await myToken.connect(user1).approve(deployer.address, amountToBurn);
        expect(await myToken.allowance(user1.address, deployer.address)).to.equal(amountToBurn);

        await myToken.burnFrom(user1.address, amountToBurn);

        expect(await myToken.allowance(user1.address, deployer.address)).to.equal(0);
        expect(await myToken.balanceOf(user1.address)).to.equal(balanceBefore.sub(amountToBurn));
        expect(await myToken.totalSupply()).to.equal(totalSupplyBefore.sub(amountToBurn));
    });

    it("Should not let burn user without Minter role", async () => {
        const amountToMint = ethers.utils.parseEther("500000000");
        await expect(myToken.connect(user1).burnFrom(deployer.address, amountToMint)).to.be.reverted;
    });
});
