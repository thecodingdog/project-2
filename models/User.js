const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please type your name']
  },
  email: {
    type: String,
    required: [true, 'Please type your email']
  },
  password: {
    type: String,
    required: [true, 'Please type your password']
  },
  recipes: [{
    type: Schema.Types.ObjectId,
    ref: 'Recipe'
  }],
  ingredients: [{
    type: Schema.Types.ObjectId,
    ref: 'Ingredient'
  }]
})

userSchema.pre('save', function (next) {
  var user = this
  if (!user.isModified('password')) return next()
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) return next(err)
    user.password = hash
    next()
  })
})

userSchema.methods.validPassword = function (password) {
  // Compare is a bcrypt method that will return a boolean,
  return bcrypt.compareSync(password, this.password)
}

const User = mongoose.model('User', userSchema)

module.exports = User
