const express = require("express");
const isAuth = require("../../middleware/isAuth");
const isAdmin = require("../../middleware/isAdmin");
const {
  Releases,
  validateRelease,
} = require("../../model/movieReleaseTypes/releaseTypes");

const router = express.Router();

router.post("/", [isAuth, isAdmin], async (req, res) => {
  const { error } = validateRelease(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const release = await Releases.findOne({ releaseType: req.body.releaseType });
  if (release) return res.status(404).send("Release already exist");

  const newRelease = new Releases({
    releaseType: req.body.releaseType,
  });
  await newRelease.save();
  res.send(newRelease);
});

router.get("/", async (req, res) => {
  const releases = await Releases.find().sort("creationDate");
  if (!releases) return res.status(404).send("No release found");

  res.send(releases);
});

router.get("/:id", async (req, res) => {
  const release = await Releases.findById(req.params.id);
  if (!release) return res.status(404).send("No release found");

  res.send(release);
});

router.put("/update/:id", [isAuth, isAdmin], async (req, res) => {
  const release = await Releases.findById(req.params.id);
  if (!release) return res.status(404).send("No release found");

  const updateRelease = await Releases.findByIdAndUpdate(req.params.id, {
    releaseType: req.body.releaseType,
  });
  res.send(updateRelease);
});

router.delete("/delete/:id", [isAuth, isAdmin], async (req, res) => {
  const release = await Releases.findById(req.params.id);
  if (!release) return res.status(404).send("No release found");

  const releaseToDelete = await Releases.findByIdAndDelete(req.params.id);
  res.send(releaseToDelete);
});

module.exports = router;
