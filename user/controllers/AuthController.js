const { comparePassword } = require("../helpers/bcrypt");
const { createToken } = require("../helpers/jwt");
const { User } = require("../models/");
const axios = require("axios");

class AuthController {
  static async register(req, res, next) {
    try {
      const newAuthor = await User.create({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        role: "Admin",
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
      });
      res.status(201).json({
        msg: `Register Compleate`,
        identity: newAuthor,
      });
    } catch (err) {
      next(err);
    }
  }

  static async registerCustomer(req, res, next) {
    let data = req.body;
    console.log(data);
    try {
      const newCustomer = await User.create({
        email: data.email,
        username: data.username,
        password: data.password,
        role: "Customer",
        phoneNumber: data.phoneNumber,
        imageUrl: data.imageUrl,
        address: data.address,
      });
      res.status(201).json({
        msg: `Register Compleate`,
        identity: newCustomer,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async seeUser(req, res, next) {
    try {
      const allUser = await User.findAll();
      res.status(200).json(allUser);
    } catch (error) {
      res.status(500).json({ message: "error bos" });
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      console.log(email, password);
      const foundEmail = await User.findOne({
        where: {
          email: email,
        },
      });
      if (!foundEmail) throw { name: "invalid email/password" };

      const validatingPassword = comparePassword(password, foundEmail.password);

      if (!validatingPassword) throw { name: "invalid email/password" };

      const payload = {
        id: foundEmail.id,
        email: foundEmail.email,
        role: foundEmail.role,
      };

      const accessToken = createToken(payload);
      res.status(200).json({
        msg: "success log in",
        token: accessToken,
        id: foundEmail.id,
        email: foundEmail.email,
        role: foundEmail.role,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = AuthController;
