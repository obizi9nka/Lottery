import prisma from './prisma.js';

export default async function handler(req, res) {
  let { chainId } = JSON.parse(req.body);

  console.log('start');
  for (let i = 1; i <= 1000; i++) {
    await prisma.BNB1000.create({
      data: {
        id: i,
      },
    });
    await prisma.ETH1000.create({
      data: {
        id: i,
      },
    });
  }
  console.log('end');
}
