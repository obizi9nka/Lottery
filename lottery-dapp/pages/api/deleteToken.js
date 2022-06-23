import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export default async function handler(req, res) {

    const { address, deleteTokenAddress, chainId } = JSON.parse(req.body)

    let tokensForUser = await prisma.user.findUnique({
        where: {
            address
        }
    })

    if (chainId === 4) {
        tokensForUser = tokensForUser.tokensETH
    } else {
        tokensForUser = tokensForUser.tokensBNB
    }
    const mas = tokensForUser.split("_")
    mas.pop()
    tokensForUser = ''
    mas.map((element) => {
        if (element.indexOf(deleteTokenAddress) == -1)
            tokensForUser += element + "_"
    })

    let result
    if (chainId == 4) {
        result = await prisma.user.update({
            where: {
                address
            },
            data: {
                tokensETH: tokensForUser
            }
        })
    } else {
        result = await prisma.user.update({
            where: {
                address
            },
            data: {
                tokensBNB: tokensForUser
            }
        })
    }

    res.json(result)
}
