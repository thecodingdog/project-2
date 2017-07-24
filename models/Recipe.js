const mongoose = require('mongoose')
const Schema = mongoose.Schema

const receipeSchema = new Schema({
  name: {type: String},
  serving = {type: Number},
  timeDisplay = {type: String},
  name = {type: String},
  imageUrl = {type: String},
  instructionsUrl = {type: String},
  ingredients = [],
  timeSeconds = {type: Number},
  course = {type: String},
  cuisine = {type: String},
  rating = {type: Number},
  calories = {type: Number},
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'Recipe'
  }],
  meals: [{
    type: Schema.Types.ObjectId,
    ref: 'Meal'
  }]
})

const Recipe = mongoose.model('Recipe', recipeSchema)

module.exports = Recipe
