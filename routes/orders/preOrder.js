const express = require("express");
//const moment = require("moment");
const isAuth = require("../../middleware/isAuth");
const { Longevity } = require("../../model/movies/movieLongevity");

const { PreOrders, validatePreOrder } = require("../../model/orders/preOrder");

const router = express.Router();

router.post("/", isAuth, async (req, res) => {
  const { error } = validatePreOrder(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const obj = await Longevity.findOne();

  const order = new PreOrders({
    username: req.userToken.username,
    email: req.userToken.email,
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    actor: req.body.actor,
    duration: req.body.duration,
    moviePictureURL: req.body.moviePictureURL,
    movieVideoURL: req.body.movieVideoURL,
    longevity: obj.longevity,
    //expiryDate: moment().add(7, "days"),
  });

  await order.save();
  res.send(order);
});

router.get("/", isAuth, async (req, res) => {
  const order = await PreOrders.find({ email: req.userToken.email });
  if (!order) return res.status(404).send("No order found");

  res.send(order);
});

router.delete("/delete", isAuth, async (req, res) => {
  const order = await PreOrders.deleteMany({ email: req.userToken.email });
  res.send(order);
});

module.exports = router;
