const Ingredient = require('../models/Ingredient')
const User = require('../models/User')

function add(req,res){
  if( Object.keys(req.body).length !== 0 ) {
  //to add multiple items in req.body, should only save once!
  // if (req.body){
    let reqBody = ''
  Array.isArray(req.body.ingredient) ? reqBody = req.body.ingredient : reqBody = [req.body.ingredient]
  // let reqBody = [req.body.ingredient]

  let arr = []
  reqBody.forEach(item=>{
    let tempObj = {}
    tempObj.name = item
    arr.push(tempObj)
  })

  Ingredient.create(arr
  ,function(err,data){
    if(err)console.log(err)
    data.forEach(each=>{
      req.user.ingredients.push(each.id)
    })
    req.user.save()
  })
  res.redirect('/ingredient')
}
else res.redirect('/ingredient')
}

function findAllById (req, res) {
  if (req.user) {
    User.find({
      _id: req.user.id
    })
      .populate('ingredients')
      .exec(function (err, data) {
        if (err) send(err)
        res.render('ingredient', {
          dbitems: data[0].ingredients,
          user: req.user,
        })
      })
  } else {
    res.render('favrecipe',{name: req.flash('name')})
  }
}

module.exports = {
  add,
  findAllById
}
