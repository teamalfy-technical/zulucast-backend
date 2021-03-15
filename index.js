const express = require("express");

const app = express();

require("./startup/db")();
require("dotenv").config();
require("./startup/config")();
require("./startup/prod")(app);
require("./startup/routes")(app);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listen on port ${port}`));
