const express = require("express");
const moment = require("moment");
const isAuth = require("../../middleware/isAuth");

const { Orders, validateOrder } = require("../../model/orders/userOrders");

const router = express.Router();

router.get("/", (req, res) => {
  res.send(moment().add(3, "days"));
});

router.post("/", isAuth, async (req, res) => {
  const { error } = validateOrder(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const order = new Orders({
    username: req.body.username,
    email: req.body.email,
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    actor: req.body.actor,
    duration: req.body.duration,
    moviePictureURL: req.body.moviePictureURL,
    movieVideoURL: req.body.movieVideoURL,
    expiryDate: moment().add(7, "days"),
  });

  await order.save();
  res.send(order);
});

router.get("/:id", async (req, res) => {
  const order = await Orders.findById(req.params.id);
  if (!order) return res.status(404).send("No order found");

  res.send(order);
});

router.get("/", async (req, res) => {
  const orders = await Orders.find();
  if (!orders) return res.status(404).send("No order found");

  res.send(orders);
});

router.delete("/delete/:id", async (req, res) => {
  const movie = await LoggedOutCart.find({ userID: req.params.id });
  if (!movie) return res.status(404).send("No movie found");

  const movieToDelete = await LoggedOutCart.find({ userID: req.params.id });
  for (let i = 0; i < movieToDelete.length; i++) movieToDelete[i].remove();
  res.send(movieToDelete);
});

module.exports = router;
