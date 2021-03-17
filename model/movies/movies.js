const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
const Joi = require("@hapi/joi");
const { number } = require("@hapi/joi");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  isBanner: {
    type: Boolean,
    required: true,
    default: false,
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
  releaseYear: {
    type: String,
  },
  releaseType: {
    type: String,
  },
  moviePictureURL: {
    type: String,
    required: true,
  },
  movieTrailerURL: {
    type: String,
    required: true,
  },
  movieVideoURL: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: new Date(),
  },
});

function validateMovie(movieObj) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    genre: Joi.string().required(),
    isBanner: Joi.bool().required(),
    price: Joi.number().min(0).required(),
    description: Joi.string().min(3).required(),
    actor: Joi.string().min(3).max(255).required(),
    duration: Joi.string().required(),
    releaseYear: Joi.string().min(4).max(4),
    releaseType: Joi.string().required(),
    moviePictureURL: Joi.string().required(),
    movieTrailerURL: Joi.string().required(),
    movieVideoURL: Joi.string().required(),
  });
  return schema.validate(movieObj);
}

const movieModel = mongoose.model("movies", movieSchema);

module.exports.Movies = movieModel;
module.exports.validateMovie = validateMovie;
