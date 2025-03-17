const express = require('express');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const path = require('path');
const logger = require('morgan');

const debugServer = require('debug')('app:server')
const authRoute = require('./routes/authRoutes');
const userRoute = require('./routes/userRoutes');
const rateLimit = require('express-rate-limit');

const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('short'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 menit
  max: 10, // Maksimal 5 request per IP
  message: { error: 'To Much Request, Try Again in 1 minute'},
  headers: true, // Tambahkan info rate limit di response header
});

app.use('/auth', limiter, authRoute);
app.use('/', limiter, userRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404, 'Page Not Found'));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({
    status: 'error',
    statusCode: err.status || 500,
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
