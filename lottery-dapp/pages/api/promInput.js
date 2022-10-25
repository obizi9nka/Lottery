import prisma from './prisma.js';
import { ETHid, BNBid, PRODACTION } from '../../components/Constants.js';

export default async function handler(req, res) {

    const { address, PromInput, chainId } = JSON.parse(req.body)
    let result

    if (chainId === ETHid) {
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
