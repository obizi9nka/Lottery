// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

abstract contract ERC721with is ERC721 {
    ///IMPORTANT
    // я переопределил в опензепеленском контракте два маппинга:
    //              ДО
    // Mapping from token ID to owner address
    // mapping(uint256 => address) private _owners;

    //  Mapping owner address to token count
    // mapping(address => uint256) private _balances;

    //              ПОСЛЕ
    // Mapping from token ID to owner address
    // mapping(uint256 => address) INTERNAL _owners;

    //  Mapping owner address to token count
    // mapping(address => uint256) INTERNAL _balances;

    mapping(uint256 => bool) _istokenMints;

    mapping(address => bool) internal _addressHowOwnedNFT;

    address[] internal addressHowOwnedNFT;

    function getaddressHowOwnedNFT() public view returns (address[] memory) {
        return addressHowOwnedNFT;
    }

    function isOwnedEver(address a) public view returns (bool) {
        return _addressHowOwnedNFT[a];
    }

    struct Owns {
        uint256[] ids;
        uint8 doNotUse;
    }

    mapping(address => Owns) internal TokensOwns;

    function getTokensForAddress(address adres)
        public
        view
        returns (Owns memory)
    {
        return TokensOwns[adres];
    }

    function istokenMints(uint256 TokenId) public view returns (bool) {
        return _istokenMints[TokenId];
    }

    function setTokenMints(uint256 TokenId) internal {
        _istokenMints[TokenId] = true;
    }

    uint256[] internal tokensMints;

    function gettokensMints() public view returns (uint256[] memory) {
        return tokensMints;
    }

    mapping(uint256 => uint256) internal tokenTransfer; //для каждой nft только 100 перемещений с возможностью последующего айрдропа

    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        require(
            ERC721.ownerOf(tokenId) == from,
            "ERC721: transfer from incorrect owner"
        );
        require(to != address(0), "ERC721: transfer to the zero address");

        _beforeTokenTransfer(from, to, tokenId);

        // Clear approvals from the previous owner
        _approve(address(0), tokenId);

        //знать какими токенами владют адреса...

        uint256[] storage array = TokensOwns[from].ids;
        uint256 stop = array.length;

        for (uint256 i = 0; i < stop; i++) {
            if (array[i] == tokenId) {
                if (stop == 1) {
                    array.pop();
                } else {
                    for (uint256 index = i; index < array.length - 1; index++) {
                        array[index] = array[index + 1];
                    }
                    array.pop(); //может быть лишним
                }
                break;
            }
        }

        TokensOwns[to].ids.push(tokenId);

        //дальше основное

        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;

        if (tokenTransfer[tokenId] < 100 && !_addressHowOwnedNFT[to]) {
            tokenTransfer[tokenId]++;
            _addressHowOwnedNFT[to] = true;
            addressHowOwnedNFT.push(to);
        }

        emit Transfer(from, to, tokenId);

        _afterTokenTransfer(from, to, tokenId);
    }
}
