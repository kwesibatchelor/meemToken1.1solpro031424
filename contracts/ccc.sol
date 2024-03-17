// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract CCC is ERC20, ERC20Burnable {
    address payable public owner;
    constructor() ERC20("CCC", "CCC") {
        owner = payable(msg.sender);
        _mint(owner, 80000000 * (10 ** decimals()));
    }
    
    // function to destroy token
    function destroy() public onlyOwner {
        selfdestruct(owner);
    }
    
    modifier onlyOwner {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }
}