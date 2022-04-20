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
      if (!ballroom || ballroom === null) {
        throw {
          name: "Not Found",
          code: 404,
          message: "Hotel not found",
        };
      }
      res.status(200).json(ballroom);
    } catch (error) {
      next(error);
    }
  }

  static async getHotelByCity(req, res, next) {
    try {
      const ballrooms = await Ballroom.findByCity(req.params.city);
      if (ballrooms.length === 0) {
        throw {
          name: "Not Found",
          code: 404,
          message: "Hotel not found",
        };
      }
      res.status(200).json(ballrooms);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const {
        hotelApiId,
        userId,
        name,
        pricePerHour,
        pricePerDay,
        mainImg,
        images1,
        images2,
        images3,
        images4,
        city,
      } = req.body;
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
        clicked: 0,
        city,
        booked: [
          {
            customerId: "",
            date: "",
          },
        ],
      });
      res.status(201).json(ballroom);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const {
        hotelApiId,
        userId,
        name,
        pricePerHour,
        pricePerDay,
        mainImg,
        images1,
        images2,
        images3,
        images4,
        city,
      } = req.body;
      const ballroom = await Ballroom.findOne(req.params.hotelApiId);
      if (!ballroom) {
        throw {
          name: "Not Found",
          code: 404,
          message: "Hotel not found",
        };
      }
      await Ballroom.update(req.params.hotelApiId, {
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
        city,
      });
      res.status(200).json("Ballroom updated");
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const ballroom = await Ballroom.findOne(req.params.hotelApiId);
      if (!ballroom) {
        throw {
          name: "Not Found",
          code: 404,
          message: "Hotel not found",
        };
      }
      await Ballroom.delete(req.params.hotelApiId);
      res.status(200).json(ballroom);
    } catch (error) {
      next(error);
    }
  }

  static async bookingHotelById(req, res, next) {
    try {
      const { customerId, bookingDate, name } = req.body;
      const ballroom = await Ballroom.findOne(+req.params.hotelApiId);
      if (!ballroom) {
        const newBallroom = await Ballroom.create({
          hotelApiId: +req.params.hotelApiId,
          name,
          clicked: 1,
        });
        res.status(400).json({
          message: "Hotel not registered yet",
          data: newBallroom,
        });
        return;
      } else if (!ballroom.booked) {
        await Ballroom.update(req.params.hotelApiId, {
          clicked: ballroom.clicked + 1,
        });
        res.status(400).json({
          message: "Hotel not registered yet",
        });
        return;
      }
      await Ballroom.update(req.params.hotelApiId, {
        clicked: ballroom.clicked + 1,
      });
      let isbooked = false;
      ballroom.booked.forEach((el, i) => {
        if (el.date === bookingDate) {
          isbooked = true;
        }
      });
      if (isbooked) {
        res.status(400).json({
          message: "This date is already booked",
        });
      } else {
        const newBooked = ballroom.booked;
        newBooked.push({
          customerId: +customerId,
          date: bookingDate,
        });
        await Ballroom.update(req.params.hotelApiId, {
          booked: newBooked,
        });
        res.status(200).json({
          message: "Added date to booked list",
          data: {
            bookDateStart: bookingDate,
            price: ballroom.pricePerDay,
          },
        });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
