const mongoose = require('mongoose')
const Schema = mongoose.Schema

const recipeSchema = new Schema({
  name: String,
  serving: String,
  timeDisplay: String,
  imageUrl: String,
  imageUrlSmall: String,
  instructionsUrl: String,
  ingredients: [],
  timeSeconds: Number,
  course: String,
  cuisine: String,
  rating: Number,
  calories: Number,
  instructions: [],
  cookingnotes: [],
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
})

const Recipe = mongoose.model('Recipe', recipeSchema)

module.exports = Recipe
