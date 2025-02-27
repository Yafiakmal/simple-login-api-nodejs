const express = require('express');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const path = require('path');
const logger = require('morgan');


const db = require('./config/db')
const authRoute = require('./routes/authRoutes');

const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('short'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404, 'Halaman tidak ditemukan'));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).render('error');
});

module.exports = app;
