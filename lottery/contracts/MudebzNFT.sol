// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC721with.sol";
import "./Lottery.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MudebzNFT is ERC721with, Ownable {
    IERC20 WETH;
    Lottery immutable lottery;
    uint256 public constant nftPrice = 32; // 32 * (10**15); //0.032WETH 32000000000000000 wei

    event NewNFT(address owner, uint256 tokenId);

    constructor(Lottery _lottery, IERC20 weth) ERC721("MudeBz", "MudeBz") {
        WETH = weth;
        lottery = _lottery;
    }

    function MintMarten(uint256 TokenId) public {
        address msgsender = msg.sender;
        require(
            lottery._findAddressInfirst1000Winers(msgsender, TokenId),
            "That is not yours token"
        );
        require(
            WETH.transferFrom(msgsender, address(this), nftPrice),
            "TransferFrom faild"
        );
        _safeMint(msgsender, TokenId);
        setTokenMints(TokenId);

        if (!_addressHowOwnedNFT[msgsender]) {
            _addressHowOwnedNFT[msgsender] = true;
            addressHowOwnedNFT.push(msgsender);
        }
        emit NewNFT(msg.sender, TokenId);
    }

    function withdrow() public {
        WETH.transfer(msg.sender, WETH.balanceOf(address(this)));
    }
}
