const app = require("../app");
const request = require("supertest");
const { connect, client } = require("../config/mongodb");
const data = require("../seeders/ballroom-init.json");
const database = client.db("palmsBallroom");
const ballroom = database.collection("ballrooms");

beforeAll(async () => {
  try {
    await connect();
    await ballroom.insertMany(data);
  } catch (error) {
    console.log("error: ", error);
  }
});

afterAll(async () => {
  await ballroom.deleteMany({});
  await client.close();
});

describe("GET /", () => {
  describe("- success get / API endpoint -", () => {
    it("GET / - success get This is mongoDB REST API by PALMS", async () => {
      const res = await request(app).get("/");
      expect(res.status).toBe(200);
      expect(res.body).toBe("This is mongoDB REST API by PALMS");
    });
  });
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
      expect(res.body).toHaveProperty(
        "mainImg",
        "https://media-cdn.tripadvisor.com/media/photo-m/1280/1c/db/f1/75/international-wedding.jpg"
      );
      expect(res.body).toHaveProperty("images1", expect.any(String));
      expect(res.body).toHaveProperty(
        "images1",
        "https://media-cdn.tripadvisor.com/media/photo-m/1280/1c/db/f1/6f/wayra-level-67.jpg"
      );
      expect(res.body).toHaveProperty("images2", expect.any(String));
      expect(res.body).toHaveProperty(
        "images2",
        "https://media-cdn.tripadvisor.com/media/photo-m/1280/1c/df/24/24/exterior.jpg"
      );
      expect(res.body).toHaveProperty("images3", expect.any(String));
      expect(res.body).toHaveProperty(
        "images3",
        "https://media-cdn.tripadvisor.com/media/photo-m/1280/1c/db/f1/76/traditional-wedding.jpg"
      );
      expect(res.body).toHaveProperty("clicked", expect.any(Number));
      expect(res.body).toHaveProperty("clicked", 0);
      expect(res.body).toHaveProperty("city", expect.any(String));
      expect(res.body).toHaveProperty("city", "Jakarta");
      expect(res.body).toHaveProperty("booked");
    });

    it("GET /ballroom/ - success get ballroom by city Jakarta", async () => {
      const res = await request(app).get("/ballroom/city/Jakarta");
      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThanOrEqual(5);
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

    it("GET /ballroom/:id - fail get ballroom by city Palembang", async () => {
      const res = await request(app).get("/ballroom/city/Palembang");
      expect(res.body).toBeInstanceOf(Object);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Hotel not found");
    });
  });
});

describe("POST /ballroom/transaction/:hotelApiId", () => {
  describe("- success test -", () => {
    it("POST /ballroom/transaction/:hotelApiId - success test", async () => {
      const payload = {
        customerId: "4",
        bookingDate: "2022-4-1",
        name: "The Westin Jakarta",
      };
      const res = await request(app).post("/ballroom/transaction/10391433").send(payload);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "Added date to booked list");
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toHaveProperty("bookDateStart", expect.any(String));
      expect(res.body.data).toHaveProperty("price", expect.any(Number));
    });
  });

  describe("- fail test -", () => {
    it("- fail test because book same date", async () => {
      const payload = {
        customerId: "4",
        bookingDate: "2022-4-1",
        name: "The Westin Jakarta",
      };
      const res = await request(app).post("/ballroom/transaction/10391433").send(payload);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "This date is already booked");
    });

    it("- fail test because input non partner hotel Api Id", async () => {
      const payload = {
        customerId: "4",
        bookingDate: "2022-4-1",
        name: "The Westin Jakarta",
      };
      const res = await request(app).post("/ballroom/transaction/9999999").send(payload);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Hotel not registered yet");
    });
  });
});

