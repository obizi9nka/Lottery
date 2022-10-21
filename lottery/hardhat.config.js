require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
const secret = require("./secret")

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// const { ProxyAgent, setGlobalDispatcher } = require("undici");
// const proxyAgent = new ProxyAgent('http://127.0.0.1:7890'); // change to yours
// setGlobalDispatcher(proxyAgent);


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.11",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337
    },
    sepolia: {
      url: secret.sepoliaURL,
      accounts: [secret.key]
    },
    goerli: {
      url: secret.goerliURL,
      accounts: [secret.key]
    },
    TBNB: {
      url: secret.bnbTestNetURL,
      accounts: [secret.key]
    }
  },
  etherscan: {
    apiKey: "YQADQIC7H32XZ5KA99PDAJPXGBGAGCYWSQ"
  }
};
