const express = require('express')
const router = express.Router()
const ingredientController = require('../controllers/ingredientController')

router.post('/', ingredientController.add)

router.get('/', ingredientController.findAllById)

module.exports = router
