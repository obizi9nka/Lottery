// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC721with.sol";
import "./Lottery.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MudebzNFT is ERC721with, Ownable {
    Lottery immutable lottery;
    uint256 public constant nftPrice = 32 * (10**15); //0.032ETH 32000000000000000 wei

    event NewNFT(address owner, uint256 tokenId);

    uint256[] private tokensMints;

    function gettokensMints() public view returns (uint256[] memory) {
        return tokensMints;
    }

    constructor(Lottery _lottery) ERC721("MudeBz", "MudeBz") {
        lottery = _lottery;
    }

    function MintMarten(uint256 TokenId) public payable {
        address msgsender = msg.sender;
        require(
            lottery._findAddressInfirst1000Winers(msgsender, TokenId),
            "Not yours token"
        );
        require(msg.value >= nftPrice, "Wrong send value");

        _safeMint(msgsender, TokenId);
        setTokenMints(TokenId);

        if (!_addressHowOwnedNFT[msgsender]) {
            _addressHowOwnedNFT[msgsender] = true;
            addressHowOwnedNFT.push(msgsender);
        }

        TokensOwns[msgsender].ids.push(TokenId);
        tokensMints.push(TokenId);
        //if (tokensMints.length >= 2) sort(TokenId);

        emit NewNFT(msg.sender, TokenId);
    }

    function withdrow(address payable _to) external onlyOwner {
        _to.transfer(address(this).balance);
    }

    function _baseURI() internal view override returns (string memory) {
        return "";
    }

    // MarketPlace

    mapping(address => mapping(uint256 => uint256)) tokenOnSell;

    function getCost(address tokenOwner, uint256 tokenId)
        public
        view
        returns (uint256)
    {
        return tokenOnSell[tokenOwner][tokenId];
    }

    function putOnSell(uint256 tokenId, uint256 cost) external {
        require(ownerOf(tokenId) == msg.sender && cost > 0, "not your token");
        require(tokenOnSell[msg.sender][tokenId] == 0, "token already on sell");
        tokenOnSell[msg.sender][tokenId] = cost;
    }

    function removeFromSell(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "not your token");
        tokenOnSell[msg.sender][tokenId] = 0;
    }

    function trigerSell(address payable tokenOwner, uint256 tokenId)
        external
        payable
    {
        require(
            msg.value >= tokenOnSell[tokenOwner][tokenId],
            "not enogth value"
        );
        tokenOwner.transfer(tokenOnSell[tokenOwner][tokenId]);
        tokenOnSell[tokenOwner][tokenId] = 0;
        _transfer(tokenOwner, msg.sender, tokenId);
    }

    /*
    function sort(uint256 TokenId) private {
        uint256 last = tokensMints[tokensMints.length - 2];
        bool flag = false;
        for (uint256 i = 0; i < tokensMints.length; i++) {
            if (tokensMints[i] > TokenId) {
                flag = true;
                uint256 temp = tokensMints[i];
                uint256 temp1;
                tokensMints[i] = TokenId;
                for (uint256 j = i; j < tokensMints.length - 1; j++) {
                    temp1 = tokensMints[j + 1];
                    tokensMints[j + 1] = temp;
                    temp = temp1;
                }
                break;
            }
        }
        if (flag) tokensMints[tokensMints.length - 1] = last;
    }
*/
}
