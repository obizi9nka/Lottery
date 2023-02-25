import prisma from './prisma.js';
import { ETHid, BNBid, PRODACTION } from '../../components/Constants.js';

export default async function handler(req, res) {
  let { user, token, countOfPlayers, deposit, chainId, id } = JSON.parse(
    req.body
  );

  deposit = `${deposit}`;

  let lobbbies = await prisma.user.findUnique({
    where: {
      address: user,
    },
    select: {
      LobbiesBNB: chainId == BNBid,
      LobbiesETH: chainId == ETHid,
    },
  });
  lobbbies = chainId == ETHid ? lobbbies.LobbiesETH : lobbbies.LobbiesBNB;

  lobbbies = lobbbies != null ? lobbbies + `${user}&${id}_` : `${user}&${id}_`;

  let result;
  if (chainId === ETHid) {
    result = await prisma.lobbyETH.create({
      data: {
        id,
        creator: user,
        IERC20: token,
        countOfPlayers,
        nowInLobby: 1,
        deposit,
      },
    });
    await prisma.user.update({
      where: {
        address: user,
      },
      data: {
        LobbiesETH: lobbbies,
      },
    });
  } else {
    result = await prisma.lobbyBNB.create({
      data: {
        id,
        creator: user,
        IERC20: token,
        countOfPlayers,
        nowInLobby: 1,
        deposit,
      },
    });
    await prisma.user.update({
      where: {
        address: user,
      },
      data: {
        LobbiesBNB: lobbbies,
      },
    });
  }

  res.json(result);
}
