// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "./Balance.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

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
                countOfPlayers > 1,
            "balance < deposit"
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
