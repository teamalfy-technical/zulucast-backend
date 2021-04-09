const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("You are not logged in!");
  try {
    const decoded = jwt.verify(token, config.get("zuluKey"));
    req.userToken = decoded;
    next();
  } catch (error) {
    //res.status(404).send("Invalid token!");
  }
};
