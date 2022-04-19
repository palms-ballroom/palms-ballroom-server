const { createInvoice } = require("../API/xendit");
const { Transaction } = require("../models");

class Controller {
  static async createPayment(req, res, next) {
    try {
      const { price } = req.body;
      const email = req.user.email;
      const hotelApiId = req.body.hotelApiId;
      const transactionId = req.body.transactionId;
      const payment = await createInvoice(transactionId, +price, hotelApiId, email);
      res.status(201).json({
        message: "Invoice Created",
        data: {
          external_id: payment.external_id,
          status: payment.status,
          amount: payment.amount,
          payer_email: payment.payer_email,
          invoice_url: payment.invoice_url,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCallbackXendit(req, res, next) {
    try {
      const status = req.body.status;
      if (status === "PAID") {
        const updateOne = await Transaction.update(
          {
            status: "PAID",
          },
          {
            where: {
              id: req.body.external_id,
            },
          }
        );
        if (updateOne[0] === 0) throw { name: "Transaction id not found" };
        res.status(200).json({ msg: "success" });
      } else {
        throw { name: "Payment Fail" };
      }
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
