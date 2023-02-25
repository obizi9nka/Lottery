import prisma from './prisma.js';
import { ETHid, BNBid, PRODACTION } from '../../components/Constants.js';

export default async function handler(req, res) {
  const { address, tokenId, chainId } = JSON.parse(req.body);
  let data = await prisma.user.findUnique({
    where: {
      address,
    },
  });

  const AutoEnter =
    (chainId == ETHid ? data.AutoEnterETH : data.AutoEnterBNB) + tokenId + '_';

  let result;

  if (chainId == ETHid) {
    result = await prisma.user.update({
      where: {
        address,
      },
      data: {
        AutoEnterETH: AutoEnter,
      },
    });
  } else {
    result = await prisma.user.update({
      where: {
        address,
      },
      data: {
        AutoEnterBNB: AutoEnter,
      },
    });
  }
  res.json(result);
}
