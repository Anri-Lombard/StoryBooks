const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')
const passport = require('passport')
const session = require('express-session')

// Load config
dotenv.config({path: './config/config.env'})

// passport config
require('./config/passport')(passport)

connectDB()

const app = express()

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// HandleBars
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', '.hbs')

// ssssions
app.use(session({
    secret: 'cats',
    resave: false,
    saveUninitialized: false,
}))

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Static folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'))

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))