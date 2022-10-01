import prisma from './prisma.js';

export default async function handler(req, res) {


    // console.log(req.body)

    let result

    if (req.body == 4) {
        result = await prisma.eTH1000.findMany()
    }
    else {
        result = await prisma.BNB1000.findMany()
    }

    // console.log(result)

    res.json(result)
}
