//require router
const express = require('express')
const router = express.Router()
const recipeController = require('../controllers/recipeController')
const passport = require('../config/passport')

router.get('/', recipeController.findAllById)

router.post('/add', recipeController.add)

// router.post('/remove', recipeController.create)

// router.post('/removeAll', recipeController.create)

  module.exports = router
