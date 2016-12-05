const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');

const routes = require('./routes');
const usersRoutes = require('./routes/users');
const auth = require('./routes/auth');
const signup = require('./routes/signup');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Connect to DB
const mongoose = require('mongoose');
const uri = `mongodb://localhost:27017/flasher_thingssdk_development`; //${app.get('env')}`;
mongoose.connect(uri);
const db = mongoose.connection;
db.on("error", err => console.error("connection error:", err));

app.use('/v2', routes);
app.use('/v2/users', usersRoutes);
app.use('/v2/authorize', auth);
app.use('/v2/signup', signup);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});


module.exports = app;
