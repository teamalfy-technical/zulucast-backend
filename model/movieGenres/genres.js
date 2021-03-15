const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
const Joi = require("@hapi/joi");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  positionOnDashboard: {
    type: Number,
  },
  creationDate: {
    type: Date,
    default: new Date(),
  },
});

function validateGenre(genreObj) {
  const schema = Joi.object({
    name: Joi.string().max(255).required(),
    description: Joi.string().max(255),
    positionOnDashboard: Joi.number().min(0),
  });
  return schema.validate(genreObj);
}

const genreModel = mongoose.model("genres", genreSchema);

module.exports.Genres = genreModel;
module.exports.validateGenre = validateGenre;
