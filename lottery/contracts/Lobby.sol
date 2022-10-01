// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "./Balance.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./MUD.sol";
import "./ERC721with.sol";

contract Lobby is Balance {
    struct lobbyShablon {
        IERC20 token;
        address winer;
        address[] players;
        uint256 deposit;
        uint256 countOfPlayers;
        uint256 nowInLobby;
    }

    event newLobby(
        address indexed creator,
        uint256 indexed deposit,
        uint256 indexed countOfPlayers,
        uint256 LobbyId
    );

    event enterLobby(
        address creator,
        uint256 LobbyId,
        address user,
        address[] players,
        uint256 deposit,
        uint256 countOfPlayers,
        IERC20 token
    );
    event playLobby(
        address creator,
        uint256 LobbyId,
        address[] players,
        uint256 deposit,
        uint256 countOfPlayers,
        IERC20 token,
        address winer
    );

    mapping(address => uint256) lobbyCountForAddress;
    mapping(address => uint256) lobbyCountForAddressHistory;

    mapping(address => mapping(uint256 => lobbyShablon)) lobby;

    uint256 internal MAX_SUPPLAY = 10**9; // 1 000 000 000

    uint256 internal REVARD_FOR_HOLDERS = (MAX_SUPPLAY / 100) * 8; // 80 000 000
    uint256 internal REVARD_FOR_HOLDERS_EVER = (MAX_SUPPLAY / 100) * 19; // 190 000 000
    uint256 internal REVARD_OWNER = (MAX_SUPPLAY / 100) * 13; // 130 000 000
    uint256 internal REVARD_LOBBY = (MAX_SUPPLAY / 100) * 30; // 300 000 000
    uint256 internal REVARD_LOTTERY = (MAX_SUPPLAY / 100) * 9; // 90 000 000
    uint256 internal REVARD_REF = (MAX_SUPPLAY / 100) * 21; // 210 000 000

    uint256 internal FOR_ONE_LOTTERY = (REVARD_LOTTERY / 1000); // 100 000
    uint256 internal FOR_ONE_DAY_LOBBY = (REVARD_LOBBY / 1000); // 300 000
    uint256 internal HEEP = FOR_ONE_DAY_LOBBY;

    uint256 LotteryCount = 1;

    MUD MUDaddress;
    ERC721with NFT;

    function getHEEP() public view returns (uint256) {
        return HEEP;
    }

    function createNewLobby(
        IERC20 tokenAddress,
        uint256 deposit,
        uint256 countOfPlayers
    ) external {
        address msgsender = msg.sender;
        require(
            balanceInTokenForAccount[tokenAddress][msgsender] >= deposit &&
                lobbyCountForAddress[msgsender] < 10 &&
                countOfPlayers <= 1000 &&
                countOfPlayers > 1
        );

        balanceInTokenForAccount[tokenAddress][msgsender] -= deposit;

        lobbyCountForAddress[msgsender]++;
        uint256 lobbyId = ++lobbyCountForAddressHistory[msgsender];
        while (true) {
            if (lobby[msgsender][lobbyId].nowInLobby != 0) {
                lobbyId++;
                lobbyId %= 10;
            } else {
                delete lobby[msgsender][lobbyId].players;
                break;
            }
        }
        lobbyShablon storage temp = lobby[msgsender][lobbyId];

        temp.players.push(msgsender);
        temp.deposit = deposit;
        temp.countOfPlayers = countOfPlayers;
        temp.token = tokenAddress;
        temp.nowInLobby = 1;
        temp.winer = address(0);

        emit newLobby(msg.sender, deposit, countOfPlayers, lobbyId);
    }

    function EnterLobby(address lobbyCreator, uint256 lobbyId) public {
        address msgsender = msg.sender;
        lobbyShablon storage temp = lobby[lobbyCreator][lobbyId];

        require(
            balanceInTokenForAccount[temp.token][msgsender] >= temp.deposit &&
                lobby[lobbyCreator][lobbyId].nowInLobby != 0 &&
                !findPlayerInLobby(msgsender, lobbyCreator, lobbyId)
        );

        balanceInTokenForAccount[temp.token][msgsender] -= temp.deposit;

        temp.players.push(msgsender);
        uint256 nowInLobby = ++temp.nowInLobby;

        emit enterLobby(
            lobbyCreator,
            lobbyId,
            msg.sender,
            temp.players,
            temp.deposit,
            temp.countOfPlayers,
            temp.token
        );

        if (nowInLobby == temp.countOfPlayers) {
            address winer = LobbyPlay(temp);
            temp.winer = winer;
            lobby[lobbyCreator][lobbyId].nowInLobby = 0;
            lobbyCountForAddress[lobbyCreator]--;
            emit playLobby(
                lobbyCreator,
                lobbyId,
                temp.players,
                temp.deposit,
                temp.countOfPlayers,
                temp.token,
                winer
            );
        }
    }

    function LobbyPlay(lobbyShablon memory _lobby) private returns (address) {
        uint256 rand = getRandNumber(_lobby.countOfPlayers);
        balanceInTokenForAccount[_lobby.token][_lobby.players[rand]] +=
            _lobby.deposit *
            _lobby.countOfPlayers;

        uint256 length = _lobby.players.length;
        if (
            address(_lobby.token) == address(MUDaddress) &&
            HEEP >= length * 10 &&
            _lobby.deposit >= 10**19 &&
            LotteryCount >= 31 // >=1051 >= 31
        ) {
            for (uint256 i = 0; i < length; i++) {
                MUDaddress._mintFromLottery(_lobby.players[i], 10 * 10**18);
                MUDaddress._transferFromLottery(
                    _lobby.players[i],
                    address(this),
                    10 * 10**18
                );
                balanceInTokenForAccount[IERC20(MUDaddress)][
                    _lobby.players[i]
                ] += 10 * 10**18;
            }
            HEEP -= length * 10;
        }

        return _lobby.players[rand];
    }

    function getRandNumber(uint256 _playersCount)
        public
        view
        returns (uint256)
    {
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
        address _msgsender = msgsender;
        for (uint256 i = 0; i < stop; i++) {
            if (_players[i] == _msgsender) return true;
        }
        return false;
    }

    function getLobby(address creator, uint256 lobbyid)
        public
        view
        returns (lobbyShablon memory)
    {
        return lobby[creator][lobbyid];
    }
}
