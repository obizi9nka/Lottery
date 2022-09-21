import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {

    const { chainId } = JSON.parse(req.body)
    let result = await prisma.user.findMany({
        select: { address: true }
    })

    res.json(result)
}
