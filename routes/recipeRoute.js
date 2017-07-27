//require router
const express = require('express')
const router = express.Router()
const recipeController = require('../controllers/recipeController')
const passport = require('../config/passport')

router.get('/', recipeController.authenticateUser, recipeController.findAllById)

router.post('/add', recipeController.add)

router.post('/removeAll', recipeController.destroyAll)

router.post('/update', recipeController.update)

  module.exports = router
