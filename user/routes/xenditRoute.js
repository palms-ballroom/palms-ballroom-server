const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authAuthor");
const Controller = require("../controllers/xenditController");

router.post("/callbackxendit", Controller.getCallbackXendit);

router.use(authenticate);

router.post("/", Controller.createPayment);

module.exports = router;
