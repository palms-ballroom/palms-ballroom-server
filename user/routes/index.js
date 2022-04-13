const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/AuthController')
const TransactionController = require('../controllers/TransactionController')
const {authenticate, authorizeCustomer} = require('../middleware/authAuthor')

router.get('/', AuthController.seeUser)
router.post('/login', AuthController.login)
router.get('/ballroom', TransactionController.getTransaction)
router.use(authenticate)
router.post('/ballroom/:hotelId',authorizeCustomer, TransactionController.bookHotel)
router.post('/register', AuthController.register)

module.exports = router