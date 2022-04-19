require('dotenv').config()
const express = require("express");
const app = express();
// const PORT = process.env.PORT || 4002;
const cors = require("cors");
const router = require("./routes");
const errHandler = require("./middleware/errhandler");
const xenditRoute = require("./routes/xenditRoute");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/", router);
app.use("/xendit", xenditRoute);

app.use(errHandler);

// app.listen(PORT, function () {
//   console.log(`online ${PORT}`);
// });

module.exports = app
