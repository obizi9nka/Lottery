// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./MUD.sol";
import "./ERC721with.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Lobby is Ownable {
    struct lobbyShablon {
        IERC20 token;
        address winer;
        address[] players;
        uint256 deposit;
        uint256 countOfPlayers;
        uint256 nowInLobby;
    }

    event newLobby(address, uint, lobbyShablon, uint);

    event enterLobby(
        address indexed user,
        address creator,
        uint lobbyId,
        lobbyShablon,
        uint
    );

    event playLobby(
        address indexed winner,
        address creator,
        uint lobbyId,
        lobbyShablon,
        uint
    );

    mapping(address => uint256) lobbyCountForAddress; // количество активных лобби пользователя
    mapping(address => uint256) lobbyCountForAddressALL; //количество когда-либо созданных лобби

    mapping(address => mapping(uint256 => lobbyShablon)) lobby;

    uint256 internal MAX_SUPPLAY = 10 ** 9; // 1 000 000 000

    uint256 internal REVARD_FOR_HOLDERS = (MAX_SUPPLAY / 100) * 8; // 80 000 000
    uint256 internal REVARD_FOR_HOLDERS_EVER = (MAX_SUPPLAY / 100) * 17; // 170 000 000
    uint256 internal REVARD_OWNER = (MAX_SUPPLAY / 100) * 13; // 130 000 000
    uint256 internal REVARD_LOBBY = (MAX_SUPPLAY / 100) * 30; // 300 000 000
    uint256 internal REVARD_LOTTERY = (MAX_SUPPLAY / 100) * 10; // 100 000 000
    uint256 internal REVARD_REF = (MAX_SUPPLAY / 100) * 21; // 210 000 000
    uint256 internal REVARD_GENIUS = (MAX_SUPPLAY / 100) * 1; // 10 000 000

    uint256 internal REVARD_FOREACH_HOLDERS_EVER = 0;

    uint256 internal FOR_ONE_LOTTERY = (REVARD_LOTTERY / 1000); // 100 000
    uint256 internal FOR_ONE_DAY_LOBBY = (REVARD_LOBBY / 1000); // 300 000
    uint256 internal HEEP = FOR_ONE_DAY_LOBBY;

    mapping(address => uint256) internal shouldRevard;

    uint256 LotteryCount = 990;
    uint VALUE = 10 ** 16;

    MUD MUDaddress;
    ERC721with NFT;

    uint AutoMint = 0;

    function setAutoMint(uint value) public onlyOwner {
        AutoMint = value;
    }

    function setVALUE(uint value) public onlyOwner {
        VALUE = value;
    }

    function getHEEP() public view returns (uint256) {
        return HEEP;
    }

    function getlobbyCountForAddress(
        address _address
    ) public view returns (uint256) {
        return lobbyCountForAddress[_address];
    }

    function getlobbyCountForAddressALL(
        address _address
    ) public view returns (uint256) {
        return lobbyCountForAddressALL[_address];
    }

    function createNewLobby(
        IERC20 tokenAddress,
        uint256 deposit,
        uint256 countOfPlayers
    ) external payable {
        require(msg.value == VALUE);
        address msgsender = msg.sender;
        require(
            tokenAddress.transferFrom(msg.sender, address(this), deposit) &&
                lobbyCountForAddress[msgsender] < 10 &&
                countOfPlayers <= 1000 &&
                countOfPlayers > 1
        );

        lobbyCountForAddress[msgsender]++;
        uint256 lobbyId = ++lobbyCountForAddressALL[msgsender];
        // while (true) {
        //     if (lobby[msgsender][lobbyId].nowInLobby != 0) {
        //         lobbyId++;
        //         lobbyId %= 10;
        //     } else {
        //         delete lobby[msgsender][lobbyId].players;
        //         break;
        //     }
        // }

        lobbyShablon storage temp = lobby[msgsender][lobbyId];

        temp.players.push(msgsender);
        temp.deposit = deposit;
        temp.countOfPlayers = countOfPlayers;
        temp.token = tokenAddress;
        temp.nowInLobby = 1;
        temp.winer = address(0);

        emit newLobby(msgsender, lobbyId, temp, block.timestamp);
    }

    function EnterLobby(address lobbyCreator, uint256 lobbyId) public payable {
        require(msg.value == VALUE);
        address msgsender = msg.sender;
        lobbyShablon storage temp = lobby[lobbyCreator][lobbyId];

        require(
            temp.token.transferFrom(msg.sender, address(this), temp.deposit) &&
                lobby[lobbyCreator][lobbyId].nowInLobby != 0 &&
                !findPlayerInLobby(msgsender, lobbyCreator, lobbyId)
        );

        temp.players.push(msgsender);
        uint256 nowInLobby = ++temp.nowInLobby;

        if (nowInLobby == temp.countOfPlayers) {
            address winer = LobbyPlay(temp);
            emit playLobby(winer, lobbyCreator, lobbyId, temp, block.timestamp);
            temp.winer = winer;
            temp.nowInLobby = 0;
            lobbyCountForAddress[lobbyCreator]--;
        }
        emit enterLobby(
            msg.sender,
            lobbyCreator,
            lobbyId,
            temp,
            block.timestamp
        );
    }

    function LobbyPlay(lobbyShablon memory _lobby) private returns (address) {
        address winner = _lobby.players[getRandNumber(_lobby.countOfPlayers)];
        _lobby.token.transfer(winner, _lobby.deposit * _lobby.countOfPlayers);

        uint256 length = _lobby.players.length;
        if (
            LotteryCount >= 1051 &&
            address(_lobby.token) == address(MUDaddress) &&
            HEEP >= length * 10 &&
            _lobby.deposit >= 5 * 10 ** 19
        ) {
            for (uint256 i = 0; i < length; i++) {
                if (AutoMint != 0) {
                    MUDaddress._mintFromLottery(
                        _lobby.players[i],
                        AutoMint * 10 ** 18
                    );
                } else {
                    shouldRevard[_lobby.players[i]] += 10;
                }
                unchecked {
                    HEEP -= 10;
                }
            }
        }

        return winner;
    }

    function getRandNumber(
        uint256 _playersCount
    ) public view returns (uint256) {
        if (_playersCount != 0) {
            return
                uint256(keccak256(abi.encodePacked(block.timestamp))) %
                _playersCount;
        }
        return 0;
    }

    function findPlayerInLobby(
        address msgsender,
        address lobbyCreator,
        uint256 lobbyId
    ) public view returns (bool) {
        address[] memory _players = lobby[lobbyCreator][lobbyId].players;
        uint256 stop = lobby[lobbyCreator][lobbyId].nowInLobby;
        for (uint256 i = 0; i < stop; i++) {
            if (_players[i] == msgsender) return true;
        }
        return false;
    }

    function getLobby(
        address creator,
        uint256 lobbyid
    ) public view returns (lobbyShablon memory) {
        return lobby[creator][lobbyid];
    }
}
