import prisma from './prisma.js';

import { defaultTokenETH, defaultTokenBNB } from "../../components/Constants"

export default async function handler(req, res) {

  const { address, chainId } = JSON.parse(req.body)


  let result

  result = await prisma.user.create({
    data: {
      address,
      tokensBNB: defaultTokenBNB + "_",
      tokensETH: defaultTokenETH + "_"
    }
  })

  res.json(result)
}
