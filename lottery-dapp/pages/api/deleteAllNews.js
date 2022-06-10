import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export default async function handler(req, res) {

    const result = await prisma.user.update({
        where: {
            address: req.body
        },
        data: {
            news: null
        }
    })
    res.json(result)
}
