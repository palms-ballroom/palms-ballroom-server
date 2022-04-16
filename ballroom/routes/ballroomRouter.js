const router = require("express").Router();
const Controller = require("../controllers/BallroomController");

router.get("/", Controller.getAll); //aman
router.get("/:hotelApiId", Controller.getOne); //aman
router.get("/city/:city", Controller.getHotelByCity); //aman
router.post("/transaction/:hotelApiId", Controller.bookingHotelById); //aman
router.post("/", Controller.create); //aman
router.put("/:hotelApiId", Controller.update); //aman
router.delete("/:hotelApiId", Controller.delete); //aman

module.exports = router;
