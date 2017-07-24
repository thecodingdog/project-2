const User = require('../models/User')
const passport = require('../config/passport')

function create (req,res){
  var newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  })

    newUser.save(function (err, createdUser) {
      if (err) {
        req.flash('errors', err.message)
        return res.render('userAuth/register', {flash: req.flash('errors')}) //if errors
      }
      res.redirect('/search') //if success
      console.log('saved');
  })
}

module.exports = {
  create
}
