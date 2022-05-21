import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {


    let id = await prisma.user.findUnique({
        where: {
            address: req.body
        }
    });

    id = id.countOfLobbys

    const result = await prisma.lobby.findUnique({
        where: {
            creator_id: {
                creator: req.body,
                id
            }
        }
    });

    res.json(result)
}
