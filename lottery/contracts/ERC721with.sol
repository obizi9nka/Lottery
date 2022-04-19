// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

abstract contract ERC721with is ERC721 {
    // Mapping from token ID to owner address
    mapping(uint256 => address) private _owners;

    // Mapping owner address to token count
    mapping(address => uint256) private _balances;

    mapping(uint256 => bool) _istokenMints;

    mapping(address => bool) internal _addressHowOwnedNFT;

    address[] public addressHowOwnedNFT;

    function istokenMints(uint256 TokenId) public view returns (bool) {
        return _istokenMints[TokenId];
    }

    function setTokenMints(uint256 TokenId) internal {
        _istokenMints[TokenId] = true;
    }

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

        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;

        if (!_addressHowOwnedNFT[to]) {
            _addressHowOwnedNFT[to] = true;
            addressHowOwnedNFT.push(to);
        }

        emit Transfer(from, to, tokenId);

        _afterTokenTransfer(from, to, tokenId);
    }
}
