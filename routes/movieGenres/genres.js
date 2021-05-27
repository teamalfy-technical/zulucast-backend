const express = require("express");
const isAuth = require("../../middleware/isAuth");
const isAdmin = require("../../middleware/isAdmin");
const { Genres, validateGenre } = require("../../model/movieGenres/genres");
const { AdminAccess } = require("../../model/permission/admin");
const { SuperAdminAccess } = require("../../model/permission/superAdmin");

const router = express.Router();

//[isAuth, isAdmin]
router.post("/", isAuth, async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const access = await AdminAccess.findOne();
  if (!access.addGenre && req.userToken.role === "admin")
    return res.status(404).send("You dont have access to add new genre");

  const access2 = await SuperAdminAccess.findOne();
  if (!access2.addGenre && req.userToken.role === "super admin")
    return res.status(404).send("You dont have access to add new genre");

  const genre = await Genres.findOne({ name: req.body.name });
  if (genre) return res.status(404).send("Genre already exist");

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

  const access = await AdminAccess.findOne();
  if (!access.updateGenre && req.userToken.role === "admin")
    return res.status(404).send("You dont have access to update genre");

  const access2 = await SuperAdminAccess.findOne();
  if (!access2.updateGenre && req.userToken.role === "super admin")
    return res.status(404).send("You dont have access to update genre");

  const updateGenre = await Genres.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    description: req.body.description,
    positionOnDashboard: req.body.positionOnDashboard,
  });
  res.send(updateGenre);
});

//, isAdmin
router.delete("/delete/:id", [isAuth], async (req, res) => {
  const access = await AdminAccess.findOne();
  if (!access.updateGenre && req.userToken.role === "admin")
    return res.status(404).send("You dont have access to delete genre");

  const access2 = await SuperAdminAccess.findOne();
  if (!access2.updateGenre && req.userToken.role === "super admin")
    return res.status(404).send("You dont have access to delete genre");

  const genre = await Genres.findById(req.params.id);
  if (!genre) return res.status(404).send("No genre found");

  const genreToDelete = await Genres.findByIdAndDelete(req.params.id);
  res.send(genreToDelete);
});

module.exports = router;
