const { Tweet, tweetSchema, replySchema } = require("../models/tweet");
const { User } = require("../models/user");
const mongoose = require("mongoose");
const { DateTime } = require("luxon");

exports.postTweet = async (req, res) => {
  try {
    req.body = await tweetSchema.validateAsync(req.body, { abortEarly: false });
  } catch (error) {
    return res.status(400).send(error.details);
  }

  let tweet = new Tweet(req.body);
  tweet.user = req.user._id;
  tweet.postedAt = DateTime.now();
  await tweet.save();

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

  let tweets = await Tweet.find({ user: { $in: user.following } }).select({
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

exports.getExplorePage = async (req, res) => {};
