/* global $:true */
/* global toastr:true */
$(function () {
  const apiUrl = 'https://api.yummly.com/v1/api/recipes?_app_id=16387952&_app_key=fa6bd04f985e3b1a42e5880de6dcb9e5&q='
  const page = '&maxResult=8&start='
  let start = 12

  const $searchIngredients = $('#ingredientsSearch')
  const $searchResults = $('#searchResults')
  const $inputBox = $('#inputBox')
  const $spinner = $('#spinner')

  $searchIngredients.on('click', obtainQuery)
  $('#inputBox').keypress(function (e) {
    var key = e.which
    if (key === 13) {
      obtainQuery()
    }
  })

  $(window).on('scroll', function () {
    var divht = $('#searchResults').innerHeight()
    if (divht && $(this).scrollTop() * 30 > divht) {
      obtainQuery()
    }
  })

  function obtainQuery () {
    let query = $inputBox[0].value
    var finalUrl = `${apiUrl}${query}${page}${start}`
    ajaxTextSearch(finalUrl, query)
    start += 12
    window.history.pushState({
      querystring: query
    }, 'title-1', '?page=searchresults')
  }

  function ajaxTextSearch (finalUrl, query) {
    $spinner.fadeIn()
    $.get(finalUrl).done(function (data) {
      $spinner.fadeOut()
      $('.searchback').remove()
      $('.featuredSection').empty()
      let results = data.matches
      results.forEach(function (e) {
        if (e.imageUrlsBySize) {
          let img = e.imageUrlsBySize[90]
          img = img.replace(/s90-c/g, `s300-e300`)
          let title = e.recipeName
          let $div = $('<div>')
          $div.addClass('imgDisplay')
          $div.attr('data-myval', e.id)
          let $img = $('<img>')
          $img.attr('src', `${img}`)
          $div.append($img)
          let $p = $('<p>')
          $p.text(title)
          $div.append($p)
          $searchResults.append($div)
          $div.on('click', idSearch)
          $div = $(this)
        }
      })
    })
  }

  // callback function to view detailed recipe
  function idSearch (specificUrl, specific) {
    let basic = 'https://api.yummly.com/v1/api/recipe/'
    specific = $(this).data('myval') // div.id
    let ending = '?_app_id=16387952&_app_key=fa6bd04f985e3b1a42e5880de6dcb9e5'
    specificUrl = `${basic}${specific}${ending}`
    $.get(specificUrl).done(function (data) {
      displayRecipe(data)
      window.history.pushState({
        specificquery: specific
      }, 'title 2', '?page=onerecipe')
    })
  }

  // to handle back thru popstate
  window.onpopstate = function () {
    $('#singleRecipeContainer').empty()
    if (!window.history.state) {
      window.location.href = '/'
    } else {
      let query = window.history.state.querystring
      var finalUrl = `${apiUrl}${query}${page}${start}`
      $('#searchResults').css('display', 'block')
      $('#singleRecipeContainer').css('display', 'none')
      $('.one').remove()
      ajaxTextSearch(finalUrl, query)
    }
  }
  var newRecipe = {}
  // callback to display recipe data in DOM
  function displayRecipe (data) {
    $('#searchResults').css('display', 'none')
    $('.searchback').remove()
    $('#singleRecipeContainer').css('display', 'flex')

    newRecipe = {
      serving: data.numberOfServings,
      timeDisplay: data.totalTime,
      name: data.name,
      image: data.images[0].hostedLargeUrl,
      instructions: data.source.sourceRecipeUrl,
      ingredients: data.ingredientLines, // array
      timeSeconds: data.totalTimeInSeconds,
      rating: data.rating
    }

    let $divOne = $('<div class="one">')
    let $image = (`<img src=${newRecipe.image} id="toAdd">`)
    let $name = (`<p class="onetitle">${newRecipe.name}<br />`)
    let $addIcon = ('<i class="material-icons" id="addBtn">add_circle<span class="hidden">ADD TO FAV</span></i><br />')

    let $divRow = $('<div class="onerow">')
    let $serving = (`<i class="material-icons">accessibility</i>${newRecipe.serving} ||`)
    let $timeDisplay = (`<i class="material-icons">alarm</i>${newRecipe.timeDisplay} ||`)
    let $instructions = (`<a target="_blank" href=${newRecipe.instructions} target="_blank"><i class="material-icons" id="dir">info</i>Directions</a>`)
    $divRow.append($serving, $timeDisplay, $instructions)

    let $ingredientul = $("<ul class='ingredientList'></ul>")
    newRecipe.ingredients.forEach(function (e) {
      let $ingredient = (`<li>${e}</li>`)
      $ingredientul.append($ingredient)
    })

    $divOne.append($image, $addIcon, $name, $divRow, $ingredientul)

    $('#singleRecipeContainer').append($divOne)
  }

  $('body').on('click', '#addBtn', function (e) {
    $.post('/favrecipe/add', newRecipe).done(function (data) {
      if (data.status === 'ok') {
        $('#addBtn').hide()
        $('#mymeals').html('<span><i class="material-icons new" >fiber_new</i></span> -Favourites')
        toastr.error('added to Favourites!')
      } else {
        window.alert(data)
        window.location.href = '/userAuth/register'
      }
    })
  })

  $('#delete').on('click', function (e) {
    $.post('/favrecipe/removeAll').done(function () {
      toastr.warning('removed all')
    })
  })

  $('.featured').on('click', function () {
    let imgid = $(this).attr('data')
    $.get(`/home/one/${imgid}`).done(function (e) {
      window.location.href = `/home/one/${imgid}`
    })
  })

  $('#featAddBtn').on('click', function (e) {
    let id = window.location.pathname.split('/').pop()
    $.post('/favrecipe/addFeatRecToUser', {
      'id': id
    }).done(function (data) {
      if (data.status === 'ok') {
        toastr.error('added to Favourites!')
        $('#featAddBtn').hide()
        $('#mymeals').html('<span><i class="material-icons">fiber_new</i></span> -Favourites')
      } else {
        window.alert(data)
        window.location.href = '/userAuth/register'
      }
    })
  })

  $('body').on('click', '.addIng', function (e) {
    e.preventDefault()
    if ($('.ingForm').is(':checked')) {
      $.post('/ingredient', $('input.ingForm:checked').serialize())
      .done(function (data) {
        $('#ingredient').html('<span><i class="material-icons new" >fiber_new</i></span> -Groceries')
        toastr.error('added to Groceries')
      })
      .fail(function (err) {
        console.log(err)
      })
    }
  })

  $('.deleteIngredients').on('click', function (e) {
    $(this).css('text-decoration', 'line-through')
    $.post('/ingredient/deleteOne', {
      'id': $(this).val()
    }).done(function (data) {
      if (data.status === 'ok') {}
    })
  })

  $('#sms').on('click', (e) => {
    toastr.error('Message Sent!')
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
//     log('submit through ajax')
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
