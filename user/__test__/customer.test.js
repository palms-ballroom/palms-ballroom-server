const app = require('../app')
const request = require("supertest");
const { User, sequelize } = require("../models");
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

//register customer related
describe("POST /registerCustomer", function(){
  describe("POST /register - success", function(){
    it('should return an object with status 201', async function(){
     const payload = {
      username: 'coba3',
      email: 'coba3@mail.com',
      password: 'coba3',
      address: 'jalan jester',
      phoneNumber: 85270011660,
      imageUrl: 'dwkdwokwokdwok'
    }
      const res = await request(app).post('/registerCustomer').send(payload)
      console.log(res.body.identity.password, '<<<<<<<')
      expect(res.statusCode).toBe(201);
      expect(res.body.identity).toHaveProperty("id")
      expect(res.body.identity).toHaveProperty("id", expect.any(Number))
      expect(res.body.identity).toHaveProperty("email")
      expect(res.body.identity).toHaveProperty("email", expect.any(String)) 
      expect(res.body.identity).toHaveProperty("password")
      expect(res.body.identity).toHaveProperty("password", expect.any(String)) 
    })
  })

  describe("POST /customer/register - fail", function(){
    it('email is empty. should return object with status 400', async function(){
      const payload = { email: '', password: 'random'}
      const res = await request(app).post('/registerCustomer').send(payload)
      expect(res.statusCode).toBe(400)
      expect(res.body).toHaveProperty('msg')
      expect(res.body).toHaveProperty('msg', res.body.msg)
    })

    it('password is empty. should return object with status 400', async function(){
      const payload = { email: 'random3@mail.com', password: ''}
      const res = await request(app).post('/registerCustomer').send(payload)
      expect(res.statusCode).toBe(400)
      expect(res.body).toHaveProperty('msg')
      expect(res.body).toHaveProperty('msg', res.body.msg)
    })

    it('Email has been used by other user. should return object with status 400', async function(){
      const payload = { email: 'random1@mail.com', password: 'random'}
      const res = await request(app).post('/registerCustomer').send(payload)
      expect(res.statusCode).toBe(400)
      expect(res.body).toHaveProperty('msg')
      expect(res.body).toHaveProperty('msg', res.body.msg)
    })

    it('Incorrent email format. should return object with status 400', async function(){
      const payload = { email: 'random6.com', password: 'random'}
      const res = await request(app).post('/registerCustomer').send(payload)
      expect(res.statusCode).toBe(400)
      expect(res.body).toHaveProperty('msg')
      expect(res.body).toHaveProperty('msg', res.body.msg)
    })

    it('Email has been used. should return object with status 400', async function(){
      const payload = { email: 'WikaS@gmail.com', password: 'random'}
      const res = await request(app).post('/registerCustomer').send(payload)
      expect(res.statusCode).toBe(400)
      expect(res.body).toHaveProperty('msg')
      expect(res.body).toHaveProperty('msg', res.body.msg)
    })

    it('email is null. should return object with status 400', async function(){
      const payload = { email: null, password: 'random'}
      const res = await request(app).post('/registerCustomer').send(payload)
      expect(res.statusCode).toBe(400)
      expect(res.body).toHaveProperty('msg')
      expect(res.body).toHaveProperty('msg', res.body.msg)
    })
  })
})

// ////register Admin


describe("POST /register", function(){
  describe("POST /register - success", function(){
    it('should return an object with status 201', async function(){
     const payload = {
      username: 'coba10',
      email: 'coba10@mail.com',
      password: 'coba10',
      address: 'jalan jester',
      phoneNumber: 85270011660,
      imageUrl: 'dwkdwokwokdwok'
    }

      const res = await request(app).post("/register").set("access_token", access_token).send(payload);
      expect(res.statusCode).toBe(201);
      expect(res.body.identity).toHaveProperty("id")
      expect(res.body.identity).toHaveProperty("id", expect.any(Number))
      expect(res.body.identity).toHaveProperty("email")
      expect(res.body.identity).toHaveProperty("email", expect.any(String))
      expect(res.body.identity).toHaveProperty("password")
      expect(res.body.identity).toHaveProperty("password", expect.any(String)) 
    })
  })

  describe("POST /register - fail", function(){
    it('email is empty. should return object with status 400', async function(){
      const payload = { email: '', password: 'random'}
      const res = await request(app).post("/register").set("access_token", access_token).send(payload);
      expect(res.statusCode).toBe(400)
      expect(res.body).toHaveProperty('msg')
      expect(res.body).toHaveProperty('msg', res.body.msg)
    })

    it('password is empty. should return object with status 400', async function(){
      const payload = { email: 'random3@mail.com', password: ''}
      const res = await request(app).post("/register").set("access_token", access_token).send(payload);
      expect(res.statusCode).toBe(400)
      expect(res.body).toHaveProperty('msg')
      expect(res.body).toHaveProperty('msg', res.body.msg)
    })

    it('Email has been used by other user. should return object with status 400', async function(){
      const payload = { email: 'random1@mail.com', password: 'random'}
      const res = await request(app).post("/register").set("access_token", access_token).send(payload);
      expect(res.statusCode).toBe(400)
      expect(res.body).toHaveProperty('msg')
      expect(res.body).toHaveProperty('msg', res.body.msg)
    })

    it('Incorrent email format. should return object with status 400', async function(){
      const payload = { email: 'random6.com', password: 'random'}
      const res = await request(app).post("/register").set("access_token", access_token).send(payload);
      expect(res.statusCode).toBe(400)
      expect(res.body).toHaveProperty('msg')
      expect(res.body).toHaveProperty('msg', res.body.msg)
    })
    it('Unauthorized. should return object with status 401', async function(){
      const payload = { email: 'random1@mail.com', password: 'random'}
      const res = await request(app).post('/register').send(payload)
      expect(res.statusCode).toBe(401)
      expect(res.body).toHaveProperty('msg')
      expect(res.body).toHaveProperty('msg', res.body.msg)
    })
    it('Email has been used. should return object with status 400', async function(){
      const payload = { email: 'WikaS@gmail.com', password: 'random'}
      const res = await request(app).post('/register').set("access_token", access_token).send(payload)
      expect(res.statusCode).toBe(400)
      expect(res.body).toHaveProperty('msg')
      expect(res.body).toHaveProperty('msg', res.body.msg)
    })
  })
})

// //login user

describe("Login test", function(){
  describe('login success', function(){
    it('return access_token with status 200', async function(){
      const payload = { email: 'WikaS@gmail.com', password: 'WikaS' }
      const res = await request(app).post('/login').send(payload)

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('token')
      expect(res.body).toHaveProperty('token', expect.any(String))
    })
  })

  describe('login fail', function(){
    it('email not found in database. return code 400', async function(){
      const payload = { email: 'budi@mail.com', password: 'random' }
      const res = await request(app).post('/login').send(payload)

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('msg')
      expect(res.body).toHaveProperty('msg', 'invalid email/password')
    })

    it('Incorrect password. return code 400', async function(){
      const payload = { email: 'WikaS@gmail.com', password: 'budi' }
      const res = await request(app).post('/login').send(payload)

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('msg')
      expect(res.body).toHaveProperty('msg', 'invalid email/password')
    })
  })
})


// //see user

describe("Get User", function(){
  describe('Success', function(){
    it('return access_token with status 200', async function(){
      const res = await request(app).get('/')

      expect(res.status).toBe(200)  
      expect(res.body).toBeInstanceOf(Array);
    })
  })
})




