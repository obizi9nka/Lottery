import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export default async function handler(req, res) {

    const { address, deleteTokenAddress } = JSON.parse(req.body)
    let tokensForUser = await prisma.user.findUnique({
        where: {
            address
        },
        select: {
            tokens: true
        }
    })

    tokensForUser = tokensForUser.tokens
    const index = tokensForUser.indexOf(deleteTokenAddress)
    tokensForUser = tokensForUser.substring(0, index) + tokensForUser.substring(index + 43, tokensForUser.legth)

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
