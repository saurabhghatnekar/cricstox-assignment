/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

// Possible network values
const TEST_NETWORK = "TEST_NETWORK"
const LOCAL_NETWORK = "LOCAL_NETWORK"

// By default network is set to local, change it to TEST_NETWORK to make a switch
const NETWORK = "TEST_NETWORK"

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;

let networks = {};
let etherscan = {};

if (NETWORK === TEST_NETWORK) {
    networks = {
        rinkeby: {
            url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
            accounts: [`${WALLET_PRIVATE_KEY}`]
        }
    }
    etherscan = {
        apiKey: process.env.ETHERSCAN_API_KEY
    }
}

module.exports = {
    solidity: "0.8.1",
    networks: networks,
    etherscan: etherscan
};


// FixedMath deployed to 0xfEE664a0FEAC497CDc97eB9d61B28AE28A0b892A
// DAI deployed to 0x63E552A86e37C754d88eb6a0453994E2F08D2071
// SigmoidAmm deployed to 0x5f7adbE0fA325b8fFBaB1472Fb40d4F077571427
