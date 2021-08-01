const express = require("express");
//const moment = require("moment");
//const { Longevity } = require("../../model/movies/movieLongevity");

const { Orders } = require("../../model/orders/userOrders");

const router = express.Router();

router.post("/", async (req, res) => {
  const order = await Orders.find({
    $and: [{ email: req.body.email }, { paid: true }],
  }).sort("-orderDate");
  if (!order) return res.status(404).send("No order found");

  res.send(order);
});

module.exports = router;
