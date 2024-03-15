const { expect } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");

describe("CCC contract", function() {
    // global variables 
    let CCCFactory;
    let CCC;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        // get the ContractFactory and Signers 
        CCCFactory = await ethers.getContractFactory("CCC");
        //[owner, addr1, addr2] = await hre.ethers.getSigners();
        //const [owner, addr1, addr2] = await ethers.getSigners();
        [owner, addr1, addr2] = await ethers.getSigners();

        CCC = await CCCFactory.deploy();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await CCC.owner()).to.equal(owner.address);
        });

        it("Should assign the total supply of tokens to the owner", async function() {
            const ownerBalance = await CCC.balanceOf(owner.address);
            expect(await CCC.totalSupply()).to.equal(ownerBalance);
        });
        /*
        it("Should set the max capped supply to the argument provided during deployed", async function () {
            const cap = await Rich.cap();
            expect(Number(hre.ethers.utils.formatEther(cap))).to.equal(tokenCap);
        });

        it("Should set the blockReward to the argument provided during deployment", async function () {
            const blockReward = await Rich.blockReward();
            expect(Number(hre.ethers.utils.formatEther(blockReward))).to.equal(tokenBlockReward);
        });
        */
    });

    describe("Transaction", function () {
        it("Should transfer tokens between accounts", async function () {
            // transfer 50 tokens from owner to addr1
            await CCC.transfer(addr1.address, 50);
            const addr1Balance = await CCC.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(50);

            // transfer 50 tokens from addr1 to addr2
            // we use .connect(signer) to send a transaction from another account
            await CCC.connect(addr1).transfer(addr2.address, 50);
            const addr2Balance = await CCC.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(50);
        });

        it("Should fail if sender doesn't have enough tokens", async function () {
            // Get initial balances
            const initialOwnerBalance = await CCC.balanceOf(owner.address);
            const initialAddr1Balance = await CCC.balanceOf(addr1.address); // Define initialAddr1Balance here
            
            // Log initialAddr1Balance
            console.log("Initial addr1 balance:", initialAddr1Balance.toString());
            
            // Try to send more tokens than addr1 owns to owner
            const amountToSend = initialAddr1Balance.add(ethers.BigNumber.from(1));
            
            // Use expect.revertedWith to check for revert with specific error message
            await expect(
                CCC.connect(addr1).transfer(owner.address, amountToSend)
            ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
        
            // Balances should remain unchanged
            expect(await CCC.balanceOf(owner.address)).to.equal(initialOwnerBalance);
            expect(await CCC.balanceOf(addr1.address)).to.equal(initialAddr1Balance);
        });        
        
        it("Should update balances after transfer", async function () {
            // Get initial balances
            const initialOwnerBalance = BigInt(await CCC.balanceOf(owner.address));
            const initialAddr1Balance = BigInt(await CCC.balanceOf(addr1.address));
            const initialAddr2Balance = BigInt(await CCC.balanceOf(addr2.address));
        
            // Transfer tokens
            await CCC.transfer(addr1.address, 100);
            await CCC.transfer(addr2.address, 50);
        
            // Check balances after transfers
            const finalOwnerBalance = BigInt(await CCC.balanceOf(owner.address));
            const finalAddr1Balance = BigInt(await CCC.balanceOf(addr1.address));
            const finalAddr2Balance = BigInt(await CCC.balanceOf(addr2.address));
        
            // Calculate expected final balances
            const expectedFinalOwnerBalance = initialOwnerBalance - BigInt(150);
            const expectedFinalAddr1Balance = initialAddr1Balance + BigInt(100);
            const expectedFinalAddr2Balance = initialAddr2Balance + BigInt(50);
        
            // Check if balances are updated correctly
            expect(finalOwnerBalance.toString()).to.equal(expectedFinalOwnerBalance.toString());
            expect(finalAddr1Balance.toString()).to.equal(expectedFinalAddr1Balance.toString());
            expect(finalAddr2Balance.toString()).to.equal(expectedFinalAddr2Balance.toString());
        });        
    });
});

/*
console.log("Initial balance of addr1:", initialAddr1Balance.toString());
console.log(typeof initialAddr1Balance);
*/