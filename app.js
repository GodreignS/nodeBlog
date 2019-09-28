// Express

const express = require('express');
const app = express();

// Other

const bodyParser = require('body-parser');
const moment = require('moment');
const truncate = require('truncate');
const decode = require('ent/decode');
const flash = require('connect-flash');
const logger = require('morgan');
const path = require('path');
const favicon = require('serve-favicon');

// Template engine

const expressLayout = require('express-ejs-layouts');

// Environment variables
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT;

// Autentication and Validation

const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('./Config/passport')(passport);

// Database

const mongoose = require('mongoose');
const uri = require('./Config/database').mongoURI;

// Database models
const category = require('./Models/categories');

// ******************************************************************************************

// Connect to mongoDb
mongoose.connect(uri, {useNewUrlParser: true})
.then(() => console.log('MondoDb connected...'))
.catch(err => console.log(err))

// Ejs engine setup
app.use(expressLayout);
app.set('view engine', 'ejs');


app.use(logger('dev'));

// Body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());


// Set Public Folder
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
    secret: "abdxpsdfep",
    resave: false,
    saveUninitialized: false
}));

// Passport 
app.use(passport.initialize());
app.use(passport.session());

// Connect-flash
app.use(flash());
// Globals variables
app.use((req, res, next) => {
    
    res.locals.messages = require('express-messages')(req, res);        
    res.locals.moment = moment;    
    res.locals.truncate = truncate;
    res.locals.decode = decode;
    res.locals.user = req.user || null;    
    next();
});



// Routes

const indexRoute = require('./Routes/index');
const usersRoute = require('./Routes/users');
const categoryRoute = require('./Routes/categories');
const postRoute = require('./Routes/post');

app.use('/', indexRoute);
app.use('/users', usersRoute);
app.use('/post', postRoute);
app.use('/category', categoryRoute);

// 404 Error
app.use((req, res, next) => {
    res.status(404).render('notFound', { layout: 'notFoundLayout'})
});

app.listen(port, console.log(`Server is running on port ${port}`))