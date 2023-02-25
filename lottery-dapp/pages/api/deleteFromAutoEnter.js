import prisma from './prisma.js';
import { ETHid, BNBid, PRODACTION } from '../../components/Constants.js';

export default async function handler(req, res) {
  const { address, tokenId, chainId } = JSON.parse(req.body);

  let data = await prisma.user.findUnique({
    where: {
      address,
    },
  });

  if (chainId === ETHid) {
    data = data.AutoEnterETH;
  } else {
    data = data.AutoEnterBNB;
  }
  const mas = data.split('_');
  mas.pop();
  mas.sort((a, b) => {
    return a - b;
  });
  let aut = '';

  if (tokenId != -1)
    mas.map((element) => {
      if (parseInt(element) != tokenId) {
        aut += element + '_';
      }
    });
  else {
    aut = null;
  }

  let result;
  if (chainId == ETHid) {
    result = await prisma.user.update({
      where: {
        address,
      },
      data: {
        AutoEnterETH: aut,
      },
    });
  } else {
    result = await prisma.user.update({
      where: {
        address,
      },
      data: {
        AutoEnterBNB: aut,
      },
    });
  }

  res.json(result);
}
