// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
//1100000000000000000

import "./Lobby.sol";

import "./ERC721with.sol";

contract Lottery is Lobby {
    struct LotteryShablon {
        address winer;
        address[] players;
        uint256 playersCount;
    }

    struct wins {
        uint256[] lotteryes;
        uint8 dont_use;
    }

    struct PromShablon {
        bytes32 PromSet;
        bytes32 PromInput;
    }

    struct AUTOENTER {
        uint256[] lotteryes;
        uint8 dont_use;
    }

    event enter(address user);
    event play(uint id, address winer);
    event mistery(address genius, string _string);

    mapping(uint256 => LotteryShablon) Lotteries;

    mapping(uint256 => address) first1000Winers;

    mapping(address => wins) _first1000Winers;

    mapping(address => AUTOENTER) autoEnter;

    mapping(address => uint256) countOfLotteryEnter;

    mapping(address => PromShablon) Prom;

    mapping(bytes32 => address) PromSetReverse;

    mapping(address => uint) allowTryMistery;

    bytes32 immutable Mistery;

    uint256 deposit;
    IERC20 tokenForLottery;
    address autotask;
    uint256 REVARD_REF_ALLOW = REVARD_REF;

    constructor(bytes32 Hash) {
        Mistery = Hash;
    }

    function tryMistery(string memory _string) public {
        require(
            allowTryMistery[msg.sender] + 3600000 < block.timestamp,
            "Time"
        );
        require(REVARD_GENIUS > 0, "prize lost");
        allowTryMistery[msg.sender] = block.timestamp;
        if (Mistery == keccak256(abi.encodePacked(_string))) {
            shouldRevard[msg.sender] += REVARD_GENIUS;
            REVARD_GENIUS = 0;
            emit mistery(msg.sender, _string);
        }
    }

    function getAutoEnter(address a) public view returns (uint256[] memory) {
        return autoEnter[a].lotteryes;
    }

    function getLotteryCount() public view returns (uint256) {
        return LotteryCount;
    }

    function getTokenForLottery() public view returns (address) {
        return address(tokenForLottery);
    }

    function getLotteryShablonByIndex(
        uint256 lotteryId
    ) external view returns (LotteryShablon memory) {
        return Lotteries[lotteryId];
    }

    function getREVARD_REF_ALLOW() public view returns (uint256) {
        return REVARD_REF_ALLOW;
    }

    function getshouldRevard(address a) public view returns (uint256) {
        return shouldRevard[a];
    }

    function getcountOfLotteryEnter(address a) public view returns (uint256) {
        return countOfLotteryEnter[a];
    }

    function getPromSetReverse(string memory a) public view returns (address) {
        bytes32 Hash = keccak256(abi.encodePacked(a));
        return PromSetReverse[Hash];
    }

    function checkFor50() private {
        uint256 period = 50; //50
        address onNeZamintel = first1000Winers[LotteryCount - period];

        uint256[] storage array = _first1000Winers[onNeZamintel].lotteryes;
        uint256 stop = array.length;

        for (uint256 i = 0; i < stop; i++) {
            if (array[i] == LotteryCount - period) {
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

        first1000Winers[LotteryCount - period] = owner();
        _first1000Winers[owner()].lotteryes.push(LotteryCount - period);
    }

    function allowToNFT(uint256 TokenId) public view returns (address) {
        return first1000Winers[TokenId];
    }

    function _allowToNFT(address addres) public view returns (wins memory) {
        return _first1000Winers[addres];
    }

    function setPromSet(string memory a) public {
        bytes32 t = keccak256(abi.encodePacked(a));
        require(Prom[msg.sender].PromSet == bytes32(0));
        require(PromSetReverse[t] == address(0), "exist");
        Prom[msg.sender].PromSet = t;
        PromSetReverse[t] = msg.sender;
    }

    function setPromInput(string memory a) public {
        bytes32 t = keccak256(abi.encodePacked(a));
        require(PromSetReverse[t] != msg.sender, "tvoy");
        require(Prom[msg.sender].PromInput == bytes32(0), "yje");
        require(PromSetReverse[t] != address(0), "ne chei");
        require(countOfLotteryEnter[msg.sender] == 0);
        Prom[msg.sender].PromInput = t;
    }

    function checkRef() private {
        bytes32 prom = Prom[msg.sender].PromInput;
        if (bytes32(0) != prom) {
            address setter = PromSetReverse[prom];
            REVARD_REF_ALLOW -= 2000;
            shouldRevard[msg.sender] += 1000;
            shouldRevard[setter] += 1000;
        }
    }

    function _findAddressInfirst1000Winers(
        address a,
        uint256 TokenId
    ) public view returns (bool) {
        if (first1000Winers[TokenId] == a) return true;
        return false;
    }

    function findAddressInPlayers(
        address _a,
        uint256 lottery
    ) private returns (bool) {
        LotteryShablon memory temp = Lotteries[lottery];
        uint256 stop = temp.playersCount;

        for (uint256 i = 0; i < stop; i++) {
            if (temp.players[i] == _a) return true;
        }
        return false;
    }

    function addToAutoEnter(uint256[] memory _lotteryes) public {
        uint256 stop = _lotteryes.length;
        require(
            tokenForLottery.balanceOf(msg.sender) >= stop * deposit &&
                tokenForLottery.allowance(msg.sender, address(this)) >=
                stop * deposit,
            "balance or allowance"
        );
        uint _LotteryCount = LotteryCount;
        for (uint256 i = 0; i < stop; i++) {
            require(
                _lotteryes[i] >= _LotteryCount,
                "Some lottery < lotteryCount"
            );
        }

        if (countOfLotteryEnter[msg.sender] == 0 && REVARD_REF_ALLOW >= 2000) {
            checkRef();
        }
        AUTOENTER storage pointer = autoEnter[msg.sender];
        uint256 success = 0;
        for (uint256 i = 0; i < stop; i++) {
            if (!findAddressInPlayers(msg.sender, _lotteryes[i])) {
                success++;
                Lotteries[_lotteryes[i]].players.push(msg.sender);
                Lotteries[_lotteryes[i]].playersCount++;
                countOfLotteryEnter[msg.sender]++;
                pointer.lotteryes.push(_lotteryes[i]);
            }
        }
        tokenForLottery.transferFrom(
            msg.sender,
            address(this),
            success * deposit
        );
    }

    function Play() public {
        require(msg.sender == owner() || msg.sender == autotask);
        address winer;

        if (Lotteries[LotteryCount].playersCount == 0) {
            winer = owner();
        } else {
            uint256 tryRandom = getRandNumber(
                Lotteries[LotteryCount].playersCount
            );
            winer = Lotteries[LotteryCount].players[tryRandom];
        }

        if (LotteryCount <= 1000) {
            // <=1000
            first1000Winers[LotteryCount] = winer;
            _first1000Winers[winer].lotteryes.push(LotteryCount);
        }
        tokenForLottery.transfer(
            winer,
            deposit * Lotteries[LotteryCount].playersCount
        );

        Lotteries[LotteryCount].winer = winer;

        if (
            LotteryCount >= 51 && //>=51
            LotteryCount < 1051 && //<1051
            !NFT.istokenMints(LotteryCount - 50) //50
        ) checkFor50();

        if (LotteryCount >= 1051 && LotteryCount < 2051) {
            // >=1051 and <2051 / >=31 and <171
            address[] memory players = Lotteries[LotteryCount].players;
            uint256 length = players.length;
            if (length > 0 && (FOR_ONE_LOTTERY * 10 ** 18 > length)) {
                uint256 forOne = (FOR_ONE_LOTTERY / length);
                for (uint256 i = 0; i < length; i++) {
                    shouldRevard[players[i]] += forOne;
                }
            }
            HEEP += FOR_ONE_DAY_LOBBY;
        }

        if (LotteryCount == 1050) {
            HOLDERS();
            HOLDERS_EVER();
            OWNER();
            tokenForLottery = MUDaddress;
            deposit = 10 ** 19;
        }

        emit play(LotteryCount, winer);
        LotteryCount++;
    }

    function HOLDERS() private {
        uint256[] memory tokens = NFT.gettokensMints();
        uint256 length = tokens.length;
        if (length > 0) {
            uint256 forOne = (REVARD_FOR_HOLDERS / length);
            for (uint256 i = 0; i < length; i++) {
                shouldRevard[NFT.ownerOf(tokens[i])] += forOne;
                // MUDaddress._mintFromLottery(NFT.ownerOf(tokens[i]), forOne);
            }
        }
    }

    function HOLDERS_EVER() private {
        address[] memory adressEver = NFT.getaddressHowOwnedNFT();
        uint256 length = adressEver.length;
        if (length > 0) {
            uint256 forOne = (REVARD_FOR_HOLDERS_EVER / length);
            for (uint256 i = 0; i < length; i++) {
                shouldRevard[adressEver[i]] += forOne;
                // MUDaddress._mintFromLottery(adressEver[i], forOne);
            }
        }
    }

    function OWNER() private {
        MUDaddress._mintFromLottery(owner(), REVARD_OWNER * 10 ** 18);
    }

    function receiveRevard() public {
        require(shouldRevard[msg.sender] > 0 && LotteryCount > 1050);
        require(
            MUDaddress._mintFromLottery(
                msg.sender,
                shouldRevard[msg.sender] * 10 ** 18
            )
        );
        shouldRevard[msg.sender] = 0;
    }

    function setAdrressNFT(ERC721with token) public onlyOwner {
        NFT = token;
    }

    function setAutotask(address a) public onlyOwner {
        autotask = a;
    }

    function setMUD(MUD a) public onlyOwner {
        MUDaddress = a;
    }

    function setDeposit(uint256 _deposit) public onlyOwner {
        deposit = _deposit;
    }

    function setTokenForLottery(IERC20 _tokenForLottery) public onlyOwner {
        tokenForLottery = _tokenForLottery;
    }
}
