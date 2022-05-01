// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC721with.sol";
import "./Lottery.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MudebzNFT is ERC721with, Ownable {
    Lottery immutable lottery;
    uint256 public constant nftPrice = 32; // 32 * (10**15); //0.032WETH 32000000000000000 wei

    event NewNFT(address owner, uint256 tokenId);

    constructor(Lottery _lottery) ERC721("MudeBz", "MudeBz") {
        lottery = _lottery;
    }

    function MintMarten(uint256 TokenId) public payable {
        address msgsender = msg.sender;
        require(
            lottery._findAddressInfirst1000Winers(msgsender, TokenId),
            "Not yours token"
        );
        require(msg.value == nftPrice, "Wrong send value");

        _safeMint(msgsender, TokenId);
        setTokenMints(TokenId);

        if (!_addressHowOwnedNFT[msgsender]) {
            _addressHowOwnedNFT[msgsender] = true;
            addressHowOwnedNFT.push(msgsender);
        }
        emit NewNFT(msg.sender, TokenId);
    }

    function withdrow(address payable _to) external onlyOwner {
        _to.transfer(address(this).balance);
    }

    function _baseURI() internal view override returns (string memory) {
        return "";
    }
}
