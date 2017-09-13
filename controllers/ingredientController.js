const Ingredient = require('../models/Ingredient')
const User = require('../models/User')
// Twilio Credentials
var accountSid = 'AC60ace2e936b35e9ce2b351cf962ae9bc'
var authToken = '0074c3b9ab3598758b0204eb0429b288'

// require the Twilio module and create a REST client
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
        console.log(data[0].ingredients);
        // need to reduce this to a string data[0].ingredients.reduce((re,e,i,ar)=>e.name)
        // client.messages.create({
        //   to: '+6590227377',
        //   from: '+12602757491',
        //   body: data[0].ingredients
        // }, function (err, message) {
        //   if (err) console.log(err)
        //   console.log('sms-success')
        // })
        res.send('sms-success')
      })
  } else {
    res.render('favrecipe', {name: req.flash('name')})
  }
}

module.exports = {
  add,
  findAllById,
  deleteOne,
  sendSms
  // deleteAll
}
