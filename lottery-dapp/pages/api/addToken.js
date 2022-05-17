import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export default async function handler(req, res) {

    const { address, addTokenAddress } = JSON.parse(req.body)
    let tokensForUser = await prisma.user.findUnique({
        where: {
            address
        }
    })

    tokensForUser = tokensForUser.tokens + addTokenAddress + "_"

    const result = await prisma.user.update({
        where: {
            address
        },
        data: {
            tokens: tokensForUser
        }
    })
    res.json(result)
}
