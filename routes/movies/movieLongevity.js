const express = require("express");
const isAuth = require("../../middleware/isAuth");
const { Longevity } = require("../../model/movies/movieLongevity");

const router = express.Router();

router.post("/", async (req, res) => {
  const movieLongevity = await Longevity.findOne();
  if (!movieLongevity) {
    const newLongevity = new Longevity({
      longevity: req.body.longevity,
      playOnHover: req.body.playOnHover === "Yes, play on hover" ? true : false,
      addedBy: "req.userToken.username",
    });
    await newLongevity.save();
    res.send(newLongevity);
  } else {
    movieLongevity.longevity = req.body.longevity;
    (movieLongevity.playOnHover =
      req.body.playOnHover === "Yes, play on hover" ? true : false),
      (movieLongevity.addedBy = "new user");
    await movieLongevity.save();
    res.send(movieLongevity);
  }
});

router.get("/", async (req, res) => {
  const longevity = await Longevity.findOne();
  res.send(longevity);
});

router.put("/", isAuth, async (req, res) => {
  const obj = await Longevity.findOne();
  obj.longevity = req.body.longevity;
  obj.playOnHover = req.body.playOnHover;
  obj.addedBy = req.userToken.username;
  await obj.save();
  res.send(obj);
});

module.exports = router;

// server {
//   listen          80;
//   server_name     _;
//   location / {
//     proxy_pass http://172.31.20.166:3000;
//     proxy_http_version 1.1;
//     proxy_http_version 1.1;
//     proxy_set_header Connection 'upgrade';
//     proxy_set_header Host $host;
//     proxy_cache_bypass $http_upgrade;
// }
// }

// server {
//   listen 80;
//   server_name domain name;
//   return 301 https://$host$request_uri;
// }

// server {
// listen 443 ssl;

// server_name _
// ssl_certificate /etc/letsencrypt/live/domain name/fullchain.pem; # managed by Certbot
// ssl_certificate_key /etc/letsencrypt/live/domain name/privkey.pem; # managed by Certbot

// ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
// ssl_prefer_server_ciphers on;
// ssl_ciphers 'EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH';

// location / {
//   proxy_pass http://ip address : port;
//   proxy_http_version 1.1;
//   proxy_set_header Upgrade $http_upgrade;
//   proxy_set_header Connection 'upgrade';
//   proxy_set_header Host $host;
//   proxy_cache_bypass $http_upgrade;
// }
// }
