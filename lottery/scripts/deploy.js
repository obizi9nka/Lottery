
const hre = require("hardhat");

async function main() {

  const a = await hre.ethers.getContractFactory("A");
  const A = await a.deploy("A", "A");
  await A.deployed();
  console.log("A deployed to:", A.address);

  const lottery = await hre.ethers.getContractFactory("Lottery");
  const Lottery = await lottery.deploy(A.address);
  await Lottery.deployed();
  console.log("Lottery deployed to:", Lottery.address);

  const NFT = await hre.ethers.getContractFactory("MudebzNFT");
  const MudebzNFT = await NFT.deploy(Lottery.address);
  await MudebzNFT.deployed();
  console.log("MudebzNFT deployed to:", MudebzNFT.address);

  [owner, address1, address2, _] = await ethers.getSigners()

  await A.connect(owner).getTokens(10000)
  await A.connect(address1).getTokens(10000)
  await A.connect(address2).getTokens(10000)

  await A.connect(owner).approve(Lottery.address, 10000)
  await A.connect(address1).approve(Lottery.address, 10000)
  await A.connect(address2).approve(Lottery.address, 10000)

  await A.connect(owner).approve(MudebzNFT.address, 10000)
  await A.connect(address1).approve(MudebzNFT.address, 10000)
  await A.connect(address2).approve(MudebzNFT.address, 10000)

  await Lottery.connect(owner).addTokensToBalance(A.address, 9000)
  await Lottery.connect(address1).addTokensToBalance(A.address, 9000)
  await Lottery.connect(address2).addTokensToBalance(A.address, 9000)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
