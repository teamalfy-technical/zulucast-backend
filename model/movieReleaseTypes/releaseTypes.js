const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
const Joi = require("@hapi/joi");

const releaseSchema = new mongoose.Schema({
  releaseType: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    default: new Date(),
  },
});

function validateRelease(releaseObj) {
  const schema = Joi.object({
    releaseType: Joi.string().min(3).max(255).required(),
  });
  return schema.validate(releaseObj);
}

const releaseModel = mongoose.model("releases", releaseSchema);

module.exports.Releases = releaseModel;
module.exports.validateRelease = validateRelease;
