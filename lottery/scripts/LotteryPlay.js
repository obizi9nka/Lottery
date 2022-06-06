//const AAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
//const LotteryAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
//const MudeBzNFTAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'

const hre = require("hardhat");

async function main() {

    const a = await hre.ethers.getContractFactory("A");

    [owner, address1, address2, _] = await hre.ethers.getSigners()

    console.log(owner.address, address1.address, address2.address)

    console.log(a.address)


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
