const app = require('../app')
const request = require("supertest");
const { User, Transaction, sequelize } = require("../models");
const fs = require("fs");
const { hashPassword } = require('../helpers/bcrypt');
const queryInterface = sequelize.getQueryInterface();

let access_token;

beforeAll(async () => {
  await User.destroy({ truncate: true, cascade: true, restartIdentity: true });
  const UserData = JSON.parse(fs.readFileSync("./data/user.json"));
  UserData.forEach((el) => {
    el.password = hashPassword(el.password);
    el.createdAt = new Date();
    el.updatedAt = new Date();
  });
  await queryInterface.bulkInsert("Users", UserData, {});
  const payload = {
    email: "WikaS@gmail.com",
    password: "WikaS",
  };
  const res = await request(app).post("/login").send(payload);
  access_token = res.body.token;

  //transaction related
  await Transaction.destroy({ truncate: true, cascade: true, restartIdentity: true });
  const Newtransaction = JSON.parse(fs.readFileSync("./data/ballRoom.json"));
  Newtransaction.forEach((el) => {
    el.createdAt = new Date();
    el.updatedAt = new Date();
    el.bookDateStart = new Date(el.bookDateStart)
    el.bookDateEnd = new Date(el.bookDateEnd)
  });
  await queryInterface.bulkInsert("Transactions", Newtransaction, {})
});

afterAll(async () => {
  await User.destroy({ truncate: true, cascade: true, restartIdentity: true });
  await Transaction.destroy({ truncate: true, cascade: true, restartIdentity: true });
});

describe("Create Payment test", function(){
  describe('Payment success', function(){
    it('return access_token with status 201', async function(){
      const payload = { 
        price: 50000,
        hotelApiId: 'cobaId4040',
        transactionId: "1",
       }
      const res = await request(app).post('/xendit').set("access_token", access_token).send(payload)
      expect(res.status).toBe(201)
      expect(res.body.data).toHaveProperty('external_id')
      expect(res.body.data).toHaveProperty('external_id', expect.any(String))
      expect(res.body.data).toHaveProperty('amount')
      expect(res.body.data).toHaveProperty('amount', expect.any(Number))
    })
  })
  describe('Payment fail', function(){
    it('price is empty. return code 400', async function(){
      const payload = { 
        price: '',
        hotelApiId: 'randomId4040',
        transactionId: 4
       }
      const res = await request(app).post('/xendit').set("access_token", access_token).send(payload)

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty("msg")
      expect(res.body).toHaveProperty("msg", res.body.msg)
    })
    it('Transaction is empty. return code 400', async function(){
      const payload = { 
        price: 50000,
        hotelApiId: 'randomId4040',
        transactionId: ''
       }
      const res = await request(app).post('/xendit').set("access_token", access_token).send(payload)

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty("msg")
      expect(res.body).toHaveProperty("msg", res.body.msg)
    })
    it('Unauthorized. return status 401', async function(){
      const payload = { 
        price: 50000,
        hotelApiId: 'randomId4040',
        transactionId: "4"
       }
      const res = await request(app).post('/xendit').send(payload)

      expect(res.status).toBe(401)
      expect(res.body).toHaveProperty("msg")
      expect(res.body).toHaveProperty("msg", res.body.msg)
    })
  })
})

describe("Update Payment from UNPAID to PAID test", function(){
  describe('Update success', function(){
    it('return access_token with status 201', async function(){
      const payload = { 
        status: "PAID",
        external_id: 1
       }
      const res = await request(app).post('/xendit/callbackxendit').set("access_token", access_token).send(payload)
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty("msg")
      expect(res.body).toHaveProperty("msg", res.body.msg)
    })
  })
  describe('Update Fail', function(){
    it('Unauthorized. return status 401', async function(){
      const payload = { 
        status: "PAID",
        external_id: 1
       }
      const res = await request(app).post('/xendit/callbackxendit').send(payload)
      expect(res.status).toBe(401)
      expect(res.body).toHaveProperty("msg")
      expect(res.body).toHaveProperty("msg", res.body.msg)
    })
    it('Transaction id is not a number. return status 400', async function(){
      const payload = { 
        status: "PAID",
        external_id: 'randomId'
       }
      const res = await request(app).post('/xendit/callbackxendit').set("access_token", access_token).send(payload)

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty("msg")
      expect(res.body).toHaveProperty("msg", res.body.msg)
    })
    it('Transaction Id not found. return status 404', async function(){
      const payload = { 
        status: "PAID",
        external_id: 999999999
       }
      const res = await request(app).post('/xendit/callbackxendit').set("access_token", access_token).send(payload)
      expect(res.status).toBe(404)
      expect(res.body).toHaveProperty("msg")
      expect(res.body).toHaveProperty("msg", res.body.msg)
    })
    it('Transaction fail during create payment. return status 404', async function(){
      const payload = { 
        status: "PENDING",
        external_id: 2
       }
      const res = await request(app).post('/xendit/callbackxendit').set("access_token", access_token).send(payload)
      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty("msg")
      expect(res.body).toHaveProperty("msg", res.body.msg)
    })
  })
})