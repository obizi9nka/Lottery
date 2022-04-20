
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

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
