// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Balance {
    event balance(IERC20 token, address user, int256 value);

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
        require(
            tokenAddress.transferFrom(msgsender, address(this), deposit),
            "TransferFrom faild"
        );

        balanceInTokenForAccount[tokenAddress][msgsender] += deposit;
        emit balance(tokenAddress, msg.sender, int256(deposit));
    }

    function Withdrow(IERC20 tokenAddress, uint256 value) external {
        require(balanceInTokenForAccount[tokenAddress][msg.sender] >= value);
        require(tokenAddress.transfer(msg.sender, value));

        int256 _value = int256(value) * (-1);

        balanceInTokenForAccount[tokenAddress][msg.sender] -= value;
        emit balance(tokenAddress, msg.sender, _value);
    }
}
