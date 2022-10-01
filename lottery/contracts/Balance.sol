// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Balance {
    mapping(IERC20 => mapping(address => uint256)) balanceInTokenForAccount;

    function getBalance(IERC20 tokenAddress, address a)
        public
        view
        returns (uint256)
    {
        return balanceInTokenForAccount[tokenAddress][a];
    }

    function addTokensToBalance(IERC20 tokenAddress, uint256 deposit) external {
        address msgsender = msg.sender;
        require(tokenAddress.transferFrom(msgsender, address(this), deposit));

        balanceInTokenForAccount[tokenAddress][msgsender] += deposit;
    }

    function Withdrow(IERC20 tokenAddress, uint256 value) external {
        require(balanceInTokenForAccount[tokenAddress][msg.sender] >= value);
        require(tokenAddress.transfer(msg.sender, value));
        balanceInTokenForAccount[tokenAddress][msg.sender] -= value;
    }
}
