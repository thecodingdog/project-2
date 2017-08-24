const express = require('express')
const router = express.Router()
const homeController = require('../controllers/homeController')
// const passport = require('../config/passport')

router.get('/all', homeController.findAll)

router.get('/one/:id', homeController.findOne)

module.exports = router
