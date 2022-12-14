const { Tweet, tweetSchema, replySchema } = require("../models/tweet");
const { User } = require("../models/user");
const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const { uploadToCloudinary } = require("../util/cloudinary");

exports.postTweet = async (req, res) => {
  try {
    req.body = await tweetSchema.validateAsync(req.body, { abortEarly: false });
  } catch (error) {
    return res.status(400).send(error.details);
  }

  let tweet = new Tweet(req.body);
  tweet.user = req.user._id;
  tweet.postedAt = DateTime.now();

  let tags = req.body.text.split(" ").filter(v => v.startsWith("#"));

  tweet.hashTags = [...tags];

  let mentioned = req.body.text.split(" ").filter(v => v.startsWith("@"));

  tweet.mentioned = [...mentioned];

  if (req.file) {
    const res = await uploadToCloudinary(req.file.path);

    if (res) tweet.media = res.url;
  }

  await tweet.save();
  let user = await User.findById(req.user._id);
  user.tweets.push(tweet._id);
  await user.save();

  return res.status(200).send(tweet);
};

exports.getTweet = async (req, res) => {
  let tweet = await Tweet.findById(req.params.id);

  if (tweet.privacy === "everyone") return res.status(200).send(tweet);

  if (tweet.privacy === "circle") {
    let originalPoster = await User.findById(tweet.user).select({
      following: 1,
      followers: 1
    });

    if (
      originalPoster.following.includes(tweet.user) ||
      originalPoster.followers.includes(tweet.user)
    )
      return res.status(200).send(tweet);
  }
};

exports.getOwnTweets = async (req, res) => {
  let tweets = await Tweet.find({ user: req.user._id });

  if (tweets.length == 0)
    return res.status(400).send("You have not tweeted yet.");

  return res.status(200).send(tweets);
};

exports.getHomePage = async (req, res) => {
  let user = await User.findById(req.user._id);

  let tweets = await Tweet.find({ user: { $in: user.following } })
    .populate("user", "username name walletAddress")
    .select({
      privacy: 0,
      whoCanReply: 0,
      __v: 0,
      mentioned: 0,
      hashTags: 0
    });

  if (tweets.length == 0) return res.status(400).send("No Tweets found!");

  return res.status(200).send(tweets);
};

exports.postTweetReply = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send(`Invalid tweet id:${req.params.id}`);

  let tweet = await Tweet.findById(req.params.id);

  if (!tweet)
    return res.status(400).send(`No tweet found with id:${req.params.id}`);

  try {
    req.body = await replySchema.validateAsync(req.body);
  } catch (error) {
    return res.status(400).send(error.details);
  }

  tweet.replies.push(req.body);

  await tweet.save();

  return res.status(200).send(tweet);
};

exports.likeTweet = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send(`Invalid tweet id:${req.params.id}`);

  let tweet = await Tweet.findById(req.params.id);

  if (!tweet)
    return res.status(400).send(`No tweet found with id:${req.params.id}`);

  tweet.likes.push(req.user._id);

  await tweet.save();

  return res.status(200).send(tweet);
};

exports.repostTweet = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send(`Invalid tweet id:${req.params.id}`);

  let tweet = await Tweet.findById(req.params.id);

  if (!tweet)
    return res.status(400).send(`No tweet found with id:${req.params.id}`);

  tweet.reposts.push(req.user._id);

  await tweet.save();

  return res.status(200).send(tweet);
};

exports.getTrends = async (req, res) => {
  let trending = await Tweet.aggregate([
    { $sort: { _id: -1 } },
    { $limit: 10000 },
    { $match: { "hashTags.0": { $exists: true } } },
    { $unwind: "$hashTags" },
    { $project: { hashTags: 1, _id: 0 } },
    { $group: { _id: { $toLower: "$hashTags" }, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  return res.status(200).send(trending);
};

exports.deleteTweet = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send(`Invalid objectId:${req.params.id}`);

  let tweet = await Tweet.findById(req.params.id);
  if (!tweet)
    return res.status(400).send(`No tweet found with id:${req.params.id}`);

  await Tweet.deleteOne({ _id: req.params.id });

  //also delete tweet's reference from it's original poster

  let user = await User.findById(tweet.user);
  user.tweets = user.tweets.filter(v => v != req.params.id);
  await user.save();

  res.status(200).send(`Tweet deleted successfully.`);
};
