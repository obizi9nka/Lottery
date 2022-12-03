
const hre = require("hardhat");

async function main() {

    const aSoulBoundToken = await hre.ethers.getContractFactory("SoulBoundToken");
    const SoulBoundToken = await aSoulBoundToken.deploy("0x53dA845Ebe1F9668c37b9fBd9a40EC6130040834");
    await SoulBoundToken.deployed();
    console.log("SoulBoundToken deployed to:", SoulBoundToken.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
