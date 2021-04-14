const express = require("express");
const isAuth = require("../../middleware/isAuth");
const { Longevity } = require("../../model/movies/movieLongevity");

const router = express.Router();

router.post("/", async (req, res) => {
  const movieLongevity = await Longevity.findOne();
  if (!movieLongevity) {
    const newLongevity = new Longevity({
      longevity: req.body.longevity,
      playOnHover: req.body.playOnHover === "Yes, play on hover" ? true : false,
      addedBy: "req.userToken.username",
    });
    await newLongevity.save();
    res.send(newLongevity);
  } else {
    movieLongevity.longevity = req.body.longevity;
    (movieLongevity.playOnHover =
      req.body.playOnHover === "Yes, play on hover" ? true : false),
      (movieLongevity.addedBy = "new user");
    await movieLongevity.save();
    res.send(movieLongevity);
  }
});

router.get("/", async (req, res) => {
  const longevity = await Longevity.findOne();
  res.send(longevity);
});

router.put("/", isAuth, async (req, res) => {
  const obj = await Longevity.findOne();
  obj.longevity = req.body.longevity;
  obj.playOnHover = req.body.playOnHover;
  obj.addedBy = req.userToken.username;
  await obj.save();
  res.send(obj);
});

module.exports = router;