describe("POST /ballroom/", () => {
  describe("- success test -", () => {
    it("POST /ballroom/ - success test", async () => {
      const payload = {
        hotelApiId: "301943",
        userId: "1",
        name: "The Dharmawangsa Jakarta",
        pricePerHour: 104280000,
        pricePerDay: 521400000,
        mainImg:
          "https://media-cdn.tripadvisor.com/media/photo-o/19/a6/24/46/the-dharmawangsa-jakarta.jpg",
        images1:
          "https://media-cdn.tripadvisor.com/media/photo-o/19/a6/24/46/the-dharmawangsa-jakarta.jpg",
        images2:
          "https://media-cdn.tripadvisor.com/media/photo-o/19/a6/24/46/the-dharmawangsa-jakarta.jpg",
        images3:
          "https://media-cdn.tripadvisor.com/media/photo-o/19/a6/24/46/the-dharmawangsa-jakarta.jpg",
        images4:
          "https://media-cdn.tripadvisor.com/media/photo-o/19/a6/24/46/the-dharmawangsa-jakarta.jpg",
        city: "Jakarta",
      };
      const res = await request(app).post("/ballroom").send(payload);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("insertedId", expect.any(String));
    });
  });

  describe("- fail test -", () => {
    it("- fail test because book same date", async () => {
      const payload = {
        customerId: "4",
        bookingDate: "2022-4-1",
        name: "The Westin Jakarta",
      };
      const res = await request(app).post("/ballroom/transaction/10391433").send(payload);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "This date is already booked");
    });

    it("- fail test because input non partner hotel Api Id", async () => {
      const payload = {
        customerId: "4",
        bookingDate: "2022-4-1",
        name: "The Westin Jakarta",
      };
      const res = await request(app).post("/ballroom/transaction/9999999").send(payload);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Hotel not registered yet");
    });
  });
});

describe("PUT /ballroom/:hotelApiId", () => {
  describe("- success test -", () => {
    it("PUT /ballroom/10391433 - success test", async () => {
      const payload = {
        hotelApiId: "10391433",
        userId: "1",
        name: "The Westin Jakarta",
        pricePerHour: 64000000,
        pricePerDay: 320000000,
        mainImg: "https://media-cdn.tripadvisor.com/media/photo-m/1280/1c/df/24/24/exterior.jpg",
        images1: "https://media-cdn.tripadvisor.com/media/photo-m/1280/1c/df/24/24/exterior.jpg",
        images2: "https://media-cdn.tripadvisor.com/media/photo-m/1280/1c/df/24/24/exterior.jpg",
        images3: "https://media-cdn.tripadvisor.com/media/photo-m/1280/1c/df/24/24/exterior.jpg",
        images4: "https://media-cdn.tripadvisor.com/media/photo-m/1280/1c/df/24/24/exterior.jpg",
        city: "Jakarta",
      };
      const res = await request(app).put("/ballroom/10391433").send(payload);
      expect(res.status).toBe(200);
      expect(res.body).toBe("Ballroom updated");
    });
  });

  describe("- fail test -", () => {
    it("- fail test because input non partner hotel Api Id", async () => {
      const payload = {
        hotelApiId: "999999",
        userId: "1",
        name: "The Westin Jakarta",
        pricePerHour: 64000000,
        pricePerDay: 320000000,
        mainImg: "https://media-cdn.tripadvisor.com/media/photo-m/1280/1c/df/24/24/exterior.jpg",
        images1: "https://media-cdn.tripadvisor.com/media/photo-m/1280/1c/df/24/24/exterior.jpg",
        images2: "https://media-cdn.tripadvisor.com/media/photo-m/1280/1c/df/24/24/exterior.jpg",
        images3: "https://media-cdn.tripadvisor.com/media/photo-m/1280/1c/df/24/24/exterior.jpg",
        images4: "https://media-cdn.tripadvisor.com/media/photo-m/1280/1c/df/24/24/exterior.jpg",
        city: "Jakarta",
      };
      const res = await request(app).put("/ballroom/999999").send(payload);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Hotel not found");
    });
  });
});

describe("DELETE /ballroom/:hotelApiId", () => {
  describe("- success test -", () => {
    it("DELETE /ballroom/10391433 - success test", async () => {
      const res = await request(app).delete("/ballroom/10391433");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id", expect.any(String));
      expect(res.body).toHaveProperty("id", 2);
      expect(res.body).toHaveProperty("hotelApiId", 10391433);
    });
  });

  describe("- fail test -", () => {
    it("- fail test because input non partner hotel Api Id", async () => {
      const res = await request(app).delete("/ballroom/999999");
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Hotel not found");
    });
  });
});
