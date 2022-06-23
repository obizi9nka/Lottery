import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {


    let lobbyess
    if (req.body == "4") {
        lobbyess = await prisma.lobbyETH.findMany()

    }
    else {
        lobbyess = await prisma.lobbyBNB.findMany()
        console.log("lobbyess")
    }

    res.json(lobbyess)

    console.log(req.body, lobbyess)
}
