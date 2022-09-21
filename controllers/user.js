const {
  User,
  userSchema,
  loginSchema,
  editUserSchema,
  usernameSchema
} = require("../models/user");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { DateTime } = require("luxon");
const mongoose = require("mongoose");

exports.signUp = async (req, res) => {
  try {
    req.body = await userSchema.validateAsync(req.body, { abortEarly: false });
  } catch (error) {
    return res.status(400).send(error.details);
  }
  // console.log("hii bros!");
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = await User.findOne({ username: req.body.username });
  if (user) return res.status(400).send("Username already exists.");
  user = new User(
    _.pick(req.body, ["name", "email", "username", "password", "walletAddress"])
  );

  const saltRounds = 12;
  const salt = await bcrypt.genSalt(saltRounds);

  user.password = await bcrypt.hash(user.password, salt);

  user.joiningDate = DateTime.now().toISO();

  await user.save();

  const token = user.generateAuthToken();

  user.password = null;

  return res.status(200).header("x-auth-token", token).send(user);
};

exports.getUserThroughUsername = async (req, res) => {
  try {
    req.body = await usernameSchema.validateAsync(req.body);
  } catch (error) {
    return res.status(400).send(error.details);
  }

  let user = await User.find({ username: req.body.username }).select({
    _id: 1,
    name: 1
  });

  if (!user)
    return res
      .status(400)
      .send(`No user found with username:${req.body.username}`);

  return res.status(200).send(user);
};

exports.getUser = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send(`Invalid objectid: ${req.params.id} of user.`);

  if (req.user._id !== req.params.id)
    return res
      .status(400)
      .send("You are not authorized to view this user's profile.");

  const user = await User.findById(req.params.id).select("-password");

  if (!user) return res.status(400).send("User does not exist.");

  return res.status(200).send(user);
};

exports.loginUser = async (req, res) => {
  try {
    req.body = await loginSchema.validateAsync(req.body, { abortEarly: false });
  } catch (error) {
    return res.status(400).send(error.details);
  }

  let user = await User.findOne({ username: req.body.username });

  if (!user) return res.status(400).send("Invalid username or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send("Invalid username or password.");

  const token = user.generateAuthToken();

  user.password = null;

  return res.status(200).header("X-Auth-Token", token).send(user);
};

exports.editUser = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send(`Invalid objectid: ${req.params.id} of user.`);

  if (req.user._id !== req.params.id)
    return res
      .status(400)
      .send("You are not authorized to edit this user's profile.");

  try {
    req.body = await editUserSchema.validateAsync(req.body, {
      abortEarly: false
    });
  } catch (error) {
    return res.status(400).send(error.details);
  }

  const user = await User.findById(req.params.id);
  if (!user) return res.status(400).send("User does not exist.");

  user.name = req.body.name;

  if (req.body.username) {
    let userExists = await User.findOne({ username: req.body.username });
    if (userExists) return res.status(400).send("Username already exists.");

    user.username = req.body.username;
  }

  if (req.body.password) {
    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);

    user.password = await bcrypt.hash(req.body.password, salt);
  }

  if (req.body.email) {
    let userExists = await User.findOne({ email: req.body.email });
    if (userExists) return res.status(400).send("Email already exists.");

    user.email = req.body.email;
  }

  await user.save();

  return res.status(200).send(user);
};

exports.followUser = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send(`Invalid objectid: ${req.params.id} of user.`);

  if (req.user._id === req.params.id)
    return res.status(400).send("You cannot follow yourself.");

  const user = await User.findById(req.params.id);
  if (!user) return res.status(400).send("User does not exist.");

  const currentUser = await User.findById(req.user._id);
  if (!currentUser) return res.status(400).send("User does not exist.");

  if (currentUser.following.includes(req.params.id))
    return res.status(400).send("You are already following this user.");

  currentUser.following.push(req.params.id);
  user.followers.push(req.user._id);

  await currentUser.save();
  await user.save();

  return res.status(200).send("You are now following this user.");
};

exports.unfollowUser = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send(`Invalid objectid: ${req.params.id} of user.`);

  if (req.user._id === req.params.id)
    return res.status(400).send("You cannot unfollow yourself.");

  const user = await User.findById(req.params.id);
  if (!user) return res.status(400).send("User does not exist.");

  const currentUser = await User.findById(req.user._id);
  if (!currentUser) return res.status(400).send("User does not exist.");

  if (!currentUser.following.includes(req.params.id))
    return res.status(400).send("You are not following this user.");

  currentUser.following = currentUser.following.filter(
    (id) => id !== req.params.id
  );
  user.followers = user.followers.filter((id) => id !== req.user._id);

  await currentUser.save();
  await user.save();

  return res.status(200).send("You are no longer following this user.");
};

exports.whoToFollow = async (req, res) => {
  let users = await User.find();

  return res.status(200).send(users);
};

exports.deleteUser = async (req, res) => {
  let User = await User.findById(req.user._id);
  if (!User) return res.status(400).send("User does not exist.");

  await User.deleteOne();

  return res.status(200).send("User deleted successfully.");
};
