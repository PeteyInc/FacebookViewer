var express = require('express');
var passport = require('passport');
var session = require('express-session');
var FacebookStrategy = require('passport-facebook').Strategy;
var apples = require('./apples.js');
var port = 3000;
var app = express();

app.use(session({
	secret: apples.secret
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new FacebookStrategy({
	clientID: apples.clientID,
	clientSecret: apples.clientSecret,
	callbackURL: 'http://localhost:' + port + '/auth/facebook/callback'
}, function (token, refreshToken, profile, done) {
	return done(null, profile);
}));

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/me',
	failureRedirect: '/login'
}), function (req, res, next) {
	res.redirect('/');
});

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.get('/me', function(req, res, next) {
  res.json(req.user);
});

app.listen(port, function () {
	console.log(port + ' is now open');
});
