const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
const Joi = require("@hapi/joi");
const moment = require("moment");

const preOrderSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  actor: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  moviePictureURL: {
    type: String,
    required: true,
  },
  movieVideoURL: {
    type: String,
    required: true,
  },
  oderDate: {
    type: Date,
    default: new Date(),
  },
  expiryDate: {
    type: Date,
    default: moment().add(3, "months"),
  },
  longevity: {
    type: Number,
  },
  startWatch: {
    type: Boolean,
    default: false,
  },
  movieExpiresOn: {
    type: Date,
    default: moment().add(3, "months"),
  },
});

function validatePreOrder(userObj) {
  const schema = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().min(0).required(),
    description: Joi.string().required(),
    actor: Joi.string().required(),
    duration: Joi.string().required(),
    moviePictureURL: Joi.string().required(),
    movieVideoURL: Joi.string().required(),
  });
  return schema.validate(userObj);
}

const preOrderModel = mongoose.model("pre-orders", preOrderSchema);

module.exports.PreOrders = preOrderModel;
module.exports.validatePreOrder = validatePreOrder;
