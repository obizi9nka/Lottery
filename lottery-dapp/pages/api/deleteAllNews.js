import prisma from './prisma.js';
import { ETHid, BNBid, PRODACTION } from '../../components/Constants.js';


export default async function handler(req, res) {

    const { address, chainId } = JSON.parse(req.body)

    let result
    if (chainId == ETHid) {
        result = await prisma.user.update({
            where: {
                address: req.body
            },
            data: {
                newsETH: null
            }
        })
    }
    else {
        result = await prisma.user.update({
            where: {
                address: req.body
            },
            data: {
                newsBNB: null
            }
        })
    }

    res.json(result)
}
