const { Ballroom } = require("../models/");

class BallroomController {
  static async getBallroom(req, res, next){
    try {
      const allRoom = await Ballroom.findAll()
      res.status(200).json(allRoom)
    } catch (error) {
      res.status(500).json({msg: 'error bang'})
    }
  }

  static async createBallroom(req, res, next){
    try {
      let { bookDateStart, bookDateEnd, name, price } = req.body
      const { hotelId } = req.params
      bookDateStart = new Date(bookDateStart)
      bookDateEnd = new Date(bookDateEnd)
      const dateStart = bookDateStart.getDate();
      const dateEnd = bookDateEnd.getDate();
      const difference = Math.abs(dateEnd - dateStart);
      res.status(201).json(difference)
    } catch (error) {
      console.log(err)
      next(error)
    }
  }  
}

module.exports = BallroomController
