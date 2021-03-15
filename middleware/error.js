const { Logger } = require("../utils/winston");

module.exports = (err, req, res, next) => {
  Logger.error(err.message, err);
  res.status(500).send("Something went wrong!");
};
