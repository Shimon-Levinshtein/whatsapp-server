const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const whatsappConnectionRouter = require('./routes/whatsapp/connection');
const { sendGoogleEmail } = require('./controllers/mail/sendMail');
const { handlebarsSendGoogleEmail } = require('./controllers/mail/ddd');
const { sendGoogleEmailEjs } = require('./controllers/mail/sendMailEjs');


const app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors())
// app.use((req, res, next) => {
//   res.setHeader('Authorization');
//   next();
// });
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

// sendGoogleEmailEjs({
//   to: 'shimonwebdeveloper@gmail.com',
//    subject: 'Welcome 4',
//    templetName: 'registered',
//     dataTemplet: {
//       title: 'registered 17',
//       message: 'Successfully registered :)',
//       link: process.env.CLINTE_URL,
//     }
// });


module.exports = app;
