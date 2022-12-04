// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SoulBoundToken is ERC1155, ERC1155Burnable, Ownable {
    address public signerSystem;
    mapping(address => mapping(uint256 => uint256)) private lastTimeMinted;

    string baseUri = "ipfs://QmeodfenF3vkMXSD4LWs1GXs88FqVk3FDt5atzgdRrmx8Z/";

    constructor(address _signer) ERC1155("") {
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

        (uint256 tokenId, address minter) = abi.decode(
            message,
            (uint256, address)
        );
        if (balanceOf(minter, tokenId) == 0) {
            _mint(minter, tokenId, 1, "");
        }
        lastTimeMinted[minter][tokenId] = block.timestamp;
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

    function burn(uint256 tokenId, uint256 amount) external {
        require(
            balanceOf(msg.sender, tokenId) >= amount,
            "SoulBoundToken: Insufficient balance"
        );
        _burn(msg.sender, tokenId, amount);
    }

    function setURI(string memory newUri) public onlyOwner {
        baseUri = newUri;
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(baseUri, "1", ".json"));
    }

    function _beforeTokenTransfer(
        address /*operator*/,
        address from,
        address to,
        uint256[] memory /*ids*/,
        uint256[] memory /*amounts*/,
        bytes memory /*data*/
    ) internal pure override {
        require(
            from == address(0) || to == address(0),
            "SoulBoundToken: Cannot transfer tokens"
        );
    }

    function getLastTimeMinted(
        address minter,
        uint256 tokenId
    ) external view returns (uint256) {
        return lastTimeMinted[minter][tokenId];
    }
}
