if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const axios = require("axios");
const { Ballroom, Customer } = require("../models/");

class HotelController {
  static async getHotels(req, res, next) {
    try {
      const response = await axios({
        method: "get",
        url: "https://hotels4.p.rapidapi.com/properties/list",
        params: {
          destinationId: "659455",
          pageNumber: "1",
          pageSize: "25",
          checkIn: "2020-01-08",
          checkOut: "2020-01-15",
          adults1: "1",
          sortOrder: "PRICE_HIGHEST_FIRST",
          locale: "id_ID",
          currency: "IDR",
          accommodationIds: "1",
        },
        headers: {
          "x-rapidapi-host": "hotels4.p.rapidapi.com",
          "x-rapidapi-key": process.env.X_RAPIDAPI_KEY,
        },
      });
      const hotelData = response.data;
      delete hotelData.data.body.sortResults;
      delete hotelData.data.body.filters;
      delete hotelData.data.body.pointOfSale;
      delete hotelData.data.body.miscellaneous;
      delete hotelData.data.body.pageInfo;
      delete hotelData.data.common;
      hotelData.data.body.searchResults.results.forEach((el) => {
        delete el.geoBullets;
        delete el.deals;
        delete el.messaging;
        delete el.badging;
        delete el.pimmsAttributes;
        delete el.isAlternative;
      });
      res.status(200).json(hotelData);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getMarkers(req, res, next) {
    try {
      const response = await axios({
        method: "get",
        url: "https://hotels4.p.rapidapi.com/properties/list",
        params: {
          destinationId: "659455",
          pageNumber: "1",
          pageSize: "25",
          checkIn: "2020-01-08",
          checkOut: "2020-01-15",
          adults1: "1",
          sortOrder: "PRICE_HIGHEST_FIRST",
          locale: "id_ID",
          currency: "IDR",
          accommodationIds: "1",
        },
        headers: {
          "x-rapidapi-host": "hotels4.p.rapidapi.com",
          "x-rapidapi-key": process.env.X_RAPIDAPI_KEY,
        },
      });
      const hotelData = response.data;
      delete hotelData.data.body.sortResults;
      delete hotelData.data.body.filters;
      delete hotelData.data.body.pointOfSale;
      delete hotelData.data.body.miscellaneous;
      delete hotelData.data.body.pageInfo;
      delete hotelData.data.common;
      hotelData.data.body.searchResults.results.forEach((el) => {
        delete el.geoBullets;
        delete el.deals;
        delete el.messaging;
        delete el.badging;
        delete el.pimmsAttributes;
        delete el.isAlternative;
        delete el.urls;
        delete el.guestReviews;
        delete el.landmarks;
        delete el.ratePlan;
        delete el.neighbourhood;
        delete el.providerType;
        delete el.supplierHotelId;
      });
      res.status(200).json(hotelData);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getMarkersById(req, res, next) {
    try {
      const { hotelId } = req.params;
      const response = await axios({
        method: "get",
        url: "https://hotels4.p.rapidapi.com/properties/get-details",
        params: {
          id: hotelId,
          checkIn: "2020-01-08",
          checkOut: "2020-01-15",
          adults1: "1",
          currency: "IDR",
          locale: "id_ID",
        },
        headers: {
          "x-rapidapi-host": "hotels4.p.rapidapi.com",
          "x-rapidapi-key": process.env.X_RAPIDAPI_KEY,
        },
      });
      const hotelData = response.data;
      delete hotelData.data.body.hotelWelcomeRewards;
      delete hotelData.data.body.atAGlance;
      delete hotelData.data.body.smallPrint;
      delete hotelData.data.body.miscellaneous;
      delete hotelData.data.body.pageInfo;
      delete hotelData.data.body.unavailable;
      delete hotelData.data.common;
      delete hotelData.neighborhood;
      res.status(200).json(hotelData);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async bookHotel(req, res, next) {
    try {
      // BISA pake dayjs
      // BISA pake IAT, untuk formatting
      // Pake bookdatestart kalau sama gaboleh / udah ada yg booking
      // Bikin kali 2 aja dulu
      let { bookDateStart, bookDateEnd, name, price } = req.body;
      const { hotelId } = req.params;
      bookDateStart = new Date(bookDateStart);
      bookDateEnd = new Date(bookDateEnd);
      const dateStart = bookDateStart.getDate();
      const dateEnd = bookDateEnd.getDate();
      const difference = Math.abs(dateEnd - dateStart);

      console.log(price, "masuk 149 controller book hotel");
      console.log(difference, "masuk 149 controller book hotel");

      if (difference > 0) {
        price *= difference;
      } else if (difference === 0) {
        price = price;
      }

      console.log(price, "masuk 155 controller book hotel");
      console.log(name, "masuk 156 controller book hotel");

      if (price > 2000000000) {
        return res.status(400).json({ message: "Price must be lower than Rp 2.000.000.000,-" });
      }

      const booked = await Ballroom.findOne({ where: { hotelId } });

      // console.log(booked);
      if (booked) {
        const bookedDateStart = booked.bookDateStart;
        const bookedDateEnd = booked.bookDateEnd;
        console.log(bookedDateStart, "masuk 173");
        const bookedDayStart = bookedDateStart.getDate();
        console.log("masuk 175");
        const bookedDayEnd = bookedDateEnd.getDate();
        const bookedMonthStart = bookedDateStart.getMonth();
        const bookedMonthEnd = bookedDateEnd.getMonth();
        const bookedYearStart = bookedDateStart.getFullYear();
        const bookedYearEnd = bookedDateEnd.getFullYear();

        const inputMonthStart = bookDateStart.getMonth();
        const inputMonthEnd = bookDateEnd.getMonth();
        const inputYearStart = bookDateStart.getFullYear();
        const inputYearEnd = bookDateEnd.getFullYear();
        console.log(bookedYearStart, "masuk 188");
        console.log(inputYearStart, "masuk 189");
        console.log(bookedMonthStart, "masuk 190");
        console.log(inputMonthStart, "masuk 191");
        console.log(bookedDayStart, "masuk 192");
        console.log(dateStart, "masuk 193");
        console.log(bookedDayEnd, "masuk 194");
        console.log(dateStart, "masuk 195");
        console.log(difference, "masuk 196");
        if (bookedYearStart === inputYearStart) {
          if (bookedMonthStart === inputMonthStart) {
            if (bookedDayStart === dateStart) {
              if (bookedDayEnd <= dateStart + difference) {
                return res.status(400).json({ message: "Ballroom has been booked" });
              }
            }
          }
        }

        // console.log(req.body);
        const ballroom = await Ballroom.create({
          name,
          hotelId,
          bookDateStart,
          bookDateEnd,
          customerId: req.user.id,
          price,
        });
        // console.log(ballroom);
        res.status(201).json({ ballroom });
      } else if (!booked) {
        // console.log(req.body);
        const ballroom = await Ballroom.create({
          name,
          hotelId,
          bookDateStart,
          bookDateEnd,
          customerId: req.user.id,
          price,
        });
        // console.log(ballroom);
        res.status(201).json({ ballroom });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getBooked(req, res, next) {
    try {
      const ballroom = await Ballroom.findAll({
        where: { customerId: req.user.id },
        include: [{ model: Customer, attributes: { exclude: ["createdAt", "updatedAt"] } }],
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      res.status(200).json(ballroom);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  static async payBooked(req, res, next) {
    try {
      const { id } = req.params;

      const ballroom = await Ballroom.findOne({ where: { id }, include: [{ model: Customer }] });
      console.log(ballroom);
      const response = await axios({
        url: "https://api.xendit.co/v2/invoices",
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization:
            "Basic eG5kX2RldmVsb3BtZW50X0pMVEJRcnU2UzRBMXo3STRJb1YwQ1dRZjVBUEwwemVEUUhVaHVvaDVTRHpTUjA0WXdJRTc2MmRsV3JzWmJROjo=",
        },
        data: {
          external_id: `${ballroom.id}-${ballroom.hotelId}-va-success-${new Date().getTime()}`,
          amount: ballroom.price,
          payer_email: ballroom.Customer.email,
          description: `${ballroom.hotelId} - VA Sucessfull invoice payment`,
        },
      });
      const payment = response.data;
      console.log(payment);
      res.status(200).json({ url: payment.invoice_url });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = HotelController;
