import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {

    const { user, chaainId } = JSON.parse(req.body)

    let id = await prisma.user.findUnique({
        where: {
            address: req.body
        }
    });

    id = chaainId === 4 ? id.countOfLobbysETH : id.countOfLobbysBNB

    let result
    if (chaainId === 4) {
        result = await prisma.lobbyETH.findUnique({
            where: {
                creator_id: {
                    creator: req.body,
                    id
                }
            }
        });
    }
    else {
        result = await prisma.lobbyBNB.findUnique({
            where: {
                creator_id: {
                    creator: req.body,
                    id
                }
            }
        });
    }

    res.json(result)
}
