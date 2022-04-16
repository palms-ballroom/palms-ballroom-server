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
      res.status(500).json({ msg: "error bang" });
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
