const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authAuthor");
const Controller = require("../controllers/xenditController");


router.use(authenticate);
router.post("/callbackxendit", Controller.getCallbackXendit);

router.post("/", Controller.createPayment);

module.exports = router;
