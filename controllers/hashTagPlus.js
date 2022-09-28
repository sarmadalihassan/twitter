const { HashTagPlus, hashTagPlusSchema } = require("../models/hashTagPlus");
const { User } = require("../models/user");
const { DateTime } = require("luxon");

//post new hashtagplus
exports.startHashTagPlus = async (req, res) => {
  try {
    req.body = await hashTagPlusSchema.validateAsync(req.body, {
      abortEarly: false
    });
  } catch (error) {
    return res.status(400).send(error.details);
  }

  let user = await User.findById(req.user._id);
  if (!user) return res.status(400).send("User not found");

  let hashTagPlus = await HashTagPlus.find({ text: req.body.text });

  if (hashTagPlus.legnth != 0)
    return res.status(400).send("Hashtag+ already exists");

  hashTagPlus = new HashTagPlus({
    text: req.body.text,
    startedBy: req.user._id,
    donateTo: req.body.donateTo,
    expiry: req.body.expiry, // js iso string with TZ info...
    timezone: req.body.timezone
  });

  let dateTime = DateTime.now().setZone(req.body.timezone);

  hashTagPlus.createdAt = dateTime.toISO();
  // let dateTime = DateTime.now().setZone('Asia/Kolkata');

  // console.log("Current Date: ", dateTime.toISO());

  // //so far so good
  // //after storing date lets see what it becomes
  // hashTagPlus.expiry = dateTime.toString();

  // console.log("hashtagPlus.expiry: ", hashTagPlus.expiry);

  // // after storing in mongodb, it is converted to UTC, TZ
  // // info in included in the time.

  // let dateFromHashTag = DateTime.fromJSDate(hashTagPlus.expiry, {zone: 'Asia/Kolkata'});

  // console.log("dateFromHashTag: ", dateFromHashTag.toString());

  // //all good so far....

  await hashTagPlus.save();

  return res.status(200).send(hashTagPlus);
};
