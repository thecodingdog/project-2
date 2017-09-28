const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ingredientSchema = new Schema({
  name: String
  // users: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'User'
  // }]
})

const Ingredient = mongoose.model('Ingredient', ingredientSchema)

module.exports = Ingredient
