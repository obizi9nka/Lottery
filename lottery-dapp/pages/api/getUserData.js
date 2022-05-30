import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {

    const result = await prisma.user.findUnique({
        where: {
            address: req.body
        }
    });

    res.json(result)
}
