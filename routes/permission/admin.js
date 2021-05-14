const express = require("express");
const isAuth = require("../../middleware/isAuth");
const isSuperAdmin = require("../../middleware/isSuperAdmin");
const { AdminAccess } = require("../../model/permission/admin");

const router = express.Router();

router.post("/", [isAuth, isSuperAdmin], async (req, res) => {
  let access = await AdminAccess.findOne();
  //if (!access) return res.status(404).send("No access found");

  if (!access) {
    const adminAccess = new AdminAccess({
      addMovie: req.body.addMovie,
      updateMovie: req.body.updateMovie,
      addGenre: req.body.addGenre,
      updateGenre: req.body.updateGenre,
      addCustomer: req.body.addCustomer,
      updateCustomer: req.body.updateCustomer,
      addAdmin: req.body.addAdmin,
      updateAdmin: req.body.updateAdmin,
    });
    await adminAccess.save();
    res.send(adminAccess);
  } else {
    (access.addMovie = req.body.addMovie),
      (access.updateMovie = req.body.updateMovie),
      (access.addGenre = req.body.addGenre),
      (access.updateGenre = req.body.updateGenre),
      (access.addCustomer = req.body.addCustomer),
      (access.updateCustomer = req.body.updateCustomer),
      (access.addAdmin = req.body.addAdmin),
      (access.updateAdmin = req.body.updateAdmin),
      await access.save();
    res.send("Ok");
  }
});

router.get("/", [isAuth, isSuperAdmin], async (req, res) => {
  let access = await AdminAccess.findOne();
  if (!access) return res.send("Kindly save access level");
  res.send(access);
});

module.exports = router;
