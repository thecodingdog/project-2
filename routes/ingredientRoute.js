const express = require('express')
const router = express.Router()
const ingredientController = require('../controllers/ingredientController')

router.get('/', ingredientController.authenticateUser, ingredientController.findAllById)

router.post('/', ingredientController.authenticateUser, ingredientController.add)

router.post('/deleteOne', ingredientController.deleteOne)

router.post('/sendSms', ingredientController.sendSms)

module.exports = router
