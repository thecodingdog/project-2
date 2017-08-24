const mongoose = require('mongoose')
const osmosis = require('osmosis')
const Recipe = require('../models/Recipe')

const murl = 'mongodb://heroku_c43x4zws:a13ntpi3bn944l6i7r5v6tn99p@ds125053.mlab.com:25053/heroku_c43x4zws'

mongoose.Promise = global.Promise
mongoose.connect(murl, {
  useMongoClient: true
}).then(
  function () { // resolve cb
    console.log('connected successfully')
  },
  function (err) { // reject cb
    console.log(err)
  }
)
let n = 1
while (n<3) {
osmosis
  .get(`http://www.noobcook.com/category/recipes/asian-cuisine/chinese/page/${n}/`)
  // .set({imageUrl: '.teaserpost > a > img@src'})
  .find('.teaserpost > a')
  .follow('@href')
  .find('.print > a')
  .follow('@href')
  .set([
    osmosis
    .set({
    name: 'h2.posttitle',
    imageUrl: '.post img@src',
    imageUrlSmall: '.recipe .photo@src',
    serving: 'span.yield',
    timeDisplay: 'span.cooktime',
    instructionsUrl: '.pagenumbers .left a@href',
    ingredients: [
      osmosis
      .find('div.ingredient > ul > li')],
    instructions: [
        osmosis
        .find('div.instructions > ol > li')]
    })
  ])
  .data(
    data => {
      data.forEach(
        recipe => {
          // console.log(recipe);
          if (recipe.imageUrlSmall) {
          Recipe.findOne({name: recipe.name}, function(err,found){
            if (err) console.log(err)
            if (!found){
              Recipe.create({
                name: recipe.name,
                imageUrl: recipe.imageUrl,
                imageUrlSmall: recipe.imageUrlSmall,
                serving: recipe.serving,
                timeDisplay: recipe.timeDisplay,
                ingredients: recipe.ingredients,
                instructions: recipe.instructions,
                instructionsUrl: recipe.instructionsUrl
              })
              console.log('saved recipe');
            }
            else console.log('recipe existed before');
          })
        }
          })
        }
      )
  .error(console.log)
n++
}
