const express = require("express");
const { Movies } = require("../../model/movies/movies");

const router = express.Router();

router.post("/genre-movies", async (req, res) => {
  const movies = await Movies.find({ genre: req.body.genre });
  if (!movies) return res.status(404).send("No movie found");

  res.send(movies);
});

router.get("/recent", async (req, res) => {
  const movies = await Movies.find().limit(10).sort("-uploadDate");
  if (!movies) return res.status(404).send("No recent movie found");

  res.send(movies);
});

router.get("/banner", async (req, res) => {
  const movies = await Movies.find({ isBanner: true });
  if (!movies) return res.status(404).send("No banner movie found");

  res.send(movies);
});

module.exports = router;
