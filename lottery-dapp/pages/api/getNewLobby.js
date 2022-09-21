import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {

    const { user, chainId } = JSON.parse(req.body)

    let id = await prisma.user.findUnique({
        where: {
            address: user
        }
    });

    id = chainId === 4 ? id.countOfLobbysETH : id.countOfLobbysBNB

    let result
    if (chainId === 4) {
        result = await prisma.lobbyETH.findUnique({
            where: {
                creator_id: {
                    creator: user,
                    id
                }
            }
        });
    }
    else {
        result = await prisma.lobbyBNB.findUnique({
            where: {
                creator_id: {
                    creator: user,
                    id
                }
            }
        });
    }

    res.json(result)
}
