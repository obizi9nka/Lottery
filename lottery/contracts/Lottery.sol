// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
//1100000000000000000

import "./Lobby.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "./ERC721with.sol";

contract Lottery is Lobby, Ownable {
    struct LotteryShablon {
        address winer;
        address[] players;
        uint256 playersCount;
    }

    struct wins {
        uint256[] lotteryes;
        uint8 dont_use;
    }

    event enter(address user);
    event play(address winer);

    mapping(uint256 => LotteryShablon) Lotteries;

    mapping(uint256 => address) first1000Winers;

    mapping(address => wins) _first1000Winers;

    uint256 deposit;

    IERC20 tokenForLottery;
    address autotask;

    struct AUTOENTER {
        uint256[] lotteryes;
        uint8 dont_use;
    }

    mapping(address => AUTOENTER) autoEnter;

    function getAutoEnter(address a) public view returns (uint256[] memory) {
        return autoEnter[a].lotteryes;
    }

    function addToAutoEnter(uint256[] memory _lotteryes) public {
        uint256 stop = _lotteryes.length;
        require(
            balanceInTokenForAccount[tokenForLottery][msg.sender] >=
                (stop * deposit)
        );
        for (uint256 i = 0; i < stop; i++) {
            require(_lotteryes[i] > LotteryCount);
        }

        if (countOfLotteryEnter[msg.sender] == 0 && REVARD_REF_ALLOW >= 200) {
            checkRef();
        }
        AUTOENTER storage pointer = autoEnter[msg.sender];

        for (uint256 i = 0; i < stop; i++) {
            if (!findAddressInPlayers(msg.sender, _lotteryes[i])) {
                balanceInTokenForAccount[tokenForLottery][
                    msg.sender
                ] -= deposit;
                Lotteries[_lotteryes[i]].players.push(msg.sender);
                Lotteries[_lotteryes[i]].playersCount++;
                countOfLotteryEnter[msg.sender]++;
                pointer.lotteryes.push(_lotteryes[i]);
            }
        }
    }

    constructor(IERC20 _tokenForLottery, uint256 _deposit) {
        tokenForLottery = _tokenForLottery;
        deposit = _deposit;
    }

    function getLotteryCount() public view returns (uint256) {
        return LotteryCount;
    }

    function getTokenForLottery() public view returns (address) {
        return address(tokenForLottery);
    }

    function getAdrressNFT() public view returns (address) {
        return address(NFT);
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

    function changeAllowToMint(address newAddress, uint256 TokenId)
        public
        onlyOwner
    {
        require(first1000Winers[TokenId] == msg.sender);
        first1000Winers[TokenId] = newAddress;
    }

    mapping(address => uint256) countOfLotteryEnter;

    struct PromShablon {
        bytes32 PromSet;
        bytes32 PromInput;
    }

    mapping(address => PromShablon) Prom;

    mapping(bytes32 => address) PromSetReverse;

    mapping(address => uint256) shouldRevard;

    // address[] shouldRevardMas;

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

    function setPromSet(string memory a) public {
        bytes32 t = keccak256(abi.encodePacked(a));
        require(Prom[msg.sender].PromSet == bytes32(0));
        require(PromSetReverse[t] == address(0));
        Prom[msg.sender].PromSet = t;
        PromSetReverse[t] = msg.sender;
    }

    function setPromInput(string memory a) public {
        bytes32 t = keccak256(abi.encodePacked(a));
        require(PromSetReverse[t] != msg.sender);
        require(Prom[msg.sender].PromInput == bytes32(0));
        require(PromSetReverse[t] != address(0));
        require(getcountOfLotteryEnter(msg.sender) == 0);
        Prom[msg.sender].PromInput = t;
    }

    uint256 REVARD_REF_ALLOW = REVARD_REF;

    function getREVARD_REF_ALLOW() public view returns (uint256) {
        return REVARD_REF_ALLOW;
    }

    function checkRef() private {
        bytes32 prom = Prom[msg.sender].PromInput;
        if (bytes32(0) != prom) {
            // shouldRevardMas.push(msg.sender);
            address setter = PromSetReverse[prom];
            // if (shouldRevard[setter] == 0) shouldRevardMas.push(setter);
            REVARD_REF_ALLOW -= 200;
            shouldRevard[msg.sender] += 100;
            shouldRevard[setter] += 100;
        }
    }

    function Enter() external {
        require(
            (getBalance(tokenForLottery, msg.sender)) >= deposit &&
                !findAddressInPlayers(msg.sender, LotteryCount)
        );

        if (countOfLotteryEnter[msg.sender] == 0 && REVARD_REF_ALLOW >= 200) {
            checkRef();
        }
        countOfLotteryEnter[msg.sender]++;
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

    function findAddressInPlayers(address _a, uint256 lottery)
        private
        returns (bool)
    {
        LotteryShablon memory temp = Lotteries[lottery];
        uint256 stop = temp.playersCount;

        for (uint256 i = 0; i < stop; i++) {
            if (temp.players[i] == _a) return true;
        }
        return false;
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

        balanceInTokenForAccount[tokenForLottery][winer] +=
            deposit *
            Lotteries[LotteryCount].playersCount;

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
            if (length > 0 && (FOR_ONE_LOTTERY * 10**18 > length)) {
                uint256 forOne = ((FOR_ONE_LOTTERY * 10**18) / length);
                for (uint256 i = 0; i < length; i++) {
                    MUDaddress._mintFromLottery(players[i], forOne);
                    MUDaddress._transferFromLottery(
                        players[i],
                        address(this),
                        forOne
                    );
                    balanceInTokenForAccount[IERC20(MUDaddress)][
                        players[i]
                    ] += forOne;
                }
            }
            HEEP += FOR_ONE_DAY_LOBBY;
        }

        if (LotteryCount == 30) {
            //1050 / 30
            HOLDERS();
            HOLDERS_EVER();
            OWNER();
        }

        LotteryCount++;

        emit play(winer);
    }

    function getLotteryShablonByIndex(uint256 lotteryId)
        external
        view
        returns (LotteryShablon memory)
    {
        return Lotteries[lotteryId];
    }

    function HOLDERS() private {
        uint256[] memory tokens = NFT.gettokensMints();
        uint256 length = tokens.length;
        if (length > 0) {
            uint256 forOne = (REVARD_FOR_HOLDERS / length) * 10**18;
            for (uint256 i = 0; i < length; i++) {
                MUDaddress._mintFromLottery(NFT.ownerOf(tokens[i]), forOne);
            }
        }
    }

    function HOLDERS_EVER() private {
        address[] memory adressEver = NFT.getaddressHowOwnedNFT();
        uint256 length = adressEver.length;
        if (length > 0) {
            uint256 forOne = (REVARD_FOR_HOLDERS_EVER / length) * 10**18;
            for (uint256 i = 0; i < length; i++) {
                MUDaddress._mintFromLottery(adressEver[i], forOne);
            }
        }
    }

    function OWNER() private {
        MUDaddress._mintFromLottery(owner(), REVARD_OWNER * 10**18);
    }

     function REF() public {
        require(shouldRevard[msg.sender] > 0);
        MUDaddress._mintFromLottery(msg.sender,shouldRevard[msg.sender] * 10**18);
        shouldRevard[msg.sender] = 0;
    }

    // function REF() private {
    //     uint256 stop = shouldRevardMas.length;
    //     for (uint256 i = 0; i < stop; i++) {
    //         address user = shouldRevardMas[i];
    //         uint256 revard = shouldRevard[shouldRevardMas[i]] * 10**18;
    //         MUDaddress._mintFromLottery(user, revard);
    //         MUDaddress._transferFromLottery(user, address(this), revard);
    //         balanceInTokenForAccount[IERC20(MUDaddress)][user] += revard;
    //     }
    // }

    function setAdrressNFT(ERC721with token) public onlyOwner {
        NFT = token;
    }

    function setAutotask(address a) public onlyOwner {
        autotask = a;
    }

    function setMUD(MUD a) public onlyOwner {
        MUDaddress = a;
    }
}
