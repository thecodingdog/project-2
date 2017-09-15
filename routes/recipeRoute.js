const express = require('express')
const router = express.Router()
const recipeController = require('../controllers/recipeController')
const passport = require('../config/passport')

router.get('/', recipeController.authenticateUser, recipeController.findAllById)

router.post('/add', recipeController.add)

router.post('/addFeatRecToUser', recipeController.addFeatRecToUser)

router.put('/update', recipeController.updateNotes)

router.delete('/deleteOne', recipeController.deleteOne)

router.post('/removeAll', recipeController.destroyAll)

module.exports = router
