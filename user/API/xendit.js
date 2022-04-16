const Xendit = require("xendit-node");
const x = new Xendit({
  secretKey: "xnd_development_LpUycSx3Pn793uApqN1zqMad4rvbkouQmHiiDsGanZuY4ZEoQ7aJvlqaFfS",
});

//xnd_development_LpUycSx3Pn793uApqN1zqMad4rvbkouQmHiiDsGanZuY4ZEoQ7aJvlqaFfS

const { Invoice } = x;
const invoice = new Invoice({});

class XenditInvoice {
  static createInvoice(customerId, amount, payerEmail) {
    //nanti tambahin hotelApiId di parameter
    return invoice.createInvoice({
      externalID: customerId,
      amount,
      // successRedirectURL: `https://fastorder-ican.web.app/${hotelApiId}/customer`, //ini isi sama Url page detail atau halaman yg bakal muncul setelah pembayaran
      successRedirectURL: `http://localhost:8080/1/customer`,
      payerEmail: payerEmail,
    });
  }
  static expireInvoice(invoiceID) {
    return invoice.expireInvoice({ invoiceID });
  }
  static getInvoice(invoiceID) {
    return invoice.getInvoice({ invoiceID });
  }
}
module.exports = XenditInvoice;
