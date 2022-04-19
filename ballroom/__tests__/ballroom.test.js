const app = require("../app");
const request = require("supertest");
const { connect, client } = require("../config/mongodb");
const data = require("../seeders/ballroom-init.json");
const database = client.db("palmsBallroom");
const ballroom = database.collection("ballrooms");

beforeAll(async () => {
  try {
    await connect();
    const insertBallroom = await ballroom.insertMany(data);
    // console.log("insertBallroom: ", insertBallroom);
  } catch (error) {
    console.log("error: ", error);
  }
});

afterAll(async () => {
  await ballroom.deleteMany({});
  await client.close();
});

describe("GET /ballroom/", () => {
  describe("- success get ballroom -", () => {
    it("GET /ballroom/ - success get all ballroom", async () => {
      const res = await request(app).get("/ballroom");
      console.log("res.body: ", res.body);
      // console.log("res: ", res);
      expect(res.status).toBe(200);
      // expect(res.body).toBeInstanceOf(Array);
      // expect(res.body.length).toBeGreaterThanOrEqual(20);
    });

    // it("GET /customers/food - success get all food with accessToken", async () => {
    //   const res = await request(app).get("/customers/food").set("accessToken", accessToken);
    //   expect(res.status).toBe(200);
    //   expect(res.body).toBeInstanceOf(Array);
    //   expect(res.body.length).toBeGreaterThanOrEqual(20);
    // });

    // it("GET /customers/food - success get food page 1 (1 query params) without accessToken", async () => {
    //   const res = await request(app).get("/customers/food").query({ page: "1" });
    //   expect(res.status).toBe(200);
    //   expect(res.body).toBeInstanceOf(Object);
    //   expect(res.body).toHaveProperty("count");
    //   expect(res.body.count).toBeGreaterThanOrEqual(20);
    //   expect(res.body).toHaveProperty("rows");
    //   expect(res.body.rows).toBeInstanceOf(Array);
    //   expect(res.body.rows).toHaveLength(9);
    // });

    // it("GET /customers/food - success get food page 1 (1 query params) with accessToken", async () => {
    //   const res = await request(app)
    //     .get("/customers/food")
    //     .query({ page: "1" })
    //     .set("accessToken", accessToken);
    //   expect(res.status).toBe(200);
    //   expect(res.body).toBeInstanceOf(Object);
    //   expect(res.body).toHaveProperty("count");
    //   expect(res.body.count).toBeGreaterThanOrEqual(20);
    //   expect(res.body).toHaveProperty("rows");
    //   expect(res.body.rows).toBeInstanceOf(Array);
    //   expect(res.body.rows).toHaveLength(9);
    // });

    // it("GET /customers/food - success get food page 1, searchByName salmon, minPrice 50.000 (3 query params) without accessToken", async () => {
    //   const res = await request(app)
    //     .get("/customers/food")
    //     .query({ page: "1", searchByName: "salmon", minPrice: "50000" });
    //   expect(res.status).toBe(200);
    //   expect(res.body).toBeInstanceOf(Object);
    //   expect(res.body).toHaveProperty("count");
    //   expect(res.body.count).toBeGreaterThanOrEqual(3);
    //   expect(res.body).toHaveProperty("rows");
    //   expect(res.body.rows).toBeInstanceOf(Array);
    //   expect(res.body.rows).toHaveLength(3);
    // });

    // it("GET /customers/food - success get food page 1, searchByName salmon, minPrice 50.000 (3 query params) with accessToken", async () => {
    //   const res = await request(app)
    //     .get("/customers/food")
    //     .query({ page: "1", searchByName: "salmon", minPrice: "50000" })
    //     .set("accessToken", accessToken);
    //   expect(res.status).toBe(200);
    //   expect(res.body).toBeInstanceOf(Object);
    //   expect(res.body).toHaveProperty("count");
    //   expect(res.body.count).toBeGreaterThanOrEqual(3);
    //   expect(res.body).toHaveProperty("rows");
    //   expect(res.body.rows).toBeInstanceOf(Array);
    //   expect(res.body.rows).toHaveLength(3);
    // });

    // it("GET /customers/food/:id - success get food by Id 1", async () => {
    //   const res = await request(app).get("/customers/food/1");
    //   expect(res.status).toBe(200);
    //   expect(res.body).toBeInstanceOf(Object);
    //   expect(res.body).toHaveProperty("message", "Found data with ID 1 Success");
    //   expect(res.body).toHaveProperty("food");
    //   expect(res.body.food.id).toBe(1);
    //   expect(res.body.food).toHaveProperty("Category");
    // });
  });
});
