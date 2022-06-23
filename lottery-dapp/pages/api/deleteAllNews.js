import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export default async function handler(req, res) {

    const { address, chainId } = JSON.parse(req.body)

    let result
    if (chainId == 4) {
        result = await prisma.user.update({
            where: {
                address: req.body
            },
            data: {
                newsETH: null
            }
        })
    }
    else {
        result = await prisma.user.update({
            where: {
                address: req.body
            },
            data: {
                newsBNB: null
            }
        })
    }

    res.json(result)
}
