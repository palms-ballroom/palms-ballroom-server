if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { MongoClient } = require("mongodb");
// or as an es module:
const url = process.env.MONGODB_ATLAS_URI;

// Connection URL
const client = new MongoClient(url);

// Database Name
const dbName = "palmsBallroom";

let db;

// Use connect method to connect to the server
async function connect() {
  try {
    await client.connect();
    console.log("Connected successfully to server");
    db = client.db(dbName);
    return db;
  } catch (err) {
    throw err;
  }
}

function getDB() {
  return db;
}

module.exports = {
  connect,
  getDB,
  client,
};
