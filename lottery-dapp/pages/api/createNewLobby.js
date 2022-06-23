import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export default async function handler(req, res) {

    let { user, token, countOfPlayers, deposit, chainId } = JSON.parse(req.body)

    deposit = `${deposit}`

    countOfPlayers = parseInt(countOfPlayers, 10)

    let id = await prisma.user.findUnique({
        where: {
            address: user
        }
    })

    id = 1 + chainId === 4 ? id.countOfLobbysETH : id.countOfLobbysBNB
    const players = user + "_"

    let result
    if (chainId === 4) {
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

    if (chainId === 4) {
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
