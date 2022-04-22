
# Sigmoid AMM
### Cricstox assignment

There are 2 contracts and 1 library used for this project. 

#### Contracts
1. SigmoidAmm.sol - The main contract that handles the price calculation for buy and sell of the ERC20 token.
2. DAI.sol - A dummy stable coin contract

#### Library
1. FixedMath.sol - This library handles fixed point math and also contains the function to calculatte the square root using the Babylonian method. 
Ref - https://github.com/decentramall/contracts


The contracts are deployed on the Rinkeby Testnet and are verified using hardhat verify functionality (using Etherscan API).
1. SigmoidAmm.sol -> https://rinkeby.etherscan.io/address/0x5f7adbE0fA325b8fFBaB1472Fb40d4F077571427#code
2. FixedMath.sol -> https://rinkeby.etherscan.io/address/0xfEE664a0FEAC497CDc97eB9d61B28AE28A0b892A#code
3. DAI.sol -> https://rinkeby.etherscan.io/address/0x63E552A86e37C754d88eb6a0453994E2F08D2071#code


To test locally make sure you run "npm install" and dev dependencies are installed
1. Clone the repo
2. run "npx hardhat test"


