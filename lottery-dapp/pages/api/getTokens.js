import { PrismaClient } from '@prisma/client';
const { ethers } = require("ethers");

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const address = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
    const result = await prisma.user.findUnique({
        where: {
            address
        }
    });

    res.json(result)
}
