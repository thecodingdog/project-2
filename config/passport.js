const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/User')

//passport "serializes" objects to make them easy to store, converting the user to an identifier (id)
passport.serializeUser(function (user,done){
  done(null, user.id)
  console.log(user.id);
})

// Passport "deserializes" objects by taking the user's serialization (id) and looking it up in the database
passport.deserializeUser(function(id,done){
  User.findById(id, function(err,user){
    done(err, user)
  })
})

// new local strategy that we are defining
passport.use(new LocalStrategy({
  usernameField: 'email', // this configures what u termed as username
  passwordField: 'password', // this configures what u termed as password
  passReqToCallback: true // this gives ability to call back req.body
}, localVerify))

// callback function that we are defining within localVerify
//this is triggered upon login to compare, but to see success failure processes, goes to router
function localVerify(req, passportEmail, password, next) {
  User
    .findOne({
      email: passportEmail
    })
    .exec(function (err, foundUser) {
    if (err) {
      console.log('err', err)
      return next(err) // go to failureRedirect
    }
    if (foundUser.validPassword(password)) {
      console.log('success, redirect to whatever router says')
      next(null, foundUser) // go to successRedirect
    }
    if (!foundUser.validPassword(password)) {
      console.log('password error')
      //to see error msg, need to set flash? and include flash in login page?
      next(null, err) // goes to failureRedirect
    }
  })
}

module.exports = passport
