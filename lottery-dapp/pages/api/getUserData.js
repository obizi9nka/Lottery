import prisma from './prisma.js';

export default async function handler(req, res) {

    const { user, chainId } = JSON.parse(req.body)

    const result = await prisma.user.findUnique({
        where: {
            address: user
        }
    });

    res.json(result)
}
