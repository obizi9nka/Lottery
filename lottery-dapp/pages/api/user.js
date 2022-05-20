// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export default async function handler(req, res) {

  let { address, defaultToken } = JSON.parse(req.body)

  defaultToken = defaultToken + "_"

  const result = await prisma.user.create({
    data: {
      address,
      tokens: defaultToken
    }
  })

  res.json(result)
}
