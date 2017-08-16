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
const url = process.env.MONGODB_URI

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
app.use(bodyParser.urlencoded({
  extended: true
}))

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
app.use(passport.session()) // this must be below session call

// setup all files that the proj needs to require
const userRoute = require('./routes/userRoute')
const recipeRoute = require('./routes/recipeRoute')

// public routes
app.get('/', function (req, res) {
  res.render('search')
})

// routes
app.use('/userAuth', userRoute)
app.use('/favrecipe', recipeRoute)

// opening the port
const port = process.env.PORT || 4000
app.listen(port, function () {
  console.log(`express is running on ${port}`)
})

// // adding sockets experimental
// const http = require('http').createServer(app)
// const io = require('socket.io')(http)
// io.on('connection', function (socket) {
//   console.log('user connected')
// })
//
// app.use('/socket', function(req,res){res.render('chat')})
//
// io.on('connection', function (socket) {
//   socket.on('username', function (username) {
//     console.log(username)
//     io.emit('onlinestatus', `${username} just joined`)
//
//     socket.on('disconnect', function () {
//       io.emit('offlinestatus', `${username} just left`)
//     })
//     // socket is from client side
//     socket.on('chat', function (txt) {
//       // io is from one client to all client
//       io.emit('chatServer', `${username} says ${txt}`)
//     })
//     socket.on('typing', function (message) { if (message === 'userTyping') {
//       io.emit('stilltyping', `${username} is typing`) }
//     })
//   })
// })
//
// http.listen(3000, function () {
//   console.log('listening on *:3000')
// })
