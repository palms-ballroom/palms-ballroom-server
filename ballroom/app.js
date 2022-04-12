if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 4001;
const { connect } = require("./config/mongodb");
const ballroomRoute = require("./routes/ballroomRouter");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json("This is mongoDB REST API by PALMS");
});

app.use("/ballroom", ballroomRoute);

connect()
  .then((db) => {
    console.log("db: ", db);
    app.listen(port, () => {
      console.log(`Example app listening on port http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
