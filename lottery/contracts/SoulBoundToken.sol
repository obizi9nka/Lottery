// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SoulBoundToken is ERC1155, ERC1155Burnable, Ownable {
    uint256 public constant BRONZE = 1;
    uint256 public constant SILVER = 2;
    uint256 public constant GOLD = 3;

    address public signerSystem;

    constructor(address _signer) ERC1155("SoulBound") {
        signerSystem = _signer;
    }

    function mint(
        bytes calldata message,
        bytes32 _hash,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) public {
        require(
            verify(message, _hash, _v, _r, _s),
            "SoulBoundToken: Invalid signature"
        );

        (uint256 id, address minter) = abi.decode(message, (uint256, address));
        _mint(minter, id, 1, "");
    }

    function verify(
        bytes calldata message,
        bytes32 _hash,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) public view returns (bool result) {
        require(
            _hash == keccak256(message),
            "SoulBoundToken: invalid hash provided"
        );

        // require();
        bytes32 messageDigest = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", _hash)
        );
        return (signerSystem == ecrecover(messageDigest, _v, _r, _s));
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }
}
