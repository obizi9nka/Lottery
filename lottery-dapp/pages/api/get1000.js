import prisma from './prisma.js';
import { ETHid, BNBid, PRODACTION } from '../../components/Constants.js';

export default async function handler(req, res) {
  // console.log(req.body)

  let result;

  if (req.body == ETHid) {
    result = await prisma.eTH1000.findMany();
  } else {
    result = await prisma.BNB1000.findMany();
  }

  // console.log(result)

  res.json(result);
}
