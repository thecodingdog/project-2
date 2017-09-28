const User = require('../models/User')
// const passport = require('../config/passport')

function create (req, res, next) {
  var newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  })

  newUser.save(function (err, createdUser) {
    if (err) {
      req.flash('errors', err.message)
      return res.render('userAuth/register', {flash: req.flash('errors')}) // if errors
    }
    next()
  })
}

function authenticateUser (req, res, next) {
  if (!req.isAuthenticated()) {
    return next()
  } else {
    res.redirect('/favrecipe')
  }
}

module.exports = {
  create,
  authenticateUser
}
