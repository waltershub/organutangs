var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var User = require('../database-mongo/models/user');

var userInstance = function(io) {
  // Register User
  router.post('/register', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    // Validation
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    req.asyncValidationErrors().then(function() {
      var newUser = new User({
        username: username,
        password: password
      });
      User.createUser(newUser, function(err, user) {
        if (err) {
          throw err;
        } else {
          req.session.regenerate((err) => {
            req.session.user = username;
            res.send(true);
          });
        }
      });

      //req.flash('success_msg', 'You are registered and can now login');

      //res.redirect('/users/login');
    // all good here
    }, function(errors) {
      console.log("ERRR", errors);
      res.status(404).send(false);
      // damn, validation errors!
    });
  });

  //middleware neccessary code
  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.getUserByUsername(username, function(err, user) {
        if (err) {
          throw err;
        }
        if (!user) {
          return done(null, false, {message: 'Unknown User'});
        }

      User.comparePassword(password, user.password, function(err, isMatch) {
        if (err) {
          throw err;
        }
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, {message: 'Invalid password'});
        }
      });
      });
    }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
      done(err, user);
    });
  });

  //login route
  router.post('/login',
    passport.authenticate('local'),
    function(req, res) {
      req.session.regenerate((err) => {
        io.emit('loginTrue', true);
        req.session.user = req.user.username;
        res.send([req.user.username, req.isAuthenticated()]);
      });
    }
  );

  router.get('/loggedin', (req, res) => {
    if (req.session.user) {
      //io.emit('loginTrue', true);
      res.send({ auth: true, user: req.session.user});
    } else {
      //io.emit('loginFalse', false);
      res.send({ auth: false, user: null });
    }
  });

  router.get('/logout', function(req, res){
    req.session.destroy(() => {
      //io.emit('loginFalse', false);
      res.status(201).send(false);
    });
  });

  router.get('/friends', (req, res) => {
    User.findOne({ username: req.session.user })
    .then(({ friends }) => {
      res.send(friends);
    })
  });

  router.post('/friends', (req, res) => {
    req.body.friend === req.session.user ? res.send('You Must Be Lonely :\'(') :
    User.findOne({ username: req.session.user })
    .then((user) => {
      User.findOne({ username: req.body.friend })
      .then((match) => {
        if (match) {
          const friends = user.friends.slice();
          if (friends.includes(req.body.friend)) res.send('Already added!');
          else {
            friends.push(req.body.friend)
            User.findOneAndUpdate({ _id: user._id }, { friends })
            .then(() => res.send('Added!'));
          }
        } else {
          res.send('That User Doesn\'t Exist!');
        }
      })
    })
  })
  return router;
}

module.exports = userInstance;
