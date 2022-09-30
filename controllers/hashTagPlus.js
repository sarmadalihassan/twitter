const { HashTagPlus, hashTagPlusSchema, amountSchema } = require("../models/hashTagPlus");
const { User } = require("../models/user");
const { DateTime } = require("luxon");
const Joi = require("joi");

//Get all hashtags+, with pagination..
const paginationSchema = Joi.object({
  itemsPerPage: Joi.number().required(),
  page: Joi.number().default(0)
});

exports.getTags = async (req, res) => {
  try {
    req.query = await paginationSchema.validateAsync(req.query, {
      abortEarly: false
    });
  } catch (error) {
    return res.status(400).send(error.details);
  }

  const hashTags = await HashTagPlus.find({})
    .sort({_id: -1})
    .skip((req.query.page - 1) * req.query.itemsPerPage)
    .limit(req.query.itemsPerPage);

  if (hashTags.length == 0)
    return res.status(400).send("No active hastags+ found.");

  return res.status(200).send(hashTags);
};

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

  
  if (hashTagPlus.length > 0)
    return res.status(400).send("Hashtag+ already exists");

  hashTagPlus = new HashTagPlus({
    text: req.body.text,
    startedBy: req.user._id,
    donateTo: req.body.donateTo,
    expiry: req.body.expiry, // js iso string with TZ info...
    timezone: req.body.timezone,
    description: req.body.description
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

exports.addAmountToTag = async (req, res) => { 
  try{ 
    req.body = await amountSchema.validateAsync(req.body, {abortEarly: false}); 
  }catch(error){
    return res.status(400).send(error.details); 
  }
  
  let hashTagPlus = await HashTagPlus.findOne({text: req.body.text}); 

  if(!hashTagPlus)
    return res.status(400).send(`No tag found: ${req.body.text}`); 

  hashTagPlus.amount += req.body.amount; 

  await hashTagPlus.save(); 

  return res.status(200).send(hashTagPlus); 
}; 