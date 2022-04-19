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
      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThanOrEqual(25);
    });

    it("GET /ballroom/:id - success get ballroom by Id 10391433", async () => {
      const res = await request(app).get("/ballroom/10391433");
      console.log("res.status: ", res.status);
      console.log("res.body: ", res.body);
      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("_id", expect.any(String));
      expect(res.body).toHaveProperty("id", expect.any(Number));
      expect(res.body).toHaveProperty("id", 2);
      expect(res.body).toHaveProperty("hotelApiId", expect.any(Number));
      expect(res.body).toHaveProperty("hotelApiId", 10391433);
      expect(res.body).toHaveProperty("name", expect.any(String));
      expect(res.body).toHaveProperty("name", "The Westin Jakarta");
      expect(res.body).toHaveProperty("pricePerHour", expect.any(Number));
      expect(res.body).toHaveProperty("pricePerHour", 64000000);
      expect(res.body).toHaveProperty("pricePerDay", expect.any(Number));
      expect(res.body).toHaveProperty("pricePerDay", 320000000);
      expect(res.body).toHaveProperty("mainImg", expect.any(String));
      expect(res.body).toHaveProperty("mainImg", "https://media-cdn.tripadvisor.com/media/photo-m/1280/1c/db/f1/75/international-wedding.jpg");
      expect(res.body).toHaveProperty("images1", expect.any(String));
      expect(res.body).toHaveProperty("images1", "https://media-cdn.tripadvisor.com/media/photo-m/1280/1c/db/f1/6f/wayra-level-67.jpg");
      expect(res.body).toHaveProperty("images2", expect.any(String));
      expect(res.body).toHaveProperty("images2", "https://media-cdn.tripadvisor.com/media/photo-m/1280/1c/df/24/24/exterior.jpg");
      expect(res.body).toHaveProperty("images3", expect.any(String));
      expect(res.body).toHaveProperty("images3", "https://media-cdn.tripadvisor.com/media/photo-m/1280/1c/db/f1/76/traditional-wedding.jpg");
      expect(res.body).toHaveProperty("clicked", expect.any(Number));
      expect(res.body).toHaveProperty("clicked", 0);
      expect(res.body).toHaveProperty("city", expect.any(String));
      expect(res.body).toHaveProperty("city", 'Jakarta');
      expect(res.body).toHaveProperty("booked");
    });
  
  });

  describe("- fail get ballroom -", () => {
    it("GET /ballroom/:id - fail get ballroom by Id 9999999", async () => {
      const res = await request(app).get("/ballroom/9999999");
      expect(res.body).toBeInstanceOf(Object);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Hotel not found");
    });

    it("GET /ballroom/:id - fail get ballroom by input null", async () => {
      const res = await request(app).get("/ballroom/null");
      expect(res.body).toBeInstanceOf(Object);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Hotel not found");
    });
  });
});
