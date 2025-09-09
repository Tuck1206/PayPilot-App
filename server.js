const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')
const session = require('express-session')
const isSignedIn = require('./middleware/is-signed-in.js')

const passUserToView = require('./middleware/pass-user-to-view.js')


const authController = require('./controllers/auth.js')
const billsController = require('./controllers/bills.js')


const port = process.env.PORT ? process.env.PORT : '3000'

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
)

app.use(function(req, res, next) {
        res.locals.user = req.session.user; // Assuming 'user' is where your user object is stored in the session
        next();
    });

app.get('/', (req, res) => {
  res.render('home.ejs', {
    user: req.session.user,
  })
})

app.use(passUserToView)
app.use('/auth', authController)
app.use(isSignedIn)
app.use('/users/:userId/bills', billsController)

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`)
})
