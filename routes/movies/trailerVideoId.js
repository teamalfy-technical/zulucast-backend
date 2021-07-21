const express = require("express");
const isAuth = require("../../middleware/isAuth");
const { TrailerVideoId } = require("../../model/movies/trailerVideoId");

const router = express.Router();

router.post("/", async (req, res) => {
  const newVideo = new TrailerVideoId({
    videoId: req.body.videoId,
  });
  const m = await newVideo.save();
  res.send(m);
});

router.get("/", async (req, res) => {
  const video = await TrailerVideoId.findOne().sort({ createdOn: -1 });
  res.send(video);
});

router.post("/remove", async (req, res) => {
  const removed = await TrailerVideoId.remove({});
  res.send(removed);
});

module.exports = router;
