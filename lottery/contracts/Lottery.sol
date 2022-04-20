// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
//1100000000000000000

import "./Lobby.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./ERC721with.sol";

contract Lottery is Lobby, Ownable {
    struct LotteryShablon {
        address winer;
        address[] players;
        uint256 playersCount;
    }

    event enter(address user);
    event play(address winer);

    uint256 LotteryCount = 1;

    mapping(uint256 => LotteryShablon) Lotteries;

    mapping(uint256 => address) first1000Winers;

    uint256 deposit = 10;

    IERC20 tokenForLottery;
    ERC721with NFT;

    constructor(IERC20 _tokenForLottery) {
        tokenForLottery = _tokenForLottery;
        Lotteries[1].playersCount = 0;
        Lotteries[1].winer = address(0);
    }

    function getLotteryCount() public view returns (uint256) {
        return LotteryCount;
    }

    function setTokenForLottery(IERC20 token) public onlyOwner {
        tokenForLottery = token;
    }

    function setAdrressNFT(ERC721with token) public onlyOwner {
        NFT = token;
    }

    function getTokenForLottery() public view returns (address) {
        return address(tokenForLottery);
    }

    function getAdrressNFT() public view returns (address) {
        return address(NFT);
    }

    function checkFor50() private {
        if (!NFT.istokenMints(LotteryCount - 5)) {
            first1000Winers[LotteryCount - 5] = owner();
        }
    }

    function allowToNFT(uint256 TokenId) public view returns (address) {
        return first1000Winers[TokenId];
    }

    function changeAllowToMint(address newAddress, uint256 TokenId)
        public
        onlyOwner
    {
        require(first1000Winers[TokenId] == msg.sender, "not yours NFT");
        first1000Winers[TokenId] = newAddress;
    }

    function Enter() external {
        require(
            (getBalance(tokenForLottery, msg.sender)) >= deposit &&
                !findAddressInPlayers(msg.sender)
        );

        balanceInTokenForAccount[tokenForLottery][msg.sender] -= deposit;

        Lotteries[LotteryCount].players.push(msg.sender);
        Lotteries[LotteryCount].playersCount++;

        emit enter(msg.sender);
    }

    function _findAddressInfirst1000Winers(address a, uint256 TokenId)
        public
        view
        returns (bool)
    {
        if (first1000Winers[TokenId] == a) return true;
        return false;
    }

    function findAddressInPlayers(address _a) public view returns (bool) {
        LotteryShablon memory temp = Lotteries[LotteryCount];

        for (uint256 i = 0; i < temp.playersCount; i++) {
            if (temp.players[i] == _a) return true;
        }
        return false;
    }

    function Play() public onlyOwner {
        address winer;

        if (Lotteries[LotteryCount].playersCount == 0) winer == owner();
        else {
            uint256 tryRandom = getRandNumber(
                Lotteries[LotteryCount].playersCount
            );
            winer = Lotteries[LotteryCount].players[tryRandom];
        }

        if (LotteryCount <= 1000) {
            first1000Winers[LotteryCount] = winer;
        }

        balanceInTokenForAccount[tokenForLottery][winer] +=
            deposit *
            Lotteries[LotteryCount].playersCount;

        Lotteries[LotteryCount].winer = winer;
        if (LotteryCount >= 5 && LotteryCount <= 1002) checkFor50();
        Lotteries[++LotteryCount].playersCount = 0;
        Lotteries[LotteryCount].winer = address(0);
        emit play(winer);
    }

    function getPlayerByIndex(uint256 index) public view returns (address) {
        if (Lotteries[LotteryCount].playersCount - 1 < index) return address(0);
        return Lotteries[LotteryCount].players[index];
    }

    function getLotteryShablonByIndex(uint256 lotteryId)
        external
        view
        returns (LotteryShablon memory)
    {
        return Lotteries[lotteryId];
    }
}
