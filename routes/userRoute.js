//require router
const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const passport = require('../config/passport') // to reroute to a folder config, which stores the passport config

router.route('/register')
  .get(function(req,res){
    res.render('userAuth/register')
  })
  //if post registration, login user by adding a next to create in userController
  .post(userController.create, passport.authenticate('local', { //can't jump to function authenticateUser coz user has never been authenticated before! session not even been created yet.
    successRedirect: '/favrecipe',
    failureRedirect: '/userAuth/login',
  }))

//if you get login, should check if user has been logged in before if true, render fav recipe. if false, next goes login
router.route('/login')
    .get(userController.authenticateUser, function(req,res){ //if not authenticated, runs next
      // console.log(req.flash('message'))
      res.render('userAuth/login',{loginflash: req.flash('message')})
      })
    .post(passport.authenticate('local', { //this routes the login page if success or fails
      successRedirect: '/favrecipe',
      failureFlash : true,
      failureRedirect: '/userAuth/login'
    }))

router.get('/logout', function(req, res) {
  req.logout();
  console.log('logged out');
  res.redirect('/');
});

  module.exports = router
