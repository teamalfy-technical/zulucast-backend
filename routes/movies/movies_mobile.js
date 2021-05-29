const express = require("express");
const { Movies } = require("../../model/movies/movies");

const router = express.Router();

router.post("/genre-movies", async (req, res) => {
  const movies = await Movies.find({ genre: req.body.genre });
  if (!movies) return res.status(404).send("No movie found");

  res.send(movies);
});

module.exports = router;
