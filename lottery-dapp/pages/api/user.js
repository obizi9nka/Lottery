import prisma from './prisma.js';


export default async function handler(req, res) {

  const { address, chainId } = JSON.parse(req.body)


  let result

  result = await prisma.user.create({
    data: {
      address,
      tokensBNB: "0x5FbDB2315678afecb367f032d93F642f64180aa3_",
      tokensETH: "0xA4b8316c87143311e6E9f538C36f231949e107cE_"
    }
  })

  res.json(result)
}
