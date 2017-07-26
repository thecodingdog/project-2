$(function () {
  // $(document).ready(function() { // same thing as above

  const apiUrl = 'https://api.yummly.com/v1/api/recipes?_app_id=16387952&_app_key=fa6bd04f985e3b1a42e5880de6dcb9e5&q='

  const $searchIngredients = $('#ingredientsSearch')
  const $searchResults = $('#searchResults')
  const $inputBox = $('#inputBox')

  $searchIngredients.on('click', obtainQuery)
  $('#inputBox').keypress(function (e) {
    var key = e.which;
    if(key == 13) {obtainQuery()}
  })

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
        if (e.imageUrlsBySize) {
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
        }
      })
    })
  }

  //callback function to view detailed recipe
  function idSearch (specificUrl, specific) {
    let basic = 'https://api.yummly.com/v1/api/recipe/'
    var specific = $(this).data('myval') // div.id
    let ending = '?_app_id=16387952&_app_key=fa6bd04f985e3b1a42e5880de6dcb9e5'
    var specificUrl = `${basic}${specific}${ending}`
    $.get(specificUrl).done(function (data) {
      console.log(data)
      displayRecipe(data)

    })
  }

  //callback to display recipe data in DOM
  function displayRecipe (data) {
    $('#searchResults').html('')
    $('.hero-body').html('')

    //extracting calories
    let array = data.nutritionEstimates.map(function (e){
      if (e.attribute == 'ENERC_KCAL'){
        return e.value
      }
    })
    let calories = array.filter(Boolean)

    let newRecipe = {
       serving : data.numberOfServings,
       timeDisplay : data.totalTime,
       name : data.name,
       image : data.images[0].hostedLargeUrl,
       instructions : data.source.sourceRecipeUrl,
       ingredients : data.ingredientLines, // array
       timeSeconds : data.totalTimeInSeconds,
       course : data.attributes.course,
       cuisine : data.attributes.cuisine,
       rating : data.rating,
       calories : calories[0]
    }

    let $serving = (`<p>Servings: ${newRecipe.serving}`)
    let $timeDisplay = (`<p>Time Required: ${newRecipe.timeDisplay}`)
    let $name = (`<h1>${newRecipe.name}`)
    let $image = (`<img src=${newRecipe.image}>`)
    let $instructions = (`<a href=${newRecipe.instructions}>Link to Instructions`)
    newRecipe.ingredients.forEach(function (e) {
      let $ingredient = (`<li>${e}</li>`)
      $ingredientList = $('.ingredientList')
      $ingredientList.append($ingredient)
    })
    let $course = (`<p>Course: ${newRecipe.course}`)
    let $cuisine = (`<p>Cuisine: ${newRecipe.cuisine}`)
    let $rating = (`<p>Rating: ${newRecipe.rating}`)
    let $calories = (`<p>Calories: ${calories}`)
    let $addBtn = $(`<button id='addBtn' class='enabled'>Add to Fave</button>`)
    $('#calories').append($calories)
    $('#recipePageLeft').append($name, $image, $timeDisplay, $rating)
    $('#recipePageRight').append($serving, $ingredientList, $instructions, $course, $cuisine, $addBtn)

    //to add event listener to click button that doesn't exist
    $('#recipePageRight').on('click','#addBtn',function(){
      sendPost(newRecipe)
    })
    // how to redirect to recipe index with the data
  }

  function sendPost(data){
    $.post('/favrecipe/add', data).done(function (status){
      console.log('added');
      $('#addBtn').text('ADDED!')
      $('#addBtn').removeClass('enabled')
    })
  }
})
