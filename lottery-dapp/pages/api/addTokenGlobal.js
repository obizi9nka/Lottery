import prisma from './prisma.js';

export default async function handler(req, res) {
  const { addTokenAddress, chainId, symbol, decimals } = JSON.parse(req.body);
  try {
    await prisma.tokens.create({
      data: {
        address: addTokenAddress,
        isImageAdded: false,
        chain: parseInt(chainId),
        symbol,
        decimals,
      },
    });
  } catch (err) {
    console.log(err);
  }
}
