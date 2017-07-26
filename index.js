require('dotenv').config()

const mongoose = require('mongoose')
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const passport = require('./config/passport')
const url = 'mongodb://localhost:27017/project-2' || process.env.MONGODB_URI

mongoose.Promise = global.Promise
mongoose.connect(url, {
  useMongoClient: true
}).then(
  function () { // resolve cb
    console.log('connected successfully')
  },
  function (err) { // reject cb
    console.log(err)
  }
)


// set middleware
app.use(express.static('public'))
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    url: url
  })
}))

app.use(flash())
app.use(passport.initialize())
app.use(passport.session()) //this must be below session call

// setup all files that the proj needs to require
const userRoute = require('./routes/userRoute')
const recipeRoute = require('./routes/recipeRoute')

//public routes
app.get('/', function(req,res){
  res.render('index')
})

app.get('/search', function(req,res){
  res.render('search')
})

//routes
app.use('/userAuth', userRoute)
app.use('/favrecipe', recipeRoute)

//opening the port
const port = process.env.PORT || 5000
app.listen(port, function () {
  console.log(`express is running on ${port}`)
})
