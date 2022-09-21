import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export default async function handler(req, res) {

    const { address, tokenId, chainId } = JSON.parse(req.body)
    let data = await prisma.user.findUnique({
        where: {
            address
        }
    })

    const AutoEnter = (chainId == 4 ? data.AutoEnterETH : data.AutoEnterBNB) + tokenId + "_"

    let result

    if (chainId == 4) {
        result = await prisma.user.update({
            where: {
                address
            },
            data: {
                AutoEnterETH: AutoEnter
            }
        })
    }
    else {
        result = await prisma.user.update({
            where: {
                address
            },
            data: {
                AutoEnterBNB: AutoEnter
            }
        })
    }
    res.json(result)
}
