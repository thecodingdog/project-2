// getting data on original page, then following to get data on inside page works!

// const mongoose = require('mongoose')
const osmosis = require('osmosis')
// const Recipe = require('../models/Recipe')

// const murl = 'mongodb://heroku_c43x4zws:a13ntpi3bn944l6i7r5v6tn99p@ds125053.mlab.com:25053/heroku_c43x4zws'

// mongoose.Promise = global.Promise
// mongoose.connect(murl, {
//   useMongoClient: true
// }).then(
//   function () { // resolve cb
//     console.log('connected successfully')
//   },
//   function (err) { // reject cb
//     console.log(err)
//   }
// )
// let n = 1
osmosis
  .get(`https://www.burpple.com/sg`)
  .find('.box.card.feed-item > a')
  .set([
    osmosis
    .set({
      location: '@href',
      insidepage:
      osmosis
      // .get(`https://www.burpple.com/sg`)
      .follow('@href')
      .set({
        name: 'h1',
        para: '.boxHeader-card-header-description'
      })
    })
  ])
  .data(
    data => {
      data.forEach(
        recipe => {
          console.log(recipe)
        })
    })
  .error(console.log)
