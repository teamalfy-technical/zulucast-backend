const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);

const superAdminSchema = new mongoose.Schema({
  addMovie: {
    type: Boolean,
    default: false,
    required: true,
  },
  updateMovie: {
    type: Boolean,
    default: false,
    required: true,
  },
  addGenre: {
    type: Boolean,
    default: false,
    required: true,
  },
  updateGenre: {
    type: Boolean,
    default: false,
    required: true,
  },
  addCustomer: {
    type: Boolean,
    default: false,
    required: true,
  },
  updateCustomer: {
    type: Boolean,
    default: false,
    required: true,
  },
  addAdmin: {
    type: Boolean,
    default: false,
    required: true,
  },
  updateAdmin: {
    type: Boolean,
    default: false,
    required: true,
  },
  modifiedDate: {
    type: Date,
    default: new Date(),
  },
});

const superAdminModel = mongoose.model("super-admin-access", superAdminSchema);

module.exports.SuperAdminAccess = superAdminModel;
