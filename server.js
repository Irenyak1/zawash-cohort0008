// Dependecies
const express = require("express")
const moment = require('moment');
const mongoose = require('mongoose');
const homeRoutes = require('./routes/homeRoutes');
const registerRoutes = require('./routes/registerRoutes');
const reportRoutes = require('./routes/reportRoutes');
const authRoutes = require('./routes/authRoutes');
const Manager = require('./models/Manager')
const passport = require('passport');
const expressSession = require('express-session')({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
});

require('dotenv').config();

// instantiations
const app = express()

//mongodb connection
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

mongoose.connection
  .on('open', () => {
    console.log('Mongoose connection open');
  })
  .on('error', (err) => {
    console.log(`Connection error: ${err.message}`);
  });



// settings or configurations
app.locals.moment = moment
app.set('view engine', 'pug');
app.set('views', './views');

// middle ware
app.use(express.urlencoded({ extended: true }))
app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());

passport.use(Manager.createStrategy());
passport.serializeUser(Manager.serializeUser());
passport.deserializeUser(Manager.deserializeUser());


var loginChecker = function (req, res, next) {
  if (req.path != '/login' && !req.session.user) {
    res.redirect('/login')
  }
  next()
}
app.use(loginChecker)

// routes
app.use('/', homeRoutes);
app.use('/', authRoutes);
app.use('/register', registerRoutes);
app.use('/report', reportRoutes);

// handle non existing routes
app.get('*', (req, res) => {
  res.status(404).send('This is an invalid URL')
})

// server
app.listen(3001, () => console.log("Listening on Port 3001!!!"));