const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("@hapi/joi");

const authSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  registrationDate: {
    type: Date,
    default: new Date(),
  },
  profileURL: {
    type: String,
    default:
      "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
  },
});

authSchema.methods.generateToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      role: this.role,
      email: this.email,
      username: this.username,
      profileURL: this.profileURL,
    },
    config.get("zuluKey")
  );
  return token;
};

function validateUserLogin(userObj) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(20).required(),
  });
  return schema.validate(userObj);
}

function validateUserRegistration(userObj) {
  const schema = Joi.object({
    role: Joi.string(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(20).required(),
    username: Joi.string().min(3).max(20).required(),
  });
  return schema.validate(userObj);
}

function validateAdminRegistration(userObj) {
  const schema = Joi.object({
    role: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(20).required(),
    username: Joi.string().min(3).max(20).required(),
  });
  return schema.validate(userObj);
}

const authModel = mongoose.model("users", authSchema);

module.exports.Auth = authModel;
module.exports.validateUserLogin = validateUserLogin;
module.exports.validateUserRegistration = validateUserRegistration;
module.exports.validateAdminRegistration = validateAdminRegistration;
