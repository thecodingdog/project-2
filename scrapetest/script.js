// how to save to DB - need to connect to mongoose thru connection because normally we go thru app.js which goes thru express which has it connected!!!
// how to load all listings as array, such that data can add forEach - set as an array

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

var n = 3
// var array = []

// while (n < 2) {
var url = `http://themeatmen.sg/recipes/page/${n}/`

osmosis
    .get(url)
    .find('.thumbnail')
    .set([
      osmosis
      .set({
        location: 'a@href',
        imgUrl: 'img@src',
        insidepage:
        osmosis
        .follow('@href')
        .set({ingredients: [
          osmosis
          .find('.recipe-ingredients > ol > li > p')
        ],
          instructions: [
            osmosis
          .find('.recipe-instructions > ol > li > p')
          ],
          servings: '.recipe-header > ul > li:nth-child(1) > h3',
          time: '.recipe-header > ul > li:nth-child(2) > h3',
          name: '.entry-title'
        })
      })
    ])
    .data(
      data => {
        data.forEach(
          recipe => {
            // console.log(recipe);
            Recipe.create({
              name: recipe.insidepage.name,
              imageUrl: recipe.imgUrl,
              // imageUrlSmall: recipe.imageUrlSmall,
              serving: recipe.insidepage.servings.slice(10),
              timeDisplay: recipe.insidepage.time,
              ingredients: recipe.insidepage.ingredients,
              instructions: recipe.insidepage.instructions,
              instructionsUrl: recipe.location
            })
          })
      })
    //       recipe => {
    //         var newRecipe = new Recipe({
    //           name: recipe.title,
    //           instructionsUrl: recipe.location
    //         })
    //
    //         newRecipe.save(function (err) {
    //           if (err) console.log(err)
    //
    //           console.log('save new data')
    //         })
    //       }
    //     )
    //   })
      //   // Recipe.create({
      //   //   // serving: listing.serving,
      //   //   timeDisplay: listing.time,
      //   //   name: listing.name,
      //   //   imageUrl: listing.imgUrl,
      //   //   instructionsUrl: listing.instructions,
      //   //   ingredients: listing.ingredients
      //   // }, function (err, data) {
      //   //   if (err) console.log(err)
      //   //   console.log('saved one recipe')
      //   // })
      // }

    // .log(console.log)
    .error(console.log)
    // .debug(console.log)

  // n++
// }
