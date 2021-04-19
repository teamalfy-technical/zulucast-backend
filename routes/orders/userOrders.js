const express = require("express");
const moment = require("moment");
const isAuth = require("../../middleware/isAuth");
const { Longevity } = require("../../model/movies/movieLongevity");

const { Orders, validateOrder } = require("../../model/orders/userOrders");

const router = express.Router();

// router.get("/", isAuth, (req, res) => {
//   res.send(req.userToken);
// });

router.post("/", isAuth, async (req, res) => {
  const { error } = validateOrder(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const obj = await Longevity.findOne();

  const order = new Orders({
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

router.post("/update", isAuth, async (req, res) => {
  const order = await Orders.findById(req.body._id);

  const obj = await Longevity.findOne();

  order.startWatch = true;
  order.expiryDate = moment().add(obj.longevity, "days");
  order.save();
  res.send(order);
});

// router.get("/:id", async (req, res) => {
//   const order = await Orders.findById(req.params.id);
//   if (!order) return res.status(404).send("No order found");

//   res.send(order);
// });

router.get("/", isAuth, async (req, res) => {
  const order = await Orders.find({ email: req.userToken.email });
  if (!order) return res.status(404).send("No order found");

  res.send(order);
});

router.get("/all-orders", async (req, res) => {
  const order = await Orders.find();
  if (!order) return res.status(404).send("No order found");

  res.send(order);
});

// router.get("/", async (req, res) => {
//   const orders = await Orders.find();
//   if (!orders) return res.status(404).send("No order found");

//   res.send(orders);
// });

router.delete("/delete/:id", async (req, res) => {
  const movie = await LoggedOutCart.find({ userID: req.params.id });
  if (!movie) return res.status(404).send("No movie found");

  const movieToDelete = await LoggedOutCart.find({ userID: req.params.id });
  for (let i = 0; i < movieToDelete.length; i++) movieToDelete[i].remove();
  res.send(movieToDelete);
});

module.exports = router;
