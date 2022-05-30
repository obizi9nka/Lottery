

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();



export default async function handler(req, res) {
    //for (let i = 0; i < 1000; i++) {
    let { user, token, countOfPlayers, deposit } = JSON.parse(req.body)

    countOfPlayers = parseInt(countOfPlayers, 10)

    let id = await prisma.user.findUnique({
        where: {
            address: user
        }
    })

    id = 1 + id.countOfLobbys

    const result = await prisma.lobby.create({
        data: {
            id,
            creator: user,
            IERC20: token,
            countOfPlayers,
            players: user,
            nowInLobby: 1,
            deposit,
        }
    })

    await prisma.user.update({
        where: {
            address: user
        },
        data: {
            countOfLobbys: id
        }
    })
    //}



}
