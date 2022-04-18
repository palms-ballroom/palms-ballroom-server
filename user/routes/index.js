const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");
const TransactionController = require("../controllers/TransactionController");
const { authenticate, authorizeCustomer } = require("../middleware/authAuthor");

router.get("/", AuthController.seeUser);
router.post("/login", AuthController.login);
router.post("/registerCustomer", AuthController.registerCustomer);
router.use(authenticate); //authorizeCustomer,
router.get("/transaction", TransactionController.getTransactionByCustomerId);
router.post("/transaction/:hotelId", authorizeCustomer, TransactionController.bookHotel);
router.post("/register", AuthController.register);

module.exports = router;
