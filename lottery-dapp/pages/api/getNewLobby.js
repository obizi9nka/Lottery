import prisma from './prisma.js';
import { ETHid, BNBid, PRODACTION } from '../../components/Constants.js';

export default async function handler(req, res) {
  const { user, chainId } = JSON.parse(req.body);

  let id = await prisma.user.findUnique({
    where: {
      address: user,
    },
  });

  id = chainId === ETHid ? id.countOfLobbysETH : id.countOfLobbysBNB;

  let result;
  if (chainId === ETHid) {
    result = await prisma.lobbyETH.findUnique({
      where: {
        creator_id: {
          creator: user,
          id,
        },
      },
    });
  } else {
    result = await prisma.lobbyBNB.findUnique({
      where: {
        creator_id: {
          creator: user,
          id,
        },
      },
    });
  }

  res.json(result);
}
