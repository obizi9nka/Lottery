import prisma from './prisma.js';
import { ETHid, BNBid, PRODACTION } from '../../components/Constants.js';


export default async function handler(req, res) {

    let { user, token, countOfPlayers, deposit, chainId, id } = JSON.parse(req.body)

    deposit = `${deposit}`

    countOfPlayers = parseInt(countOfPlayers)

    const players = user + "_"

    let result
    if (chainId === ETHid) {
        result = await prisma.lobbyETH.create({
            data: {
                id,
                creator: user,
                IERC20: token,
                countOfPlayers,
                players,
                nowInLobby: 1,
                deposit,
            }
        })
    } else {
        result = await prisma.lobbyBNB.create({
            data: {
                id,
                creator: user,
                IERC20: token,
                countOfPlayers,
                players,
                nowInLobby: 1,
                deposit,
            }
        })
    }




    res.json(result)
}
