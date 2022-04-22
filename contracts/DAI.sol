//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


// This is just a test contract to get DAI. It doesn't need to be perfect/secure

contract DAI is ERC20 {

    constructor() ERC20("DAI", "DAI"){
        _mint(msg.sender, 1000 * (10 ** uint256(decimals())));
    }

    function getSupply() public view returns (uint) {
        return totalSupply();
    }

}