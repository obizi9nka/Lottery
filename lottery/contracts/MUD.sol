// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./BridgeBase.sol";

contract MUD is ERC20 {
    address admin;
    bool isPaused = true;

    address immutable Lottery;
    address signerSystem;

    constructor(address lottery) ERC20("!Mudebz", "MUD") {
        Lottery = lottery;
        admin = msg.sender;
    }

    function _mintFromLottery(address a, uint256 value) public returns (bool) {
        require(msg.sender == Lottery);
        uint balanceBefore = balanceOf(a);
        _mint(a, value);
        uint balanceAfter = balanceOf(a);
        return balanceBefore + value == balanceAfter;
    }

    function verify(
        bytes calldata message,
        bytes32 _hash,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) public view returns (bool result) {
        require(_hash == keccak256(message), "Invalid hash provided");

        // require();
        bytes32 messageDigest = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", _hash)
        );
        return (signerSystem == ecrecover(messageDigest, _v, _r, _s));
    }

    function getTokens(uint256 b) public {
        _mint(msg.sender, b);
    }

    //BRIDGE

    function setPause() public {
        require(msg.sender == admin);
        isPaused = !isPaused;
    }

    mapping(address => mapping(uint256 => bool)) processedNonces;

    enum Step {
        Burn,
        Mint
    }
    event TransferThroughtSpace(
        address from,
        address to,
        uint256 amount,
        uint256 date,
        uint256 nonce,
        bytes signature,
        Step indexed step
    );

    function burn(
        address to,
        uint256 amount,
        uint256 nonce,
        bytes calldata signature
    ) external {
        require(!isPaused, "function on weekend");
        require(
            processedNonces[msg.sender][nonce] == false,
            "transfer already processed"
        );
        processedNonces[msg.sender][nonce] = true;
        _burn(msg.sender, amount);
        emit TransferThroughtSpace(
            msg.sender,
            to,
            amount,
            block.timestamp,
            nonce,
            signature,
            Step.Burn
        );
    }

    function mint(
        address from,
        address to,
        uint256 amount,
        uint256 nonce,
        bytes calldata signature
    ) external {
        require(!isPaused, "function on weekend");
        bytes32 message = prefixed(
            keccak256(abi.encodePacked(from, to, amount, nonce))
        );
        require(recoverSigner(message, signature) == from, "wrong signature");
        require(
            processedNonces[from][nonce] == false,
            "transfer already processed"
        );
        processedNonces[from][nonce] = true;
        _mint(to, amount);
        emit TransferThroughtSpace(
            from,
            to,
            amount,
            block.timestamp,
            nonce,
            signature,
            Step.Mint
        );
    }

    function prefixed(bytes32 hash) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)
            );
    }

    function recoverSigner(
        bytes32 message,
        bytes memory sig
    ) internal pure returns (address) {
        uint8 v;
        bytes32 r;
        bytes32 s;

        (v, r, s) = splitSignature(sig);

        return ecrecover(message, v, r, s);
    }

    function splitSignature(
        bytes memory sig
    ) internal pure returns (uint8, bytes32, bytes32) {
        require(sig.length == 65);

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }

        return (v, r, s);
    }
}
