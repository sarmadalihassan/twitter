const Web3 = require("web3");
const abi = require("../build/contracts/Twitter.json");
const Provider = require("@truffle/hdwallet-provider");

module.exports = async function () {
  const web3 = new Web3(
    new Provider(
      "d61347f390508f590e88d5362eb810500cb42acdb53872ea1736d8bd629ca078",
      "https://rinkeby.infura.io/v3/e8c0e3a7958f414ab8bbfc1b9017392d"
    )
  );
  const twitter = new web3.eth.Contract(
    abi.abi,
    "0x762b6A50eCABCEB33715E350dcc36e583C3911D8"
  );

  //donate
  //   const receipt = await twitter.methods.contributeToHashTag("test").send({
  //     from: "0x8B56B556408D3E0ACeC130DdBd9ecE5A812C946a",
  //     value: web3.utils.toWei("0.001", "ether")
  //   });

  //check balance
  //   const tagAmount = await twitter.methods.getHashTagBalance("test").call();

  //   console.log(tagAmount);

  //transfer from hashtag
  //   const receipt = await twitter.methods
  //     .transferFromHashTag(
  //       "test",
  //       web3.utils.toWei("0.001", "ether"),
  //       "0x8B56B556408D3E0ACeC130DdBd9ecE5A812C946a"
  //     )
  //     .send({
  //       from: "0x8B56B556408D3E0ACeC130DdBd9ecE5A812C946a"
  //     });

  //   console.log(receipt);
};
