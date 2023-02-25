import prisma from './prisma.js';

import { USDT_BNB, USDT_ETH } from '../../components/Constants';

export default async function handler(req, res) {
  const { address, chainId } = JSON.parse(req.body);

  let result;

  result = await prisma.user.create({
    data: {
      address,
      tokensBNB: USDT_BNB + '_',
      tokensETH: USDT_ETH + '_',
    },
  });

  res.json(result);
}
