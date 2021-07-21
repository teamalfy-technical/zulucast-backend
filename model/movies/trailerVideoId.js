const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);

const videoIdSchema = new mongoose.Schema({
  createdOn: {
    type: Date,
    default: new Date(),
  },
  videoId: {
    type: String,
    required: true,
  },
});

const videoIdModel = mongoose.model("trailerVideoId", videoIdSchema);

module.exports.TrailerVideoId = videoIdModel;
