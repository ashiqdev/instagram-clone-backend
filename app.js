const express = require('express');
const passport = require('passport');
const cors = require('cors');
const routes = require('./routes/index');
const errorHandlers = require('./handlers/errorHandlers');

// Create express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

// Passport config
require('./config/passport')(passport);

app.use('/api', routes);

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);


// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

// we export our app so that it can be started from start.js
module.exports = app;
