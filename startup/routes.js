const express = require("express");
const cors = require("cors");

const error = require("../middleware/error");
const authRoute = require("../routes/authentication/auth");
const genresRoute = require("../routes/movieGenres/genres");
const releaseTypeRoute = require("../routes/movieReleaseTypes/releaseTypes");
const moviesRoute = require("../routes/movies/movies");

module.exports = function (app) {
  app.use(express.json());
  app.use(cors());
  app.use("/api/auth", authRoute);
  app.use("/api/genre", genresRoute);
  app.use("/api/release", releaseTypeRoute);
  app.use("/api/movies", moviesRoute);

  app.use(error);
};
