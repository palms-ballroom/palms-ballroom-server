if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { MongoClient } = require("mongodb");
// or as an es module:
// import { MongoClient } from 'mongodb'
const url = process.env.MONGODB_ATLAS_URI;
// Connection URL
const client = new MongoClient(url);

// Database Name
const dbName = "ballroom";

let db;

async function connect() {
  try {
    await client.connect();
    console.log("Connected successfully to server");
    db = client.db(dbName);
    return db;
  } catch (err) {
    throw err;
  }
  // Use connect method to connect to the server
}

function getDB() {
  return db;
}

module.exports = {
  connect,
  getDB,
};
