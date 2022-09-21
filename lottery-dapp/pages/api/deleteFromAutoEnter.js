import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export default async function handler(req, res) {

    const { address, tokenId, chainId } = JSON.parse(req.body)

    let data = await prisma.user.findUnique({
        where: {
            address
        }
    })

    if (chainId === 4) {
        data = data.AutoEnterETH
    } else {
        data = data.AutoEnterBNB
    }
    const mas = data.split("_")
    mas.pop()
    mas.sort((a, b) => {
        return a - b
    })
    let aut = ''
    let flag = true
    console.log(mas, tokenId)
    mas.map((element) => {
        if (parseInt(element) != tokenId) {
            aut += element + "_"
        }
    })
    console.log(aut)

    let result
    if (chainId == 4) {
        result = await prisma.user.update({
            where: {
                address
            },
            data: {
                AutoEnterETH: aut
            }
        })
    } else {
        result = await prisma.user.update({
            where: {
                address
            },
            data: {
                AutoEnterBNB: aut
            }
        })
    }

    res.json(result)
}
