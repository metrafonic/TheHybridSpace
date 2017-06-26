var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var basicAuth = require('basic-auth-connect');
var auth = require('http-auth');

var index = require('./routes/index');
var api = require('./routes/api');
var users = require('./routes/users');

var adminUsername = process.env.ADMIN_USERNAME || "admin";
var adminPassword = process.env.ADMIN_PASSWORD || "password";

var app = express();

var basic = auth.basic({
        realm: "Web."
    }, function (username, password, callback) { // Custom authentication method.
        console.log(adminUsername, adminPassword);
        callback(username === adminUsername && password === adminPassword);
    }
);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/admin', auth.connect(basic), express.static('public/admin'));
app.use(express.static(path.join(__dirname, 'public')));

//app.use(express.static('public'));

app.use('/api', api);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
