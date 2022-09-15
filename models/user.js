const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 1,
    maxlength: 55,
    required: true
  },
  email: {
    type: String,
    requried: true
  },
  username: {
    type: String,
    required: true
  },
  joiningDate: {
    type: Date,
    required: true
  },
  followers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User"
  },
  following: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User"
  },
  tweets: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Tweet"
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Tweet"
  },
  password: {
    type: String,
    minlength: 8,
    maxlength: 256,
    required: true
  },
  profilePicture: {
    type: String
  }
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id
    },
    config.get("jwtPrivateKey"),
    {
      expiresIn: "7d"
    }
  );
  return token;
};

const joiUserSchema = Joi.object({
  name: Joi.string().min(1).max(55).required().lowercase(),
  email: Joi.string().email().required(),
  joiningDate: Joi.date(),
  followers: Joi.array().items(Joi.objectId()),
  tweets: Joi.array().items(Joi.objectId()),
  likes: Joi.array().items(Joi.objectId()),
  password: Joi.string().min(8).max(256).required(),
  username: Joi.string().min(3).max(64).required()
});

const joiLoginSchema = Joi.object({
  username: Joi.string().min(3).max(64).required(),
  password: Joi.string().min(8).max(256).required()
});

const joiUsernameSchema = Joi.object({
  username: Joi.string().min(3).max(64).required().trim()
});

const JoiEditUserSchema = Joi.object({
  name: Joi.string().min(1).max(55).lowercase(),
  email: Joi.string().email(),
  password: Joi.string().min(8).max(256),
  username: Joi.string().min(3).max(64)
});

module.exports = {
  userSchema: joiUserSchema,
  User: mongoose.model("User", userSchema),
  loginSchema: joiLoginSchema,
  editUserSchema: JoiEditUserSchema,
  usernameSchema: joiUsernameSchema
};
