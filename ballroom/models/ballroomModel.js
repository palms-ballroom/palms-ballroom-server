const { getDB } = require("../config/mongodb");
const { ObjectId } = require("mongodb");

class BallroomModel {
  static async create(ballroom) {
    const db = await getDB();
    const collection = db.collection("ballroom");
    const result = await collection.insertOne(ballroom);
    return result;
  }
  static async findAll() {
    const db = await getDB();
    const collection = db.collection("ballroom");
    const result = await collection.find().toArray();
    return result;
  }
  static async findByCity(city) {
    const db = await getDB();
    const collection = db.collection("ballroom");
    const result = await collection.find({ city: city }).toArray();
    return result;
  }
  static async findOne(id) {
    const db = await getDB();
    const collection = db.collection("ballroom");
    const result = await collection.findOne({ hotelApiId: id });
    return result;
  }
  static async update(id, ballroom) {
    const db = await getDB();
    const collection = db.collection("ballroom");
    const result = await collection.updateOne({ hotelApiId: id }, { $set: ballroom });
    return result;
  }
}

module.exports = BallroomModel;
