const { Tweet, tweetSchema } = require("../models/tweet");
const { User, userSchema } = require("../models/user");
const mongoose = require("mongoose");

exports.postTweet = async (req, res) => {
  try {
    req.body = await tweetSchema.validateAsync(req.body, { abortEarly: false });
  } catch (error) {
    return res.status(400).send(error.details);
  }

  let tweet = new Tweet(req.body);
  tweet.user = req.user._id;
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

  let tweets = await Tweet.find({ user: { $in: user.following } });

  if (tweets.length == 0) return res.status(400).send("No Tweets found!");

  return res.status(200).send(tweets);
};
