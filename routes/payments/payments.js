const express = require("express");
const { v4: uuid } = require("uuid");
const stripe = require("stripe")("sk_test_wqL6m08V5M2uSQa9LzePx8dV");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("PAYMENT");
});

router.post("/", async (req, res) => {
  const { product, token } = req.body;
  console.log("PRODUCT", product);
  console.log("PRICE", product.price);

  const idempotencyKey = uuid();

  stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          amount: product.price * 100,
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email,
          description: `Purchase of ${product.name}`,
        },
        { idempotencyKey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => console.log(err));
});

module.exports = router;
