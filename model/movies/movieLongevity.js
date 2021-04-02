const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);

const movieLongevity = new mongoose.Schema({
  createdOn: {
    type: Date,
    default: new Date(),
  },
  longevity: {
    type: Number,
    required: true,
  },
  addedBy: {
    type: String,
  },
});

const longevityModel = mongoose.model("longevity", movieLongevity);

module.exports.Longevity = longevityModel;
