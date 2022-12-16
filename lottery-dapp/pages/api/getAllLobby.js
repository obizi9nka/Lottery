import prisma from './prisma.js';
import { ETHid, BNBid, PRODACTION } from '../../components/Constants.js';


export default async function handler(req, res) {

    const { user, chainId, isConnected } = JSON.parse(req.body)

    let lobbysETH = await prisma.lobbyETH.findMany()
    let lobbysBNB = await prisma.lobbyBNB.findMany()

    let lobbysETHActive = []
    let lobbysBNBActive = []

    if (lobbysETH != [])
        lobbysETH.forEach((element, i) => {
            let isEntered = isConnected ? (element.players.indexOf(user) == -1 ? false : true) : false
            lobbysETH[i] = {
                deposit: element.deposit,
                nowInLobby: element.nowInLobby,
                players: element.players,
                IERC20: element.IERC20,
                countOfPlayers: element.countOfPlayers,
                creator: element.creator,
                id: element.id,
                percent: parseInt(`${element.nowInLobby / element.countOfPlayers * 100}`.substring(0, 2)),
                isEntered
            }
            if (isConnected && isEntered) {
                lobbysETHActive.push(lobbysETH[i])
            }
        })

    if (lobbysBNB != [])
        lobbysBNB.forEach((element, i) => {
            let isEntered = isConnected ? (element.players.indexOf(user) == -1 ? false : true) : false
            lobbysBNB[i] = {
                deposit: element.deposit,
                nowInLobby: element.nowInLobby,
                players: element.players,
                countOfPlayers: element.countOfPlayers,
                IERC20: element.IERC20,
                creator: element.creator,
                id: element.id,
                percent: parseInt(`${element.nowInLobby / element.countOfPlayers * 100}`.substring(0, 2)),
                isEntered
            }
            if (isConnected && isEntered)
                lobbysBNBActive.push(lobbysBNB[i])

        })

    let result = {
        lobbysETH,
        lobbysBNB,
        lobbysETHActive,
        lobbysBNBActive
    }

    res.json(result)
}
