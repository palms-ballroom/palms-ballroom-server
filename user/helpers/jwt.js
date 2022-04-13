if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const jwt = require("jsonwebtoken");

function createToken(payload) {
  return jwt.sign(payload, process.env.JWTKEY);
}

function readToken(token) {
  return jwt.verify(token, process.env.JWTKEY);
}

module.exports = { createToken, readToken };
