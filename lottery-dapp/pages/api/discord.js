// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export default async function handler(req, res) {

    const { address, Discord } = JSON.parse(req.body)

    console.log(address, Discord)

    const result = await prisma.user.update({
        where: {
            address,
        },
        data: {
            Discord
        }
    })

    res.json(result)
}
