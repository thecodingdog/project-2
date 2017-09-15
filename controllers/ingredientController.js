const Ingredient = require('../models/Ingredient')
const User = require('../models/User')
const passport = require('../config/passport')

var authToken = process.env.authToken
var accountSid = process.env.accountSid
var client = require('twilio')(accountSid, authToken)

function add (req, res) {
  if (Object.keys(req.body).length !== 0) {
  // to add multiple items in req.body, should only save once!
  // if (req.body){
    let reqBody = ''
    Array.isArray(req.body.ingredient) ? reqBody = req.body.ingredient : reqBody = [req.body.ingredient]
  // let reqBody = [req.body.ingredient]

    let arr = []
    reqBody.forEach(item => {
      let tempObj = {}
      tempObj.name = item
      arr.push(tempObj)
    })

    Ingredient.create(arr
  , function (err, data) {
    if (err)console.log(err)
    data.forEach(each => {
      req.user.ingredients.push(each.id)
    })
    req.user.save()
  })
    res.redirect('/ingredient')
  } else res.redirect('/ingredient')
}

function findAllById (req, res) {
  if (req.user) {
    User.find({
      _id: req.user.id
    })
      .populate('ingredients')
      .exec(function (err, data) {
        if (err) send(err)
        res.render('ingredient', {
          dbitems: data[0].ingredients,
          user: req.user
        })
      })
  } else {
    res.render('favrecipe', {name: req.flash('name')})
  }
}

function deleteOne (req, res) {
  Ingredient.findOneAndRemove({_id: req.body.id}, function (err, data) {
    if (err) console.log(err)
    res.send({status: 'ok'})
  })
}

function sendSms (req, res) {
  if (req.user) {
    User.find({
      _id: req.user.id
    })
      .populate('ingredients')
      .exec(function (err, data) {
        if (err) console.log(err)
        // need to reduce this to a string
        var string = data[0].ingredients.map(e=>e.name).join(", ")
        console.log(string)
        client.messages.create({
          to: `+65${req.body.hp}`,
          from: '+12602757491',
          body: string
        }, function (err, message) {
          if (err) console.log(err)
          console.log('sms-success')
        })
      })
  }
  res.redirect('/favrecipe')
}

function authenticateUser (req, res, next) {
  if (req.isAuthenticated()) { return next() }
  else { res.redirect('/userAuth/login') }
} 

module.exports = {
  add,
  findAllById,
  deleteOne,
  sendSms,
  authenticateUser
}
