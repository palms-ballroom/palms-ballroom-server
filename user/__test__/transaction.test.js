const app = require('../app')
const request = require("supertest");
const { User, Transaction, sequelize } = require("../models");
const fs = require("fs");
const { hashPassword } = require('../helpers/bcrypt')
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
});

afterAll(async () => {
  await User.destroy({ truncate: true, cascade: true, restartIdentity: true });
});



// describe("Get Transaction Test", function(){
//   describe('Success', function(){
//     it('return access_token with status 200', async function(){
//       const res = await request(app).get('/transaction').set("access_token", access_token)

//       expect(res.status).toBe(200)  
//       expect(res.body).toBeInstanceOf(Array);
//     })
//   })
// })


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
})
