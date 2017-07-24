//require router
const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const passport = require('../config/passport') // to reroute to a folder config, which stores the passport config

// router.get('/login',function(req,res){
//   res.render('/')
// })
router.get('/register',function(req,res){
  // res.send('register Page')
  res.render('userAuth/register')
})

router.post('/register', userController.create)

router.get('/login',function(req,res){
  res.render('userAuth/login')
})

//this routes the login page if success or fails
router.post('/login', passport.authenticate('local', {
  successRedirect: '/userAuth/favrecipe',
  failureRedirect: '/userAuth/login'
}))

router.get('/favrecipe',function(req,res){
  res.render('userAuth/favrecipe')
})

router.get('/logout', function(req, res) {
  req.logout();
  console.log('logged out');
  res.redirect('/');
});

  module.exports = router
