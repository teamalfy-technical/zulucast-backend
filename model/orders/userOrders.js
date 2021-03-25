const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
const Joi = require("@hapi/joi");

const orderSchema = new mongoose.Schema({
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
});

function validateOrder(userObj) {
  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.email().required(),
    title: Joi.string().string().required(),
    price: Joi.number().min(0).required(),
    description: Joi.string().required(),
    actor: Joi.string().required(),
    duration: Joi.string().required(),
    moviePictureURL: Joi.string().required(),
    movieVideoURL: Joi.string().required(),
  });
  return schema.validate(userObj);
}

const orderModel = mongoose.model("orders", orderSchema);

module.exports.Orders = orderModel;
module.exports.validateOrder = validateOrder;
