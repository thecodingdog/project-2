$(function () {
  // $(document).ready(function() { // same thing as above

  const apiUrl = 'https://api.yummly.com/v1/api/recipes?_app_id=16387952&_app_key=fa6bd04f985e3b1a42e5880de6dcb9e5&q='
  const page = '&maxResult=8&start='
  let start = 8

  const $searchIngredients = $('#ingredientsSearch')
  const $searchResults = $('#searchResults')
  const $inputBox = $('#inputBox')
  const $spinner = $('#spinner')

  $searchIngredients.on('click', obtainQuery)
  $('#inputBox').keypress(function (e) {
    var key = e.which
    if (key == 13) { obtainQuery() }
  })

  $('#next').on('click', obtainQuery)

  function obtainQuery () {
    let query = $inputBox[0].value
    var finalUrl = `${apiUrl}${query}${page}${start}`
    ajaxTextSearch(finalUrl, query)
    start += 8
    history.pushState({querystring :query}, "title-1", "?page=searchresults")
    // history.pushState({page: 2}, "title 2", "?page=2");
  }

  function ajaxTextSearch (finalUrl, query) {
    console.log('ajaxran')
    $spinner.fadeIn()
    // callback for all related results
    $.get(finalUrl).done(function (data) {
      $spinner.fadeOut()
      $('#next').css('display', 'inline-block')
      $('.hero-body').remove()
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
          $div.attr('data-myval', e.id)
          // title div
          let $textdiv = $('<div>')
          $textdiv.addClass('textdiv')
          $textdiv.text(title)
          $textdiv.hover()
          $div.append($textdiv)
          $searchResults.append($div)
          $div.on('click', idSearch)
          $div = $(this)
        }
      })
    })
  }

  // callback function to view detailed recipe
  function idSearch (specificUrl, specific) {
    $('#next').css('display', 'none')
    let basic = 'https://api.yummly.com/v1/api/recipe/'
    var specific = $(this).data('myval') // div.id
    let ending = '?_app_id=16387952&_app_key=fa6bd04f985e3b1a42e5880de6dcb9e5'
    var specificUrl = `${basic}${specific}${ending}`
    $.get(specificUrl).done(function (data) {
      console.log(data)
      displayRecipe(data)
      history.pushState({specificquery: specific}, "title 2", "?page=onerecipe");
    })
  }

  // to handle back thru popstate (onhashchange doens't detect on pushstate)
  // window.onpopstate = function(event){
  //   console.log("location: " + document.location + ", state: " + JSON.stringify(event.state))
  // }

  window.onpopstate = function(){
    $('#recipePageLeft').empty()
    $('#recipePageRight').empty()
    if (!window.history.state){
      window.location.href = '/'
    }
    else {
      let query = window.history.state.querystring
      var finalUrl = `${apiUrl}${query}${page}${start}`
      $('#searchResults').css('display', 'flex')
      $('.hero-body').css('display', 'block')
      $('.singleRecipeContainer').css('display', 'none')
      ajaxTextSearch (finalUrl, query)
    }
  }

  // callback to display recipe data in DOM
  function displayRecipe (data) {
    $('#searchResults').css('display', 'none')
    $('.hero-body').css('display', 'none')
    $('.singleRecipeContainer').css('display', 'flex')

    // extracting calories
    let array = data.nutritionEstimates.map(function (e) {
      if (e.attribute == 'ENERC_KCAL') {
        return e.value
      }
    })
    let calories = array.filter(Boolean)

    let newRecipe = {
      serving: data.numberOfServings,
      timeDisplay: data.totalTime,
      name: data.name,
      image: data.images[0].hostedLargeUrl,
      instructions: data.source.sourceRecipeUrl,
      ingredients: data.ingredientLines, // array
      timeSeconds: data.totalTimeInSeconds,
      // course: data.attributes.course,
      // cuisine: data.attributes.cuisine,
      rating: data.rating,
      calories: calories[0]
    }
    // building page structure
    let $ingredientul = $("<ul class='ingredientList'></ul>")
    $('#recipePageRight').append($ingredientul)
    let $bottomleftDiv = $("<div id='bottomleft'></div>")
    $('#recipePageLeft').append($bottomleftDiv)

    let $serving = (`<p><u>Servings: ${newRecipe.serving}</u>`)
    let $timeDisplay = (`<p>Time:<br> <em>${newRecipe.timeDisplay}</em>`)
    let $name = (`<h1>${newRecipe.name}`)
    let $image = (`<img src=${newRecipe.image}>`)
    let $instructions = (`<a href=${newRecipe.instructions} target="_blank"><u> Instructions</u><br></a>`)
    newRecipe.ingredients.forEach(function (e) {
      let $ingredient = (`<li>${e}</li>`)
      $ingredientList = $('.ingredientList')
      $ingredientList.append($ingredient)
    })
    // let $course = (`<p>Course: ${newRecipe.course}`)
    // let $cuisine = (`<p>Cuisine: ${newRecipe.cuisine}`)
    let $rating = (`<p>Rating: <br><em>${newRecipe.rating}</em>`)
    let $calories = (`<p>Calories: <br><em>${calories}</em>`)
    let $addBtn = $(`<button id='addBtn' class='enabled'>Add to My Meals</button><img src='/img/spinner.gif' id='spinner3'></img>
`)

    $('#recipePageLeft').append($name, $image)
    $('#bottomleft').append($calories, $rating, $timeDisplay)
    $('#recipePageRight').append($serving, $ingredientList, $instructions, $addBtn)

    // to add event listener to click button that doesn't exist
    $('#recipePageRight').on('click', '#addBtn', function (e) {
      e.preventDefault()
      $('#spinner3').fadeIn()
      $.post('/favrecipe/add', newRecipe).done(function (data) {
        if (data.status === 'ok') {
          alert('added to my meals!')
          $('#spinner3').fadeOut()
          $('#addBtn').hide()
          $('#mymeals').html('<span> New </span> - My Meals')
        } else {
          alert(data)
          window.location.href = '/userAuth/register'
        }

        // $('#addBtn').removeClass('enabled')
      })
    })
  }

  $('#delete').on('click', function (e) {
    // e.preventDefault()
    $.post('/favrecipe/removeAll').done(function () {
      alert('removed all')
    })
  })

  $('#comments').on('submit',function(){
      console.log(this)
  })

  $('.meat').on('click', function(){
    console.log($(this).attr('data'))
    let imgid = $(this).attr('data')
    $.get(`/home/one/${imgid}`).done(function (e) {
      window.location.href = `/home/one/${imgid}`
    })
  })

  $('#addBtn').on('click', function (e) {
    let id = location.pathname.split('/').pop()
    $('#spinner3').fadeIn()
    $.post('/favrecipe/linkToUser', {'id':id}).done(function (data) {
      if (data.status === 'ok') {
        alert('added to my meals!')
        $('#spinner3').fadeOut()
        $('#addBtn').hide()
        $('#mymeals').html('<span> New </span> - My Meals')
      } else {
        alert(data)
        window.location.href = '/userAuth/register'
      }
    })
  })

