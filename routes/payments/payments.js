const express = require("express");
const { v4: uuid } = require("uuid");
//const stripe = require("stripe")("sk_test_wqL6m08V5M2uSQa9LzePx8dV");
const fetch = require("node-fetch");
const config = require("config");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("PAYMENT");
});

router.post("/", async (req, res) => {
  // amount, customerObj
  const body = {
    tx_ref: uuid(),
    amount: req.body.amount,
    currency: "USD",
    redirect_url: config.get("redirect_url"),
    payment_options: "card",
    meta: {
      consumer_id: 23,
      consumer_mac: "92a3-912ba-1192a",
    },
    customer: {
      email: req.body.email,
      phonenumber: "0205648089",
      name: "Yemi Desola",
    },
    customizations: {
      title: "ZuluCast Payment",
      description: "Watch everywhere, at anytime.",
      logo: "",
    },
  };

  const response = await fetch("https://api.flutterwave.com/v3/payments", {
    method: "POST",
    headers: {
      Authorization: config.get("flutterwave_key"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const val = await response.json();
  res.send(val.data);
});

// router.post("/", async (req, res) => {
//   const { product, token } = req.body;

//   const idempotencyKey = uuid();

//   stripe.customers
//     .create({
//       email: token.email,
//       source: token.id,
//     })
//     .then((customer) => {
//       stripe.charges.create(
//         {
//           amount: product.price * 100,
//           currency: "usd",
//           customer: customer.id,
//           receipt_email: token.email,
//           description: `Purchase of ${product.name}`,
//         },
//         { idempotencyKey }
//       );
//     })
//     .then((result) => res.status(200).json(result))
//     .catch((err) => console.log(err));
// });

module.exports = router;
