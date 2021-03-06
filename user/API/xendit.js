const Xendit = require("xendit-node");
const x = new Xendit({
  secretKey: "xnd_development_LpUycSx3Pn793uApqN1zqMad4rvbkouQmHiiDsGanZuY4ZEoQ7aJvlqaFfS",
});

const { Invoice } = x;
const invoice = new Invoice({});

class XenditInvoice {
  static createInvoice(transactionId, amount, payerEmail) {
    return invoice.createInvoice({
      externalID: transactionId,
      amount,
      successRedirectURL: `https://palms-client-user.web.app/thankPage`,
      payerEmail: payerEmail,
    });
  }
}
module.exports = XenditInvoice;
