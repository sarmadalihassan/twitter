const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

let tweetSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280
  },
  privacy: {
    type: String
  },
  whoCanReply: {
    type: String
  },
  mentioned: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Tweet"
  },
  media: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  hashTags: {
    type: [String]
  },
  postedAt: {
    type: Date,
    required: true
  },
  replies: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "tweet"
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User"
  },
  reposts: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Users"
  }
});

const joiTweetSchema = Joi.object({
  text: Joi.string().min(1).max(280).required(),
  privacy: Joi.string().valid("everyone", "circle").required(),
  whoCanReply: Joi.string()
    .valid("everyone", "followed", "mentioned")
    .required(),
  mentioned: Joi.array().items(Joi.objectId()),
  media: Joi.string(),
  hashTags: Joi.array().items(Joi.string()),
  user: Joi.objectId()
});

const joiReplySchema = Joi.object({
  text: Joi.string().min(1).max(280).required(),
  mentioned: Joi.array().items(Joi.objectId()),
  media: Joi.string(),
  hashTags: Joi.array().items(Joi.string())
});

module.exports = {
  Tweet: mongoose.model("Tweet", tweetSchema),
  tweetSchema: joiTweetSchema,
  replySchema: joiReplySchema
};
