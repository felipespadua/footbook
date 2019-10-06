const express = require('express');
const router  = express.Router();
const authRoutes = express.Router();
const session = require("express-session");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.post('/signup', (req, res, next) => {
  res.redirect('/login');
});


authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));




router.get('/events', ensureAuthenticated, (req, res, next) => {
  res.render('index');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login')
  }
}

module.exports = router;
