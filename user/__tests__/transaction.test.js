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

describe("Get Transaction Test By Customer Id", function(){
  describe('Success', function(){
    it('return access_token with status 200', async function(){
      const res = await request(app).get('/transaction').set("access_token", access_token)

      expect(res.status).toBe(200)  
      expect(res.body).toBeInstanceOf(Array);
    })
  })
  describe('Fail to load', function(){
    it('jwt is not provided', async function(){
      const res = await request(app).get('/transaction')

      expect(res.status).toBe(401)  
      expect(res.body).toHaveProperty("msg")
      expect(res.body).toHaveProperty("msg", res.body.msg)
    })
  })
})

describe("Get Transaction By Hotel Id Test", function(){
  describe('Success', function(){
    it('return with status 200', async function(){
      const res = await request(app).get('/transaction/331903910rw13131').set("access_token", access_token)

      expect(res.status).toBe(200)  
      expect(res.body).toBeInstanceOf(Array);
    })
  })
  describe('Fail to load', function(){
    it('jwt is not provided. return code 401', async function(){
      const res = await request(app).get('/transaction/331903910rw13131')

      expect(res.status).toBe(401)  
      expect(res.body).toHaveProperty("msg")
      expect(res.body).toHaveProperty("msg", res.body.msg)
    })
    it('Undefined Hotel Id. return code 404', async function(){
      const res = await request(app).get('/transaction/errorId4040').set("access_token", access_token)

      expect(res.status).toBe(404)  
      expect(res.body).toHaveProperty("msg")
      expect(res.body).toHaveProperty("msg", res.body.msg)
    })
  })
})


describe("Post Transaction Test", function(){
  describe('Success', function(){
    it('return access_token with status 201', async function(){
      const payload = {
        bookDateStart: '2022-02-25',
        price: 323132131
      }
      const res = await request(app).post('/transaction/1313122').set("access_token", access_token).send(payload)
      expect(res.status).toBe(201)  
      expect(res.body.transaction).toHaveProperty("id", expect.any(Number))
      expect(res.body.transaction).toHaveProperty("price")
      expect(res.body.transaction).toHaveProperty("price", expect.any(Number))
      expect(res.body.transaction).toHaveProperty("bookDateStart")
      expect(res.body.transaction).toHaveProperty("bookDateStart", expect.any(String))  
    })
  })
  describe('Booking Fail Test', function(){
    it('Book date is empty return status 400', async function(){
      const payload = {
        bookDateStart: '',
        price: 323132131
      }
      const res = await request(app).post('/transaction/1313122').set("access_token", access_token).send(payload)
      expect(res.status).toBe(400)  
      expect(res.body).toHaveProperty("msg")
      expect(res.body).toHaveProperty("msg", res.body.msg)
    })
    it('Price is empty return status 400', async function(){
      const payload = {
        bookDateStart: '2022-02-25',
        price: ''
      }
      const res = await request(app).post('/transaction/1313122').set("access_token", access_token).send(payload)
      expect(res.status).toBe(400)  
      expect(res.body).toHaveProperty("msg")
      expect(res.body).toHaveProperty("msg", res.body.msg)
      expect(res.body.msg).toBeInstanceOf(Array);
    })
    it('Unauthorized. return status 401', async function(){
      const payload = {
        bookDateStart: '2022-02-25',
        price: 13131
      }
      const res = await request(app).post('/transaction/1313122').send(payload)
      expect(res.status).toBe(401)  
      expect(res.body).toHaveProperty("msg")
      expect(res.body).toHaveProperty("msg", res.body.msg)
    })
    it('Forbidden. Admin cannot book a ballroom return status 403', async function(){
      const payload = {
        bookDateStart: '2022-02-25',
        price: 11144
      }
      const adminData = {
        email: "DavidB@gmail.com",
        password: "DavidB",
      };
      const doLogin = await request(app).post("/login").send(adminData);
      access_token = doLogin.body.token
      const res = await request(app).post('/transaction/1313122').set("access_token", access_token).send(payload)
      expect(res.status).toBe(403)  
      expect(res.body).toHaveProperty("msg")
      expect(res.body).toHaveProperty("msg", res.body.msg)
    })
  })
})
