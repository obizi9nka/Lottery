import prisma from './prisma.js';


export default async function handler(req, res) {

    const { addresses, chainId } = JSON.parse(req.body)

    let result = addresses.map(async element => {
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
