const express = require("express");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("../services/swagger.json");

const error = require("../middleware/error");
const authRoute = require("../routes/authentication/auth");
const genresRoute = require("../routes/movieGenres/genres");
const releaseTypeRoute = require("../routes/movieReleaseTypes/releaseTypes");
const moviesRoute = require("../routes/movies/movies");
const moviesMobileRoute = require("../routes/movies/movies_mobile");
const paymentRoute = require("../routes/payments/payments");
const orderRoute = require("../routes/orders/userOrders");
const preOrderRoute = require("../routes/orders/preOrder");
const orderMobileRoute = require("../routes/orders/userMobileOrder");
const longevity = require("../routes/movies/movieLongevity");
const admin = require("../routes/permission/admin");
const superAdmin = require("../routes/permission/superAdmin");

module.exports = function (app) {
  app.use(express.json());
  app.use(cors());
  app.use("/api/auth", authRoute);
  app.use("/api/genre", genresRoute);
  app.use("/api/release", releaseTypeRoute);
  app.use("/api/movies", moviesRoute);
  app.use("/api/movies-mobile", moviesMobileRoute);
  app.use("/api/payment", paymentRoute);
  app.use("/api/orders", orderRoute);
  app.use("/api/pre-orders", preOrderRoute);
  app.use("/api/orders/mobile", orderMobileRoute);
  app.use("/api/longevity", longevity);
  app.use("/api/admin", admin);
  app.use("/api/super-admin", superAdmin);
  app.use(
    "/api-docs",
    swaggerUI.serve,
    swaggerUI.setup(swaggerDocument, { explorer: true })
  );

  app.use(error);
};
