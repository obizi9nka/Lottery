import { ETHid, BNBid } from '../../components/Constants.js';
import prisma from './prisma.js';


export default async function handler(req, res) {

    const { address, chainId } = JSON.parse(req.body)

    const userData = await prisma.user.findUnique({
        where: {
            address
        },
        select: {
            tokensBNB: chainId == BNBid,
            tokensETH: chainId == ETHid
        }

    });


    let mas

    if (chainId == ETHid)
        mas = userData.tokensETH.split("_")
    else
        mas = userData.tokensBNB.split("_")

    mas.pop()

    let result = mas.map(async element => {
        return await new Promise(async resolve => {
            resolve(await prisma.tokens.findUnique({
                where: {
                    address: element
                }
            }))
        })
    });

    await Promise.all(result).then(async (result) => {
        res.json(result)
    })


}
