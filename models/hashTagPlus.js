const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const hashTagPlusSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  expiry: {
    type: Date,
    required: true
  },
  startedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  donateTo: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  timezone: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const joiHashTagPlusSchema = Joi.object({
  text: Joi.string().required(),
  expiry: Joi.date().iso(),
  donateTo: Joi.string().required(),
  timezone: Joi.string().required(),
  description: Joi.string().required()
});

module.exports = {
  HashTagPlus: mongoose.model("HashTagPlus", hashTagPlusSchema),
  hashTagPlusSchema: joiHashTagPlusSchema
};
