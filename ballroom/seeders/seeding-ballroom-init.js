if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { MongoClient } = require("mongodb");
const data = require("./ballroom-init.json");

// Replace the uri string with your MongoDB deployment's connection string.
const url = process.env.MONGODB_ATLAS_URI || "mongodb+srv://palmsballroom:rendang$2022@cluster0.3pvnk.mongodb.net/ballroom?retryWrites=true&w=majority";

const client = new MongoClient(url);

async function run() {
  try {
    await client.connect();

    const database = client.db("palmsBallroom");
    const ballroom = database.collection("ballrooms");
    data.forEach((el) => {
      delete el.id;
    });

    const insertBallroom = await ballroom.insertMany(data);

    console.log(insertBallroom);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
