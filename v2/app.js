const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const authorize = require('./authorize');

const routes = require('./routes');
const usersRoutes = require('./routes/users');
const auth = require('./routes/auth');
const signup = require('./routes/signup');
const userManagement = require('./routes/userManagement');
const dbConnect = require('./database');
const createStatusError = require('./utils/createStatusError');

const notFoundError = createStatusError(404);

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Connects to the database
dbConnect(app.get('env'));

/* CORS */
app.use(function(req, res, next){
	res.header("Access-Control-Allow-Origin", "http://localhost:3000");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	if(req.method === "OPTIONS") {
		res.header("Access-Control-Allow-Methods", "PUT,POST,DELETE");
		return res.status(200).json({});
	}
	next();
});
/* END CORS */

app.use(authorize);
app.use('/v2', routes);
app.use('/v2', signup);
app.use('/v2', auth);
app.use('/v2', userManagement);
app.use('/v2/users', usersRoutes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(notFoundError);
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
