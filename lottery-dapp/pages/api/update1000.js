import prisma from './prisma.js';
import { ETHid, BNBid, PRODACTION } from '../../components/Constants.js';


export default async function handler(req, res) {

    const { tokenId, isMinted, price, players, chainId } = JSON.parse(req.body)

    if (isMinted != undefined) {
        if (chainId == ETHid) {
            await prisma.ETH1000.update({
                where: {
                    id: tokenId
                },
                data: {
                    isMinted
                }
            })
        }
        else {
            await prisma.BNB1000.update({
                where: {
                    id: tokenId
                },
                data: {
                    isMinted
                }
            })
        }
    }

    if (price != undefined) {
        if (chainId == ETHid) {
            await prisma.ETH1000.update({
                where: {
                    id: tokenId
                },
                data: {
                    price: price != 0 ? price : null
                }
            })
        }
        else {
            await prisma.BNB1000.update({
                where: {
                    id: tokenId
                },
                data: {
                    price: price != 0 ? price : null
                }
            })
        }
    }

    if (players != undefined) {
        if (chainId == ETHid) {
            await prisma.ETH1000.update({
                where: {
                    id: tokenId
                },
                data: {
                    players
                }
            })
        }
        else {
            await prisma.BNB1000.update({
                where: {
                    id: tokenId
                },
                data: {
                    players
                }
            })
        }
    }

    res.json("lobbyess")
}
