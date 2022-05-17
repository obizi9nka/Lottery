// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import sqlite from 'sqlite'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export default async function handler(req, res) {

  const { address, addTokenAddress } = JSON.parse(req.body)

  const result = await prisma.user.create({
    data: {
      address,
      tokens: addTokenAddress
    }
  })

  res.json(result)
}
