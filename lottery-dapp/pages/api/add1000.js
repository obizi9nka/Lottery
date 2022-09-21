import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export default async function handler(req, res) {

    let { chainId } = JSON.parse(req.body)

    console.log("start")
    for (let i = 1; i <= 1000; i++) {
        await prisma.bNB1000.create({
            data: {
                id: i
            }
        })
        await prisma.eTH1000.create({
            data: {
                id: i
            }
        })
    }
    console.log("end")
}
