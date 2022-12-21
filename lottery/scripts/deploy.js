
const hre = require("hardhat");

async function main() {

  // const a = await hre.ethers.getContractFactory("A");
  // const A = await a.deploy("A", "A");
  // await A.deployed();
  // console.log("A deployed to:", A.address);

  // const b = await hre.ethers.getContractFactory("A");
  // const B = await b.deploy("B", "B");
  // await B.deployed();
  // console.log("B deployed to:", B.address);

  const lottery = await hre.ethers.getContractFactory("Lottery");
  const Lottery = await lottery.deploy(hre.ethers.utils.id("data"));
  await Lottery.deployed();
  console.log("Hex ", hre.ethers.utils.id("data")) //0x8f54f1c2d0eb5771cd5bf67a6689fcd6eed9444d91a39e5ef32a9b4ae5ca14ff
  console.log("Lottery deployed to:", Lottery.address,);

  const NFT = await hre.ethers.getContractFactory("MudebzNFT");
  const MudebzNFT = await NFT.deploy(Lottery.address);
  await MudebzNFT.deployed();
  console.log("MudebzNFT deployed to:", MudebzNFT.address);

  const mud = await hre.ethers.getContractFactory("MUD");
  const MUD = await mud.deploy(Lottery.address);
  await MUD.deployed();
  console.log("MUD deployed to:", MUD.address);

  [owner, address1, address2, _] = await ethers.getSigners()

  await Lottery.connect(owner).setAdrressNFT(MudebzNFT.address)
  await Lottery.connect(owner).setMUD(MUD.address)
  await Lottery.connect(owner).setDeposit(BigInt(5 * (10 ** 18)))
  // await Lottery.connect(owner).setTokenForLottery(A.address)

  // await A.connect(owner).getTokens(BigInt(100000 * 10 ** 18))
  // await A.connect(address1).getTokens(BigInt(100000 * 10 ** 18))
  // await A.connect(address2).getTokens(BigInt(100000 * 10 ** 18))

  // await A.connect(owner).approve(Lottery.address, BigInt(10000 * 10 ** 18))
  // await A.connect(address1).approve(Lottery.address, BigInt(10000 * 10 ** 18))
  // await A.connect(address2).approve(Lottery.address, BigInt(10000 * 10 ** 18))

  // await A.connect(owner).approve(MudebzNFT.address, BigInt(10000 * 10 ** 18))
  // await A.connect(address1).approve(MudebzNFT.address, BigInt(10000 * 10 ** 18))
  // await A.connect(address2).approve(MudebzNFT.address, BigInt(10000 * 10 ** 18))


  // ///

  // await MUD.connect(owner).getTokens(BigInt(100 * 10 ** 18))
  // await MUD.connect(address1).getTokens(BigInt(100 * 10 ** 18))
  // await MUD.connect(address2).getTokens(BigInt(100 * 10 ** 18))

  // await MUD.connect(owner).approve(Lottery.address, BigInt(10000 * 10 ** 18))
  // await MUD.connect(address1).approve(Lottery.address, BigInt(10000 * 10 ** 18))
  // await MUD.connect(address2).approve(Lottery.address, BigInt(10000 * 10 ** 18))


  // ///


  // await B.connect(owner).getTokens(BigInt(1 * 10 ** 18))
  // await B.connect(address1).getTokens(BigInt(1 * 10 ** 18))
  // await B.connect(address2).getTokens(BigInt(1 * 10 ** 18))

  // await B.connect(owner).approve(Lottery.address, BigInt(0.1 * 10 ** 18))
  // await B.connect(address1).approve(Lottery.address, BigInt(0.1 * 10 ** 18))
  // await B.connect(address2).approve(Lottery.address, BigInt(0.1 * 10 ** 18))

  // await B.connect(owner).approve(MudebzNFT.address, BigInt(0.1 * 10 ** 18))
  // await B.connect(address1).approve(MudebzNFT.address, BigInt(0.1 * 10 ** 18))
  // await B.connect(address2).approve(MudebzNFT.address, BigInt(0.1 * 10 ** 18))



  // for (let i = 1; i < 301; i++) {
  //   await Lottery.connect(owner).Play()  
  //   await MudebzNFT.connect(owner).MintMarten(i, { value: BigInt(32 * 10 ** 15) })
  //   console.log(i)
  // }


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
