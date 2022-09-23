// eslint-disable-next-line no-undef
let Twitter = artifacts.require("Twitter");

module.exports = function (deployer) {
  deployer.deploy(Twitter);
};
