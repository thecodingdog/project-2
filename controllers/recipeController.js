const Recipe = require('../models/Recipe')
const User = require('../models/User')
const passport = require('../config/passport')
const mongoose = require('mongoose')

// need to create one instance of recipe for each user coz user notes are now shared!
function addFeatRecToUser(req,res){
  if (req.isAuthenticated()){
    // console.log(req.body)
    let currentuser = req.user
    Recipe.findById({_id: req.body.id}, function(err,copyRecipe){
      copyRecipe._id = mongoose.Types.ObjectId()
      copyRecipe.isNew = true
      copyRecipe.users.push(currentuser)
      copyRecipe.save()
        currentuser.recipes.push(copyRecipe.id)
        currentuser.save()
        res.send({status: 'ok'})
    })
  }
  else {res.send('user not logged in')}
}

// add to user only
function add (req, res) {
  //check if user is logged in
if (req.isAuthenticated()){
  Recipe.create({
    serving: req.body.serving,
    timeDisplay: req.body.timeDisplay,
    name: req.body.name,
    imageUrl: req.body.image,
    instructionsUrl: req.body.instructions,
    ingredients: req.body.ingredients,
    timeSeconds: req.body.timeSeconds,
    course: req.body.course,
    cuisine: req.body.cuisine,
    rating: req.body.rating,
    calories: req.body.calories
  }, function (err, recipe) { // remember that AJAX post can't redirect, callback is for linking recipe
    if (err) console.log(err)
    console.log(req.user)
    recipe.users.push(req.user.id) // first callback: push user id into recipe
    recipe.save()
    // push recipe into user, don't have to find again coz req.user is persistent thru passport
    req.user.recipes.push(recipe.id)
    req.user.save()
    res.send({
      status: 'ok'
    })
    // console.log(req.user)
  })
}
else {res.send('user not logged in')}
}

// findAll for individual users
function findAllById (req, res) {
  if (req.user) {
    User.find({
      _id: req.user.id
    })
      .populate('recipes')
      .exec(function (err, data) {
        // console.log(data[0].recipes[0]);
        if (err) send(err)
        res.render('favrecipe', {
          dbitems: data[0].recipes,
          user: req.user,
          // show total calories
          totalCalories: `Calories: ${data[0].recipes.reduce(sumCalories, 0)}`,
          totalTime: timeCombined(data[0].recipes)

        })
      })
  } else {
    res.render('favrecipe',{name: req.flash('name')})
  }
}

function destroyAll (req, res) {
  req.user.recipes.splice(0)
  req.user.save()
  res.redirect('/')
}

function updateNotes (req, res) {
    console.log(req.body)
    Recipe.find({
      _id: req.body.recipeid
    })
    .exec(function(err,data){
      console.log(data[0].cookingnotes)
      data[0].cookingnotes.push(req.body.comment)
      data[0].save()
      res.redirect('/favrecipe')
    })
}

function deleteOne (req, res) {
  Recipe.findOneAndRemove({
    _id: req.body.recipeid
  })
  .exec(function(err,data){
    res.redirect('/favrecipe')
  })
}

function sumCalories (re, e, i) {
  return Math.floor(re + e.calories)
}

function sumTime (re, e, i) {
  return re + e.timeSeconds
}

function convert (num) {
  if (num / 60 < 60) {
    var minutes = num / 60
    return (`Time: ${minutes} minutes required`)
  } else {
    var hours = Math.floor(num / 3600)
    var minutes = num % 3600 / 60
    return (`Time: ${hours} hours and ${minutes} minutes required`)
  }
}

function timeCombined (arr) {
  let totalSeconds = arr.reduce(sumTime, 0)
  return convert(totalSeconds)
}

function authenticateUser (req, res, next) {
  if (req.isAuthenticated()) { return next() }
  else { res.redirect('/userAuth/login') }
}

module.exports = {
  add,
  findAllById,
  destroyAll,
  updateNotes,
  deleteOne,
  authenticateUser,
  addFeatRecToUser
}
