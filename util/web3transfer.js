const Web3 = require("web3");
const abi = require("../build/contracts/Twitter.json");
const Provider = require("@truffle/hdwallet-provider");
const config = require("config");
const web3 = new Web3(
  new Provider(
    `${config.get("contract.deployerKey")}`,
    `https://rinkeby.infura.io/v3/${config.get("contract.infuraKey")}`
  )
);

module.exports = web3;
// const twitter = new web3.eth.Contract(
//   abi.abi,
//   `${config.get("contract.twitter.address")}`
// );

//donate
//   const receipt = await twitter.methods.contributeToHashTag("test").send({
//     from: "0x8B56B556408D3E0ACeC130DdBd9ecE5A812C946a",
//     value: web3.utils.toWei("0.001", "ether")
//   });

//check balance
//   const tagAmount = await twitter.methods.getHashTagBalance("test").call();

//   console.log(tagAmount);

//transfer from hashtag
//   try {
//     const receipt = await twitter.methods
//       .transferFromHashTag(
//         "sarmad",
//         // web3.utils.toWei("0.001", "ether"),
//         "10000000000000000",
//         "0x8B56B556408D3E0ACeC130DdBd9ecE5A812C946a"
//       )
//       .send({
//         from: "0x8B56B556408D3E0ACeC130DdBd9ecE5A812C946a"
//       });

//     console.log(receipt);
//   } catch (error) {
//     console.log(error);
//   }
// };
