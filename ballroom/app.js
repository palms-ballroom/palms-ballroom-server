if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const cors = require("cors");
const ballroomRoute = require("./routes/ballroomRouter");
const errorHandler = require("./middlewares/errorHandler");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json("This is mongoDB REST API by PALMS");
});

app.use("/ballroom", ballroomRoute);

app.use(errorHandler);

module.exports = app;
