const Recipe = require('../models/Recipe')
// const User = require('../models/User')
// const passport = require('../config/passport')

function findAll (req, res) {
  Recipe.find({}, function (err, data) {
    if (err) console.log(err)
    // for testing
    // res.json(data)
    res.render('home', {
      recipe: data,
      user: req.user
    })
  })
}

function findOne (req, res) {
  Recipe.findById({_id: req.params.id}, function (err, data) {
    if (err) console.log(err)
    res.render('homeOneRecipe', {
      onerecipe: data,
      user: req.user
    })
  })
}

module.exports = {
  findAll,
  findOne
}
