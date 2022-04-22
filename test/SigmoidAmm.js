const {expect, use} = require("chai");
const {BigNumber, ethers} = require("hardhat");
const {solidity} = require('ethereum-waffle');
const {parseEther} = require("ethers/lib/utils");
const {utils} = require("ethers");
use(solidity);

describe("SigmoidAmm", () => {

    let owner, account1, account2, account3;
    let SigmoidAmmInstance, DaiInstance;
    beforeEach(async () => {
        // Get the accounts
        [owner, account1, account2, account3] = await ethers.getSigners();

        // Get the contract instance
        const FixedMath = await ethers.getContractFactory("FixedMath");
        const FixedMathInstance = await FixedMath.deploy();
        console.log("FixedMath deployed to", FixedMathInstance.address);
        const Decentramall = await ethers.getContractFactory("SigmoidAmm", {
            libraries: {
                FixedMath: FixedMathInstance.address,
            },
        });

        const DAI = await ethers.getContractFactory("DAI");

        DaiInstance = await DAI.deploy();
        SigmoidAmmInstance = await Decentramall.deploy(DaiInstance.address);
        // console.log("DAI Supply", await DaiInstance.getSupply());
        await DaiInstance.connect(account1).approve(SigmoidAmmInstance.address, ethers.constants.MaxUint256);
        await DaiInstance.connect(account2).approve(SigmoidAmmInstance.address, ethers.constants.MaxUint256);
        await DaiInstance.transfer(account1.address, parseEther("100"));
        // console.log("DAI Supply", await DaiInstance.getSupply());
        // console.log(await DaiInstance.balanceOf(account1.address));
    });
    it("check price", async () => {
        // Get the contract instance
        const currentPrice = await SigmoidAmmInstance.getCurrentPrice();
        console.log("estimated price", utils.formatEther(currentPrice));
        const estimatedPrice = await SigmoidAmmInstance.getEstimatedPrice(2);
        console.log("estimated price", utils.formatEther(estimatedPrice));
        const tx = await SigmoidAmmInstance.connect(account1).buy(2);
        // console.log(tx);

        for (let i = 1; i < 5; i++) {
            let currentSupply = await SigmoidAmmInstance.getCurrentSupply();
            console.log(i, "current supply", currentSupply);
            // console.log("\n");
            let currentPrice = await SigmoidAmmInstance.getCurrentPrice();
            console.log(i, "estimated price", utils.formatEther(currentPrice));
            // console.log("\n");
            let tx = await SigmoidAmmInstance.connect(account1).buy(i * 50);
            console.log("DAI bal", await DaiInstance.balanceOf(SigmoidAmmInstance.address));
            // console.log(tx);
            currentSupply = await SigmoidAmmInstance.getCurrentSupply();
            console.log(i, "current supply", currentSupply);
            console.log(i, "end","\n");
        }

        for (let i = 1; i < 3; i++) {

            let currentSupply = await SigmoidAmmInstance.getCurrentSupply();
            console.log(i, "current supply", currentSupply);
            // console.log("\n");
            let currentPrice = await SigmoidAmmInstance.getCurrentPrice();

            console.log(i, "estimated price", utils.formatEther(currentPrice));
            console.log("DAI bal", await DaiInstance.balanceOf(SigmoidAmmInstance.address));
            // console.log("\n");
            let tx = await SigmoidAmmInstance.connect(account1).sell(i * 50);
            // console.log(tx);
            console.log(i, "end","\n");
        }


    });
});