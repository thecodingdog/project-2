const mongoose = require('mongoose')
const Schema = mongoose.Schema

const recipeSchema = new Schema({
  name: String,
  serving : Number,
  timeDisplay : String,
  name : String,
  imageUrl : String,
  instructionsUrl : String,
  ingredients : [],
  timeSeconds : Number,
  course : String,
  cuisine : String,
  rating : Number,
  calories : Number,
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  meals: [{
    type: Schema.Types.ObjectId,
    ref: 'Meal'
  }]
})

const Recipe = mongoose.model('Recipe', recipeSchema)

module.exports = Recipe
