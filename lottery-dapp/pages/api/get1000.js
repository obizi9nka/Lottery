import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {


    console.log(req.body)

    let result

    if (req.body == 4) {
        result = await prisma.eTH1000.findMany()
    }
    else {
        result = await prisma.bNB1000.findMany()
    }

    res.json(result)
}
