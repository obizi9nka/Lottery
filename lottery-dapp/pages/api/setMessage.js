import prisma from './prisma.js';

export default async function handler(req, res) {

    const { address, message, tokenId, chainId } = JSON.parse(req.body)
    let data = await prisma.user.findUnique({
        where: {
            address
        }
    })


    if (chainId == 4) {
        await prisma.eTH1000.update({
            where: {
                id: tokenId
            },
            data: {
                message
            }
        })
    }
    else {
        await prisma.bNB1000.update({
            where: {
                id: tokenId
            },
            data: {
                message
            }
        })
    }

    // console.log(address, message, chainId, data.messageETH, tokenId, result)
}
