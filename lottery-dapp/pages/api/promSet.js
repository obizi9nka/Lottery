// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export default async function handler(req, res) {

    const { address, PromSet, chainId } = JSON.parse(req.body)
    let result

    if (chainId === 4) {
        result = await prisma.user.update({
            where: {
                address,
            },
            data: {
                PromSetETH: PromSet
            }
        })
    } else {
        result = await prisma.user.update({
            where: {
                address,
            },
            data: {
                PromSetBNB: PromSet
            }
        })
    }



    res.json(result)
}
