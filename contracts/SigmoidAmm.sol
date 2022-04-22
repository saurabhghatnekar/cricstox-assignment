//SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { FixedMath } from "./FixedMath.sol";

import "hardhat/console.sol";


contract SigmoidAmm is  ERC20 {
    using FixedMath for int256;

    //Max limit of tokens to be minted
    int256 public currentLimit;
    //Midpoint for price function
    int256 public a;
    //Half of max price 
    int256 public b;
    //Steepness
    int256 public c;

    // DAI contract address
    address public dai;

    // admin address
    address public admin;

    modifier isAdmin{
        require(msg.sender == admin, "ADMIN: Not allowed!");
        _;
    }

    event Buy(address buyer, uint256 amount, uint256 price);
    event Sell(address seller, uint256 amount, uint256 price);
    event ChangeDai(address newDai);
    event ChangeAdmin(address newAdmin);

    constructor(
        address _dai
    ) public ERC20("CLAW", "CLAW"){
        currentLimit = 1000;
        a = 100;
        b = 600;
        c = 12000;
        dai = _dai;
        admin = msg.sender;
        IERC20(dai).approve(address(this), uint256(currentLimit));
    }

    /**
     * @dev Get price of next token
     * @param x the position on the curve to check
     * Assuming current bonding curve function of 
     * y = maxPrice/2(( x - midpoint )/sqrt(steepness + (x - midpoint)^2) + 1)
     * In other words, a Sigmoid function
     * Note that we divide back by 10^30 because 10^24 * 10^24 = 10^48 and most ERC20 is in 10^18
     * @return price at the specific position in bonding curve
     */
    function price(uint256 x) public view returns(uint256){
        int256 numerator = int256(x) - b;
        int256 innerSqrt = (c + (numerator)**2);
        int256 fixedInner = innerSqrt.toFixed();
        int256 fixedDenominator = fixedInner.sqrt();
        int256 fixedNumerator = numerator.toFixed();
        int256 midVal = fixedNumerator.divide(fixedDenominator) + 1000000000000000000000000;
        int256 fixedFinal = a.toFixed() * midVal;
        return uint256(fixedFinal / 1000000000000000000000000000000);
    }

    function getEstimatedPrice( uint256 _amount) public view returns(uint256){
        uint256 currentSupply = totalSupply();
        console.log("getEstimatedPrice Current supply: " , currentSupply);
        uint256 price = price(currentSupply);
        uint256 totalPrice = price * _amount;
        return totalPrice;
    }

    function getCurrentPrice() public view returns(uint256){
        uint256 currentSupply = totalSupply();
        return price(currentSupply);

    }

    function getCurrentSupply() public view returns(uint256){
        return totalSupply();
    }

    /**
     * @dev Buy SPACE
     * @notice Cannot buy space if already renter
     */
    function buy(uint256 _amount) public {

        uint256 currentSupply = totalSupply();
        uint256 currentPrice = price(currentSupply);
        uint256 estimatedPrice = currentPrice*_amount/1000000000000000000;
        require(currentSupply+_amount < uint256(currentLimit), "BUY: Max Supply Reached!");
        IERC20(dai).transferFrom(msg.sender, address(this), estimatedPrice);

        _mint(msg.sender, _amount);
        emit Buy(msg.sender, _amount, estimatedPrice);
    }

    /**
     * @dev Sell SPACE
     * @notice Disabling the ability to sell other people's SPACE prevents a hacker from selling stolen SPACE
     */
    function sell(uint256 _amount) public {

        uint256 quotedPrice = price(totalSupply()-_amount)*_amount/1000000000000000000;
        _burn(msg.sender,_amount);
        IERC20(dai).transfer(msg.sender, quotedPrice);
        emit Sell(msg.sender, _amount, quotedPrice);
    }

    /**
     * @dev Change DAI address
     * @param newDai new address
     **/
    function changeDaiAddress(address newDai) public isAdmin{
        dai = newDai;
        emit ChangeDai(newDai);
    }

    /**
     * @dev Change admin
     * @param newAdmin new address
     **/
    function changeAdmin(address newAdmin) public isAdmin{
        admin = newAdmin;
        emit ChangeAdmin(newAdmin);
    }
}