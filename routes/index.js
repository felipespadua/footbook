const express = require('express');
const router  = express.Router();
const session = require("express-session");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User")
const Match = require("../models/Match")
const Field = require("../models/Field")

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('login');
});

router.get('/login', (req, res, next) => {
  res.render('login');
});


router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post("/signup", (req, res, next) => {
  const {username, password, email}  = req.body;

  if (username === "" || password === "") {
    res.render("signup", { message: "Indicate username and password" });
    return;
  }
  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    console.log(password, salt)
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      email,
    });

    newUser.save((err) => {
      if (err) {
        console.log(err)
        res.render("signup", { message: "Something went wrong" });
      } else {
        res.redirect("/login");
      }
    });
  })
  .catch(error => {
    next(error)
  })
});


router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get('/newmatch', ensureAuthenticated, (req, res, next) => {
  res.render('newmatch')
});

router.post('/newevent', ensureAuthenticated, (req, res, next) => {
  const {title, totalPlayers, description, field, participants, longitude, latitude }  = req.body;
  const owner = req.user;
  let location = {
    type: 'Point',
	  coordinates: [longitude, latitude]
  }
  const newMatch = new Match({
    title,
    owner,
    description,
    totalPlayers,
    participants,
    location,
    field
  });
  newMatch.save()
    .then( result => console.log(`Match ${name} criado com sucesso`))
    .catch( err => console.log(`Ocorreu um erro ao criar evento: ${err}`))

});

router.get('/newevent/edit/:id', ensureAuthenticated, (req, res, next) => {
    const { id } = req.params;
    Event.findById(id)
      .then( event => {
        if(event.owner != req.user){
          console.log("Usuario nao e dono desse evento")
        }else {

        }
      })
});

// router.get('/events/search/', ensureAuthenticated, (req, res, next) => {
//   const { query, typeQuery } = req.body;
//   Event.find()
//     .then(events => {

//     })
//     .catch(error => {
//       next(error)
//     })
// });

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login')
  }
}

module.exports = router;