$('.deleteIngredients').on('click', function (e) {
  // console.log($(this).val())
  $(this).css('text-decoration', 'line-through')
  $.post('/ingredient/deleteOne', {'id':$(this).val()}).done(function(data){
    if (data.status === 'ok') {
      console.log('deleted one');
      // alert('deleted!')
    }
  })
})

    var socket = io()
})

// // adding chat page, experimental
// $(function () {
//   var socket = io()
//   $m = $('#m')
//   $button = $('button')
//   $chatform = $('#chatform')
//   $chatform.on('submit', function (e) {
//     e.preventDefault()
//     console.log('submit through ajax')
//     let msgVal = $m.val()
//     console.log(msgVal)
//     socket.emit('chat', msgVal)
//   })
//
//   socket.on('chatServer', function (msgServer) {
//     // alert(`new broadcast: ${msgServer}`)
//     $('#message').append(`<li>${msgServer}</li>`)
//   })
//
//   $name = $('#name')
//   $nameform = $('#nameform')
//   $nameform.on('submit', function (e) {
//     e.preventDefault()
//     let name = $name.val()
//     console.log(name)
//     socket.emit('username', name)
//   })
//
//   socket.on('onlinestatus', function (data) {
//     $('#message').append(`<li>${data}</li>`)
//     // alert(`new broadcast: ${data}`)
//   })
//   socket.on('offlinestatus', function (data) {
//     $('#message').append(`<li>${data}</li>`)
//     // alert(`new broadcast: ${data}`)
//   })
//
//   $isTyping = $('.hidden')
//   var userTyping = setTimeout(function () {
//     $isTyping.fadeOut()
//   }, 500)
//
//   $m.on('keydown', function (e) {
//     socket.emit('typing', 'userTyping')
//   })
//
//   socket.on('stilltyping', function (message) {
//     $('.hidden').text(message)
//     // console.log(message);
//     $isTyping.fadeIn()
//     clearInterval(userTyping)
//     userTyping = setTimeout(function () {
//       $isTyping.fadeOut()
//     }, 500)
//   })
// })
