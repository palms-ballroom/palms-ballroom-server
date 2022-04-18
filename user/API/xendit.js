const Xendit = require("xendit-node");
const x = new Xendit({
  secretKey: "xnd_development_LpUycSx3Pn793uApqN1zqMad4rvbkouQmHiiDsGanZuY4ZEoQ7aJvlqaFfS",
});

const { Invoice } = x;
const invoice = new Invoice({});

class XenditInvoice {
  static createInvoice(customerId, amount, payerEmail) {
    return invoice.createInvoice({
      externalID: customerId,
      amount,
      successRedirectURL: `http://localhost:8080/1/customer`,
      payerEmail: payerEmail,
    });
  }
}
module.exports = XenditInvoice;
