const createError = require('http-errors');
const express = require('express');
const path = require('path');
const http = require('http');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();
// const { client } = require('./whatsapp/whatsappWeb');

// client.initialize();
// const mongoose = require('mongoose');

// mongoose.connect(`mongodb+srv://whatsappWebDB:${process.env.PASSWORD_MONGOOSE}@cluster0.cojo6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
//     .then(() => {
//         console.log('Connected to MongoDB');
//     }).catch(err => {
//         console.log('Error connecting to MongoDB:', err);
//     });


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const whatsappConnectionRouter = require('./routes/whatsapp/connection');
// const { io } = require('./socket/connection');


const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/whatsapp', whatsappConnectionRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
