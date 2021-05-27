const express = require("express");
//const moment = require("moment");
//const { Longevity } = require("../../model/movies/movieLongevity");

const { Orders } = require("../../model/orders/userOrders");

const router = express.Router();

router.get("/", async (req, res) => {
  const order = await Orders.find({ email: req.body.email });
  if (!order) return res.status(404).send("No order found");

  res.send(order);
});

module.exports = router;
