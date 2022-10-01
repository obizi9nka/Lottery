import prisma from './prisma.js';


export default async function handler(req, res) {

    const { address, addTokenAddress, chainId } = JSON.parse(req.body)
    let tokensForUser = await prisma.user.findUnique({
        where: {
            address
        }
    })

    tokensForUser = (chainId == 4 ? (tokensForUser.tokensETH === null ? '' : tokensForUser.tokensETH) : (tokensForUser.tokensBNB === null ? '' : tokensForUser.tokensBNB)) + addTokenAddress + "_"

    let result

    if (chainId == 4) {
        result = await prisma.user.update({
            where: {
                address
            },
            data: {
                tokensETH: tokensForUser
            }
        })
    }
    else {
        result = await prisma.user.update({
            where: {
                address
            },
            data: {
                tokensBNB: tokensForUser
            }
        })
    }
    res.json(result)
}
