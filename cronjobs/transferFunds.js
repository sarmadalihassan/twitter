const cron = require("node-cron");
const { HashTagPlus } = require("../models/hashTagPlus");
const config = require("config");
const web3 = require("../util/web3");
const abi = require("../build/contracts/Twitter.json");
const twitter = new web3.eth.Contract(
  abi.abi,
  `${config.get("contract.twitter.address")}`
);

module.exports = async function () {
  cron.schedule("1 1 1 * * *", async () => {
    let hashTagsPlusIds = await HashTagPlus.aggregate([
      { $match: { $expr: { $lte: ["$expiry", "$createdAt"] } } },
      { $project: { _id: 1 } }
    ]);

    hashTagsPlusIds = hashTagsPlusIds.map(v => v._id);

    let hashTagsPlusToExpire = await HashTagPlus.find({
      _id: { $in: hashTagsPlusIds }
    }).select({ text: 1, donateTo: 1 });

    for (let i = 0; i < hashTagsPlusToExpire.length; i++) {
      let balance = await twitter.methods
        .getHashTagBalance(hashTagsPlusToExpire[i].text)
        .call();

      if (balance > 0) {
        await twitter.methods
          .transferFromHashTag(
            hashTagsPlusToExpire[i].text,
            String(balance),
            hashTagsPlusToExpire[i].donateTo
          )
          .send({
            from: config.get("contract.twitter.owner")
          });
      }
    }

    await HashTagPlus.deleteMany({ _id: { $in: hashTagsPlusIds } });
  });
};
