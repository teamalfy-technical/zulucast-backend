module.exports = (req, res, next) => {
  if (req.userToken.role !== "admin")
    return res.status(403).send("You don't have permission");
  next();
};
