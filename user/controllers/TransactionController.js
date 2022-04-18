const { Transaction } = require("../models");

class TransactionController {
  static async getTransactionByCustomerId(req, res, next) {
    try {
      const allRoom = await Transaction.findAll({
        where: {
          customerId: req.user.id,
        },
      });
      res.status(200).json(allRoom);
    } catch (error) {
      next(error)
    }
  }

  static async bookHotel(req, res, next) {
    try {
      let { bookDateStart, price } = req.body;
      const { hotelId } = req.params;
      bookDateStart = new Date(bookDateStart);
      let obj = {
        hotelId,
        bookDateStart,
        price,
        status: "UNPAID",
        customerId: req.user.id
      };
      const newTransaction = await Transaction.create(obj);
      res.status(201).json({
        msg: "create transaction complete",
        transaction: newTransaction,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TransactionController;
