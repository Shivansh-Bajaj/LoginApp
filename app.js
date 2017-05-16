var express  = require('express');
var path = require('path');
var app      = express();
var port     = process.env.PORT || 5000;
var mongoose = require('mongoose');
var passport = require('passport');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
mongoose.connect("mongodb://james:james@ds143141.mlab.com:43141/testapplication610"); 
// mongoose.connect("localhost/test")
mongoose.connection.on('connected', function() {
    console.log('Mongoose connected');
});

mongoose.connection.on('open', function(err) {
    console.log('Mongoose open');
});

// If the connection throws an error
mongoose.connection.on('error', function(err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function() {
    console.log('Mongoose default connection disconnected');
});

// require('./config/passport')(passport);
app.use(logger('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(session({ secret: 'tcg^y67_7exy$6&3bhs=u=w2nma!977jd$si=u+*)7c1h!4pk^',
    proxy: true,
    resave: true,
    saveUninitialized: true
 }));
// Configuring Passport

app.use(passport.initialize());
app.use(passport.session());

var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/base');
initPassport(passport);



// routes ======================================================================
var routes = require('./routes/main.js')(passport);
app.use('/', routes);

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);