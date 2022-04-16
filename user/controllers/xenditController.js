const { createInvoice, expireInvoice, getInvoice } = require("../API/xendit");
const { Transaction } = require("../models");

class Controller {
  static async createPayment(req, res, next) {
    const { price, hotelApiId } = req.body;
    const email = req.user.email;
    const customerId = req.user.id;
    const payment = await createInvoice(`${customerId}`, +price, email); //nanti tambah hotelApiId
    console.log(payment);
    res.status(200).json({
      message: "Invoice Created",
      data: {
        external_id: payment.external_id,
        status: payment.status,
        amount: payment.amount,
        payer_email: payment.payer_email,
        invoice_url: payment.invoice_url,
      },
    });
  }
  static async getCallbackXendit(req, res, next) {
    try {
      console.log(req.body);
      const status = req.body.status;
      if (status === "PAID") {
        const changeStatus = await Transaction.update(
          {
            status: "PAID",
          },
          {
            where: {
              CustomerId: req.body.external_id,
            },
          }
        );
        res.status(200).json({ message: "success" });
      } else {
        throw {
          code: 402,
          name: "Payment Failed",
          message: "Payment Failed",
        };
      }
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;

//contoh output nanti yang keluar, sudah di test, aman ke hit di xendit
// {
//   "payment": {
//     "id": "6259a2fd64140ad28c9cde1c",
//     "external_id": "3",
//     "user_id": "625995b6e961803f79878842",
//     "status": "PENDING",
//     "merchant_name": "Palms Ballroom",
//     "merchant_profile_picture_url": "https://du8nwjtfkinx.cloudfront.net/xendit.png",
//     "amount": 1313,
//     "payer_email": "PromiseH@gmail.com",
//     "expiry_date": "2022-04-16T16:53:18.189Z",
//     "invoice_url": "https://checkout-staging.xendit.co/web/6259a2fd64140ad28c9cde1c",
//     "available_banks": [
//       {
//         "bank_code": "MANDIRI",
//         "collection_type": "POOL",
//         "transfer_amount": 1313,
//         "bank_branch": "Virtual Account",
//         "account_holder_name": "PALMS BALLROOM",
//         "identity_amount": 0
//       },
//       {
//         "bank_code": "BRI",
//         "collection_type": "POOL",
//         "transfer_amount": 1313,
//         "bank_branch": "Virtual Account",
//         "account_holder_name": "PALMS BALLROOM",
//         "identity_amount": 0
//       },
//       {
//         "bank_code": "BNI",
//         "collection_type": "POOL",
//         "transfer_amount": 1313,
//         "bank_branch": "Virtual Account",
//         "account_holder_name": "PALMS BALLROOM",
//         "identity_amount": 0
//       },
//       {
//         "bank_code": "PERMATA",
//         "collection_type": "POOL",
//         "transfer_amount": 1313,
//         "bank_branch": "Virtual Account",
//         "account_holder_name": "PALMS BALLROOM",
//         "identity_amount": 0
//       },
//       {
//         "bank_code": "BCA",
//         "collection_type": "POOL",
//         "transfer_amount": 1313,
//         "bank_branch": "Virtual Account",
//         "account_holder_name": "PALMS BALLROOM",
//         "identity_amount": 0
//       }
//     ],
//     "available_retail_outlets": [
//       {
//         "retail_outlet_name": "ALFAMART"
//       },
//       {
//         "retail_outlet_name": "INDOMARET"
//       }
//     ],
//     "available_ewallets": [
//       {
//         "ewallet_type": "OVO"
//       },
//       {
//         "ewallet_type": "DANA"
//       },
//       {
//         "ewallet_type": "SHOPEEPAY"
//       },
//       {
//         "ewallet_type": "LINKAJA"
//       }
//     ],
//     "available_direct_debits": [
//       {
//         "direct_debit_type": "DD_BRI"
//       }
//     ],
//     "available_paylaters": [],
//     "should_exclude_credit_card": false,
//     "should_send_email": false,
//     "success_redirect_url": "http://localhost:8080/1/customer",
//     "created": "2022-04-15T16:53:18.925Z",
//     "updated": "2022-04-15T16:53:18.925Z",
//     "currency": "IDR"
//   }
// }
