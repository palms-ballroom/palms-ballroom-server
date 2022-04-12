const router = require("express").Router();
const Controller = require("../controllers/BallroomController");

router.get("/", Controller.getAll);
router.get("/:hotelApiId", Controller.getOne);
router.get("/city/:city", Controller.getHotelByCity);
router.post("/", Controller.create);
router.put("/:hotelApiId", Controller.update);
router.delete("/:hotelApiId", Controller.delete);
