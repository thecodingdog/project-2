const Recipe = require('../models/Recipe')
const User = require('../models/User')
const passport = require('../config/passport')

// add to user only
function add (req, res) {
  Recipe.create({
    serving: req.body.serving,
    timeDisplay: req.body.timeDisplay,
    name: req.body.name,
    imageUrl: req.body.image,
    instructionsUrl: req.body.instructions,
    ingredients: req.body.ingredients,
    timeSeconds: req.body.timeSeconds,
    course: req.body.course[0],
    cuisine: req.body.cuisine,
    rating: req.body.rating,
    calories: req.body.calories
  }, function (err, recipe) { // remember that AJAX post can't redirect, callback is for linking recipe
  if (err) console.log(err)
    recipe.users.push(req.user.id) // first callback: push user id into recipe
    recipe.save()
    // push recipe into user, don't have to find again coz req.user is persistent thru passport
    req.user.recipes.push(recipe.id)
    req.user.save()
    // console.log(req.user)
    }
  )
}

// findAll for individual users
function findAllById (req, res) {
  if (req.user){
    User.find({_id: req.user.id})
    .populate('recipes')
    .exec(function (err, data) {
      // console.log(data[0].recipes[0]);
      if (err) send(err)
      res.render('favrecipe', {
        dbitems: data[0].recipes,
        user: req.user
      })
    })
    }
  else {res.render('favrecipe')}
}

module.exports = {
  add,
  findAllById
}
