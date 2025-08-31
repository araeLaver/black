const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FREEAI Token", function () {
    let FreeAIToken;
    let freeai;
    let owner;
    let dev;
    let addr1;
    let addr2;
    let addrs;

    const TOTAL_SUPPLY = ethers.utils.parseEther("1000000000"); // 1B tokens

    beforeEach(async function () {
        [owner, dev, addr1, addr2, ...addrs] = await ethers.getSigners();

        FreeAIToken = await ethers.getContractFactory("FreeAIToken");
        freeai = await FreeAIToken.deploy(dev.address);
        await freeai.deployed();
    });

    describe("Deployment", function () {
        it("Should set the right name and symbol", async function () {
            expect(await freeai.name()).to.equal("Free AI Token");
            expect(await freeai.symbol()).to.equal("FREEAI");
        });

        it("Should set the right total supply", async function () {
            const totalSupply = await freeai.totalSupply();
            expect(totalSupply).to.equal(TOTAL_SUPPLY);
        });

        it("Should assign correct initial balances", async function () {
            const ownerBalance = await freeai.balanceOf(owner.address);
            const devBalance = await freeai.balanceOf(dev.address);
            
            // Owner gets 95% (airdrop + liquidity + marketing)
            const expectedOwnerBalance = TOTAL_SUPPLY.mul(95).div(100);
            expect(ownerBalance).to.equal(expectedOwnerBalance);
            
            // Dev gets 5%
            const expectedDevBalance = TOTAL_SUPPLY.mul(5).div(100);
            expect(devBalance).to.equal(expectedDevBalance);
        });

        it("Should set the right dev wallet", async function () {
            expect(await freeai.devWallet()).to.equal(dev.address);
        });

        it("Should exclude owner and dev from fees", async function () {
            expect(await freeai.isExcludedFromFees(owner.address)).to.equal(true);
            expect(await freeai.isExcludedFromFees(dev.address)).to.equal(true);
        });
    });

    describe("Trading Control", function () {
        it("Should start with trading disabled", async function () {
            expect(await freeai.tradingEnabled()).to.equal(false);
        });

        it("Should allow owner to enable trading", async function () {
            await freeai.enableTrading();
            expect(await freeai.tradingEnabled()).to.equal(true);
        });

        it("Should not allow enabling trading twice", async function () {
            await freeai.enableTrading();
            await expect(freeai.enableTrading()).to.be.revertedWith("Trading already enabled");
        });

        it("Should prevent normal transfers when trading is disabled", async function () {
            const transferAmount = ethers.utils.parseEther("1000");
            
            // Transfer from owner to addr1 (should work - owner excluded)
            await freeai.transfer(addr1.address, transferAmount);
            
            // Transfer from addr1 to addr2 (should fail - trading disabled)
            await expect(
                freeai.connect(addr1).transfer(addr2.address, transferAmount)
            ).to.be.revertedWith("Trading not enabled");
        });
    });

    describe("Fees", function () {
        beforeEach(async function () {
            await freeai.enableTrading();
            
            // Set up a mock AMM pair
            await freeai.setAutomatedMarketMakerPair(addr2.address, true);
        });

        it("Should charge buy fees when buying from AMM", async function () {
            const transferAmount = ethers.utils.parseEther("1000");
            
            // Give the AMM pair (addr2) some tokens first
            await freeai.transfer(addr2.address, transferAmount.mul(2));
            
            const initialDevBalance = await freeai.balanceOf(dev.address);
            
            // Simulate buy: transfer from AMM pair (addr2) to addr1
            await freeai.connect(addr2).transfer(addr1.address, transferAmount);
            
            // Check if dev wallet received fees
            const finalDevBalance = await freeai.balanceOf(dev.address);
            
            expect(finalDevBalance).to.be.gt(initialDevBalance);
        });

        it("Should update fees correctly", async function () {
            const newBuyFee = 200; // 2%
            const newSellFee = 300; // 3%
            
            await freeai.updateFees(newBuyFee, newSellFee);
            
            expect(await freeai.buyFee()).to.equal(newBuyFee);
            expect(await freeai.sellFee()).to.equal(newSellFee);
        });

        it("Should not allow fees higher than maximum", async function () {
            const tooHighFee = 600; // 6% (max is 5%)
            
            await expect(
                freeai.updateFees(tooHighFee, 100)
            ).to.be.revertedWith("Fees too high");
        });
    });

    describe("Airdrop Functions", function () {
        it("Should allow bulk airdrop", async function () {
            const recipients = [addr1.address, addr2.address];
            const amount = ethers.utils.parseEther("10000");
            
            await freeai.bulkAirdrop(recipients, amount);
            
            expect(await freeai.balanceOf(addr1.address)).to.equal(amount);
            expect(await freeai.balanceOf(addr2.address)).to.equal(amount);
        });

        it("Should allow individual airdrop amounts", async function () {
            const recipients = [addr1.address, addr2.address];
            const amounts = [
                ethers.utils.parseEther("5000"),
                ethers.utils.parseEther("10000")
            ];
            
            await freeai.airdrop(recipients, amounts);
            
            expect(await freeai.balanceOf(addr1.address)).to.equal(amounts[0]);
            expect(await freeai.balanceOf(addr2.address)).to.equal(amounts[1]);
        });

        it("Should only allow owner to perform airdrops", async function () {
            const recipients = [addr1.address];
            const amount = ethers.utils.parseEther("1000");
            
            await expect(
                freeai.connect(addr1).bulkAirdrop(recipients, amount)
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });

    describe("Anti-whale Limits", function () {
        beforeEach(async function () {
            await freeai.enableTrading();
            await freeai.setAutomatedMarketMakerPair(addr2.address, true);
        });

        it("Should enforce max wallet limit", async function () {
            const maxWallet = await freeai.maxWalletAmount();
            
            // Give addr1 some tokens first
            await freeai.transfer(addr1.address, maxWallet.div(2));
            
            // Try to transfer from addr1 to addr2 (this should trigger wallet limit check)
            // First give addr1 enough to make the transfer
            await freeai.transfer(addr1.address, maxWallet.div(2));
            
            // Now try to transfer more than maxWallet to addr2
            await expect(
                freeai.connect(addr1).transfer(addr2.address, maxWallet.add(ethers.utils.parseEther("1")))
            ).to.be.revertedWith("Transfer amount exceeds limit");
        });

        it("Should allow removing limits", async function () {
            await freeai.removeLimits();
            
            expect(await freeai.maxWalletAmount()).to.equal(TOTAL_SUPPLY);
            expect(await freeai.maxTransactionAmount()).to.equal(TOTAL_SUPPLY);
        });
    });

    describe("Token Burning", function () {
        it("Should burn tokens and reduce total supply", async function () {
            const burnAmount = ethers.utils.parseEther("1000000");
            const initialSupply = await freeai.totalSupply();
            
            await freeai.burn(burnAmount);
            
            const newSupply = await freeai.totalSupply();
            expect(newSupply).to.equal(initialSupply.sub(burnAmount));
        });
    });

    describe("Utility Functions", function () {
        it("Should calculate circulating supply correctly", async function () {
            const deadAddress = "0x000000000000000000000000000000000000dEaD";
            const burnAmount = ethers.utils.parseEther("1000000");
            
            // Burn some tokens
            await freeai.transfer(deadAddress, burnAmount);
            
            const circulatingSupply = await freeai.getCirculatingSupply();
            const expectedCirculating = TOTAL_SUPPLY.sub(burnAmount);
            
            expect(circulatingSupply).to.equal(expectedCirculating);
        });
    });

    describe("Admin Functions", function () {
        it("Should allow updating dev wallet", async function () {
            await freeai.updateDevWallet(addr1.address);
            
            expect(await freeai.devWallet()).to.equal(addr1.address);
            expect(await freeai.isExcludedFromFees(addr1.address)).to.equal(true);
        });

        it("Should not allow zero address as dev wallet", async function () {
            await expect(
                freeai.updateDevWallet(ethers.constants.AddressZero)
            ).to.be.revertedWith("Invalid address");
        });
    });
});