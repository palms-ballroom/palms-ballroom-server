const Ballroom = require("../models/ballroomModel");

class Controller {
  static async getAll(req, res, next) {
    try {
      const ballrooms = await Ballroom.findAll();
      res.status(200).json(ballrooms);
    } catch (error) {
      next(error);
    }
  }
  static async getOne(req, res, next) {
    try {
      const ballroom = await Ballroom.findOne(req.params.hotelApiId);
      console.log(req.params.hotelApiId);
      res.status(200).json(ballroom);
    } catch (error) {
      next(error);
    }
  }
  static async getHotelByCity(req, res, next) {
    try {
      const ballrooms = await Ballroom.findByCity(req.params.city);
      res.status(200).json(ballrooms);
    } catch (error) {
      next(error);
    }
  }
  static async create(req, res, next) {
    try {
      const { hotelApiId, userId, name, pricePerHour, pricePerDay, mainImg, images1, images2, images3, images4, clicked, city } = req.body;
      console.log(req.body);
      const ballroom = await Ballroom.create({
        hotelApiId: +hotelApiId,
        userId: +userId,
        name,
        pricePerHour: +pricePerHour,
        pricePerDay: +pricePerDay,
        mainImg,
        images1,
        images2,
        images3,
        images4,
        clicked: +clicked,
        city,
      });
      res.status(201).json(ballroom);
    } catch (error) {
      next(error);
    }
  }
  static async update(req, res, next) {
    try {
      const { name, status, price, images, city, hotelApiId } = req.body;
      const ballroom = await Ballroom.update(req.params.hotelApiId, {
        name,
        status,
        price,
        images,
        city,
      });
      res.status(200).json(ballroom);
    } catch (error) {
      next(error);
    }
  }
  static async delete(req, res, next) {
    try {
      const ballroom = await Ballroom.delete(req.params.hotelApiId);
      res.status(200).json(ballroom);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
