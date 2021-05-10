const express = require("express");
const isAuth = require("../../middleware/isAuth");
const isAdmin = require("../../middleware/isAdmin");
const { Genres, validateGenre } = require("../../model/movieGenres/genres");

const router = express.Router();

//[isAuth, isAdmin]
router.post("/", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const genre = await Genres.findOne({ name: req.body.name });
  if (genre) return res.status(404).send("Genre already exist");

  // const position = await Genres.findOne({
  //   positionOnDashboard: req.body.positionOnDashboard,
  // });
  // if (position)
  //   return res
  //     .status(404)
  //     .send("You already have a movie genre with this position on dashboard");

  const newGenre = new Genres({
    name: req.body.name,
    description: req.body.description,
    positionOnDashboard: req.body.positionOnDashboard,
  });
  await newGenre.save();
  res.send(newGenre);
});

router.get("/", async (req, res) => {
  const genres = await Genres.find().sort("positionOnDashboard");
  if (!genres) return res.status(404).send("No genre found");

  res.send(genres);
});

router.get("/:id", async (req, res) => {
  const genre = await Genres.findById(req.params.id).select(
    "-creationDate -__v"
  );
  if (!genre) return res.status(404).send("No genre found");

  res.send(genre);
});

//isAdmin
router.put("/update/:id", [isAuth], async (req, res) => {
  const genre = await Genres.findById(req.params.id);
  if (!genre) return res.status(404).send("No genre found");

  const updateGenre = await Genres.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    description: req.body.description,
    positionOnDashboard: req.body.positionOnDashboard,
  });
  res.send(updateGenre);
});

//, isAdmin
router.delete("/delete/:id", [isAuth], async (req, res) => {
  const genre = await Genres.findById(req.params.id);
  if (!genre) return res.status(404).send("No genre found");

  const genreToDelete = await Genres.findByIdAndDelete(req.params.id);
  res.send(genreToDelete);
});

module.exports = router;
