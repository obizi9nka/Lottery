import prisma from './prisma.js';


export default async function handler(req, res) {

  const { address, chainId } = JSON.parse(req.body)

  console.log(address, chainId)

  let result

  result = await prisma.user.create({
    data: {
      address,
      tokensBNB: "0x5FbDB2315678afecb367f032d93F642f64180aa3_",
      tokensETH: "0xbb47a81585d3695fB2bEDb327351667728bC31D1_"
    }
  })

  res.json(result)
}
