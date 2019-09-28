"use strict";

// Express
var express = require('express');

var app = express();
var port = process.env.PORT || 3000; // Other

var bodyParser = require('body-parser');

var moment = require('moment');

var flash = require('connect-flash');

var logger = require('morgan');

var path = require('path');

var favicon = require('serve-favicon'); // Template engine


var expressLayout = require('express-ejs-layouts'); // Autentication and Validation


var passport = require('passport');

var session = require('express-session');

var cookieParser = require('cookie-parser');

require('./Config/passport')(passport); // Database


var mongoose = require('mongoose');

var uri = require('./Config/database').mongoURI; // Database models


var category = require('./Models/categories'); //  Socket.io


var server = require('http').createServer(app);

var io = require('socket.io')(server); // ******************************************************************************************
// Connect to mongoDb


mongoose.connect(uri, {
  useNewUrlParser: true
}).then(function () {
  return console.log('MondoDb connected...');
})["catch"](function (err) {
  return console.log(err);
}); // Ejs engine setup

app.use(expressLayout);
app.set('view engine', 'ejs'); // Handling File Uploads

app.use(logger('dev')); // Body parser
// parse application/x-www-form-urlencoded

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser()); // Set Public Folder

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express["static"](path.join(__dirname, 'public'))); // Session

app.use(session({
  secret: "abdxpsdfep",
  resave: false,
  saveUninitialized: false
})); // Passport 

app.use(passport.initialize());
app.use(passport.session()); // Moment 

app.locals.moment = moment; // Connect-flash

app.use(flash()); // Globals variables

app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  res.locals.articles = [];
  res.locals.user = req.user || null;
  next();
}); // socket.io connection

io.on('connection', function (socket) {
  // User log in
  socket.on('user_logged', function (user_id) {
    // Get user categories    
    category.find({
      author: user_id
    }, function (err, categories) {
      if (err) throw err;
      socket.categories = categories;
      socket.emit('getCategories', categories);
    }); // Delete category

    socket.on('deleteCategory', function (_ref) {
      var id = _ref.id,
          index = _ref.index;
      index = parseInt(index);

      if (id && index) {
        category.deleteOne({
          _id: id
        }, function (err) {
          if (err) throw err;
          socket.categories.splice(index, 1);
          socket.emit('getCategories', socket.categories);
        });
      }
    });
  });
}); // Routes

var indexRoute = require('./Routes/index');

var usersRoute = require('./Routes/users');

var categoryRoute = require('./Routes/categories');

app.use('/', indexRoute);
app.use('/users', usersRoute);
app.use('/category', categoryRoute); // 404 Error

app.use(function (req, res, next) {
  res.status(404).render('notFound', {
    layout: 'notFoundLayout'
  });
});
server.listen(port, console.log("Server is running on port ".concat(port)));