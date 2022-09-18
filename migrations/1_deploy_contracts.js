let Greeting = artifacts.require("Greeting");

module.exports = function (deployer) {
  deployer.deploy(Greeting, "Hello");
};
