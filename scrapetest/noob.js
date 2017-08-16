const osmosis = require('osmosis')

osmosis
  .get('http://www.noobcook.com/category/recipes/15-minute-shorts/')
  .find('.teaserpost > a')
  .follow('@href')
  .set({
    title: 'h2.fn',
    ingredients: [
      osmosis
      .find('div.ingredient > ul > li')
    ]
  })
  .data(function (listing) {
    console.log(listing)
  })
  .log(console.log)
  .error(console.log)
  .debug(console.log)
