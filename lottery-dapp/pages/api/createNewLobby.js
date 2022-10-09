import prisma from './prisma.js';
import { ETHid, BNBid, PRODACTION } from '../../components/Constants.js';


export default async function handler(req, res) {

    let { user, token, countOfPlayers, deposit, chainId } = JSON.parse(req.body)

    deposit = `${deposit}`

    countOfPlayers = parseInt(countOfPlayers)

    let needId = await prisma.user.findUnique({
        where: {
            address: user
        }
    })

    const id = 1 + ((chainId === ETHid) ? needId.countOfLobbysETH : needId.countOfLobbysBNB)
    const players = user + "_"
    console.log(id, chainId === ETHid ? needId.countOfLobbysETH : needId.countOfLobbysBNB, needId.countOfLobbysETH, needId.countOfLobbysBNB)

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

    if (chainId === ETHid) {
        await prisma.user.update({
            where: {
                address: user
            },
            data: {
                countOfLobbysETH: id
            }
        })
    } else {
        await prisma.user.update({
            where: {
                address: user
            },
            data: {
                countOfLobbysBNB: id
            }
        })
    }


    res.json(result)
}
