const express = require("express");
const isAuth = require("../../middleware/isAuth");
const { Longevity } = require("../../model/movies/movieLongevity");

const router = express.Router();

router.post("/", isAuth, async (req, res) => {
  const newLongevity = new Longevity({
    longevity: req.body.longevity,
    addedBy: req.userToken.username,
  });
  await newLongevity.save();
  res.send(newLongevity);
});

router.get("/", async (req, res) => {
  const longevity = await Longevity.findOne();
  res.send(longevity);
});

router.put("/", isAuth, async (req, res) => {
  const obj = await Longevity.findOne();
  (obj.longevity = req.body.longevity), (obj.addedBy = req.userToken.username);
  await obj.save();
  res.send(obj);
});

module.exports = router;
