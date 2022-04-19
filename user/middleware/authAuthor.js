const { User } = require("../models");
const { readToken } = require("../helpers/jwt");

let authenticate = async function (req, res, next) {
  try {
    if (!req.headers.access_token) throw { name: "jwt must be provided" };
    const token = readToken(req.headers.access_token);
    const user = await User.findOne({ where: { email: token.email } });
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

let authorizeCustomer = async function (req, res, next) {
  try {
    const { role } = req.user;
    if (role !== "Customer") {
      throw { name: "Forbidden" };
    }
    return next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  authenticate,
  authorizeCustomer,
};
