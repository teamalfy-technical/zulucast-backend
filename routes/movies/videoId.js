const express = require("express");
const isAuth = require("../../middleware/isAuth");
const { VideoId } = require("../../model/movies/videoId");

const router = express.Router();

router.post("/", async (req, res) => {
  const newVideo = new VideoId({
    videoId: req.body.videoId,
  });
  const m = await newVideo.save();
  res.send(m);
});

router.get("/", async (req, res) => {
  const video = await VideoId.findOne().sort({ createdOn: -1 });
  res.send(video);
});

router.post("/remove", async (req, res) => {
  const removed = await VideoId.remove({});
  res.send(removed);
});

module.exports = router;
