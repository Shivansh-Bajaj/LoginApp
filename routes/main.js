var express = require('express');
var router = express.Router();
var User = require('../models/user')
var LocalUser = require('../models/local_user')
var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(passport){

	/* GET login page. */
	router.get('/', function(req, res) {
    	// Display the Login page with any flash message, if any
    	LocalUser.find({},function(err, output) {		
			var message = req.flash('message')[0];
    		if(err) {
    			console.log(err);
    			res.render('index', { message: message,isLogin: req.isAuthenticated() });
    		} else {
    			console.log(message);
    			res.render('index', { message: message, isLogin: req.isAuthenticated(), users: output });
    		}
    	})
		
	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/',
		failureRedirect: '/',
		failureFlash : true  
	}));

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/',
		failureRedirect: '/',
		failureFlash : true  
	}));

	/* Handle Logout */
	router.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	router.post('/user/add', function(req, res){
		if(req.isAuthenticated()) {
			console.log(req.body.salary)
			localuser = new LocalUser({
				name: req.body.name,
				salary: parseInt(req.body.salary)
			}).save(function (err, obj) {
				if(err) {
					res.json({
						success: false,
						message: "error"
					})
				} else {
					res.json({
						success: true,
						user: obj,
						message: "successfully saved"
					})
				}
			})
		}
		else {
			res.json({
				success: false,
				message: "please login to use the rest point"
			})
		}
	});
	router.post('/user/remove', function(req, res){
		if(req.isAuthenticated()) {
			localuser = LocalUser.remove({_id: req.body._id},function (err) {
				if(err) {
					res.json({
						success: false,
						message: err.message
					})
				} else {
					res.json({
						success: true,
						message: "successfully removed"
					})
				}
			})
		}
		else {
			res.json({
				success: false,
				message: "please login to use the rest point"
			})
		}
	});

	return router;
}
