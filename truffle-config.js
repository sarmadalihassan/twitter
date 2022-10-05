const HDWalletProvider = require("@truffle/hdwallet-provider");
const config = require("config");

module.exports = {
  compilers: {
    solc: {
      version: "0.8.4"
    }
  },
  networks: {
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(
          `${config.get("contract.mnemonic")}`,
          //take out the api key...
          `https://rinkeby.infura.io/v3/${config.get("contract.infuraAPIKey")}`
        );
      },
      network_id: 4,
      networkCheckOutTime: 18000
    }
  }
};
