const bcrypt = require("bcrypt");

function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

function comparePassword(password, hashPassword) {
  return bcrypt.compareSync(password, hashPassword);
}

module.exports = { hashPassword, comparePassword };
