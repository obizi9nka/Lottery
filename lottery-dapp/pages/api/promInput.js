import prisma from './prisma.js';


export default async function handler(req, res) {

    const { address, PromInput, chainId } = JSON.parse(req.body)
    let result

    if (chainId === 4) {
        result = await prisma.user.update({
            where: {
                address,
            },
            data: {
                PromInputETH: PromInput
            }
        })
    } else {
        result = await prisma.user.update({
            where: {
                address,
            },
            data: {
                PromInputBNB: PromInput
            }
        })
    }

    res.json(result)
}
