const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/AuthController')
const BallroomController = require('../controllers/BallroomController')
const {authenticate} = require('../middleware/authAuthor')

router.get('/', AuthController.seeUser)
router.post('/login', AuthController.login)
router.use(authenticate)
router.get('/ballroom', BallroomController.getBallroom)
router.post('/ballroom/:hotelId', BallroomController.createBallroom)
router.post('/register', AuthController.register)

module.exports = router