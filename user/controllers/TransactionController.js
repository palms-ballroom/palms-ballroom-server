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
      next(error);
    }
  }

  static async getTransactionByHotelId(req, res, next) {
    try {
      const { hotelId } = req.params;
      const transactions = await Transaction.findAll({
        where: {
          hotelId,
        },
      });
      res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  }

  static async bookHotel(req, res, next) {
    try {
      let { bookDateStart, bookDateEnd, price } = req.body;
      const { hotelId } = req.params;
      bookDateStart = new Date(bookDateStart);
      // bookDateEnd = new Date(bookDateEnd);
      let obj = {
        hotelId,
        bookDateStart,
        // bookDateEnd,
        price,
        status: "UNPAID",
        customerId: req.user.id, //pake customerId ini nanti
      };
      // const dateStart = bookDateStart.getDate();
      // const dateEnd = bookDateEnd.getDate();
      // const difference = Math.abs(dateEnd - dateStart);
      const newTransaction = await Transaction.create(obj);
      res.status(201).json({
        msg: "create transaction complete",
        transaction: newTransaction,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = TransactionController;
