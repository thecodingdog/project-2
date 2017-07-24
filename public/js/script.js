$(function () {
  // $(document).ready(function() { // same thing as above

  const apiUrl = 'http://api.yummly.com/v1/api/recipes?_app_id=16387952&_app_key=fa6bd04f985e3b1a42e5880de6dcb9e5&q='

  const $searchIngredients = $('#ingredientsSearch')
  const $searchResults = $('#searchResults')
  const $inputBox = $('#inputBox')

  $searchIngredients.on('click', obtainQuery)

  function obtainQuery () {
    let query = $inputBox[0].value
    var finalUrl = `${apiUrl}${query}`
    // window.location = "/result"
    ajaxTextSearch(finalUrl, query)
  }

  function ajaxTextSearch (finalUrl, query) {
    console.log('ajaxran')
    // $spinner.fadeIn()
    // callback for all related results
    $.get(finalUrl).done(function (data) {
      // $spinner.fadeOut()
      $('.hero-body').html('')
      let results = data.matches
      console.log(results)
      results.forEach(function (e) {
        let img = e.imageUrlsBySize[90]
        img = img.replace(/s90-c/g, `s300-e300`)
        let title = e.recipeName
        let $div = $('<div>')
        $div.addClass('imgDisplay')
        $div.css('background-image', `url(${img})`)
        $div.text(title)
        $div.attr('data-myval', e.id)
        $searchResults.append($div)
        $div.on('click', idSearch)
        $div = $(this)
      })
    })
  }

  //callback function to view detailed recipe
  function idSearch (specificUrl, specific) {
    let basic = 'http://api.yummly.com/v1/api/recipe/'
    var specific = $(this).data('myval') // div.id
    let ending = '?_app_id=16387952&_app_key=fa6bd04f985e3b1a42e5880de6dcb9e5'
    var specificUrl = `${basic}${specific}${ending}`
    $.get(specificUrl).done(function (data) {
      console.log(data)
      displayRecipe(data)
      // how to redirect to recipe index with the data
    })
  }

  //callback to display recipe data in DOM
  function displayRecipe (data) {
    $('#searchResults').html('')
    $('.hero-body').html('')
    let serving = data.numberOfServings
    let timeDisplay = data.totalTime
    let name = data.name
    let image = data.images[0].hostedLargeUrl
    let instructions = data.source.sourceRecipeUrl
    let ingredients = data.ingredientLines // array
    let timeSeconds = data.totalTimeInSeconds
    let course = data.attributes.course
    let cuisine = data.attributes.cuisine
    let rating = data.rating
    let calories = data.nutritionEstimates.value
    console.log(ingredients)

    let $serving = (`<p>Servings: ${serving}`)
    let $timeDisplay = (`<p>Time Required: ${timeDisplay}`)
    let $name = (`<h1>${name}`)
    let $image = (`<img src=${image}>`)
    let $instructions = (`<a href=${instructions}>Link to Instructions`)
    ingredients.forEach(function (e) {
      let $ingredient = (`<li>${e}</li>`)
      $ingredientList = $('.ingredientList')
      $ingredientList.append($ingredient)
    })
    let $course = (`<p>Course: ${course}`)
    let $cuisine = (`<p>Cuisine: ${cuisine}`)
    let $rating = (`<p>Rating: ${rating}`)
    let $calories = (`<p>Calories: ${calories}`)
    let $addBtn = $(`<button>Add to Fave</button>`)

    $('#recipePageLeft').append($name, $image, $timeDisplay, $rating, $calories)
    $('#recipePageRight').append($serving, $ingredientList, $instructions, $course, $cuisine, $addBtn)
  }
})
