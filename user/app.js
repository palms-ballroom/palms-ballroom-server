require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./routes");
const errHandler = require("./middleware/errhandler");
const xenditRoute = require("./routes/xenditRoute");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/xendit", xenditRoute);

app.use("/", router);

app.use(errHandler);

module.exports = app;
