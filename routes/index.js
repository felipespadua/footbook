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

router.get('/matches', ensureAuthenticated, (req, res, next) => {
  Match.find()
    .then( matches => {
        render('matches', matches )
    })
    .catch( err => {
      console.log("Ocorreu um erro ao encontrar as partidas: ", err)
    })
});

router.get('/match/add', ensureAuthenticated, (req, res, next) => {
  res.render('match-add')
});

router.post('/match/add', ensureAuthenticated, (req, res, next) => {
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
    .catch( err => console.log(`Ocorreu um erro ao criar match: ${err}`))

});

router.get('/match/edit/:id', ensureAuthenticated, (req, res, next) => {
    const { id } = req.params;
    Match.find(id)
      .populate('owner')
      .populate('participants')
      .populate('field')
      .then( match => {
        if(match.owner.name != req.user){
          res.redirect('/newmatch/edit', { message: "You are not the owner of this match"})
        }else {
          res.render('match-edit', match)
        }
      })
      .catch( err => {
        console.log("Ocorreu um erro ao editar a partida: ", err)
      })
});

router.post('/match/edit/:id', ensureAuthenticated, (req, res, next) => {
  const { id } = req.params;
  const  {title, totalPlayers, description, field, participants, longitude, latitude } = req.body;
  let location = {
    type: 'Point',
	  coordinates: [longitude, latitude]
  }
  const updateMatch ={
    title,
    owner,
    description,
    totalPlayers,
    participants,
    location,
    field
  }
  Match.findByIdAndUpdate(id, updateMatch)
    .then( match => {
      res.render('matches', { message: "Match Updated Succesfully!"})
    })
    .catch( err => {
      res.render('match-edit', { message: "An error ocurred while updating match"})
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
