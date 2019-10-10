const express = require('express');
const router  = express.Router();
const session = require("express-session");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const Match = require("../models/Match")
const Field = require("../models/Field")


const googleApiKey = process.env.GOOGLE_API_KEY;
let savedLat
let savedLng
/* GET home page */
router.get('/', (req, res, next) => {
  res.render('home');
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
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
  successRedirect: "/matches",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get('/matches/:lat/:lng', ensureAuthenticated, (req, res, next) => {
  let {lat, lng } = req.params;
  savedLat = lat;
  savedLng = lng;
  const user = req.user;
  Match.find()
    .populate("owner")
    .populate("field")
    .then( matches => { 
      let updateMatches = matches.map((match) => {
        match = setDistance(match, lat, lng)
        let newMatch = new Match(match)
        return newMatch.save()
          .then((result)=> console.log("Match atualizada", result))
          .catch((err) => console.log(err))
      })
      Promise.all(updateMatches)
        .then(() => {
          matches = orderByDistance(matches)
          res.render('matches', { matches , user , googleApiKey} )
        })
        .catch((err) => console.log(err))
      
    })
    .catch( err => {
      console.log("Ocorreu um erro ao encontrar as partidas: ", err)
    })
});


router.get('/matches', ensureAuthenticated, (req, res, next) => {
  const user = req.user;
  Match.find()
    .populate("owner")
    .populate("field")
    .then( matches => { 
      matches = orderByDistance(matches)
      console.log(matches)
      res.render('matches', { matches , user , googleApiKey} )
    })
    .catch( err => {
      console.log("Ocorreu um erro ao encontrar as partidas: ", err)
    })
});


// router.post('/matches', ensureAuthenticated, (req, res, next) => {
//   lat = req.body.lat;
//   lng = req.body.lng;
//   res.re('/matches')
 
// });
router.get('/match/delete/:id', ensureAuthenticated, (req, res, next) => {
  let { id } = req.params;
  let { username } = req.user;
  Match.findById(id)
    .then( match => { 
      User.findOne({username})
        .then((user) =>{
          if(match.owner == user.id){
            Match.findByIdAndDelete(match.id)
              .then((result) => {
                console.log("Partida deletada com sucesso")
                res.redirect("/matches")
              })
              .catch((err) => console.log(err))
          }else {
            res.redirect("/matches")
          }
        })
    })
    .catch( err => {
      console.log("Ocorreu um erro ao encontrar as partidas: ", err)
    })
});
router.get('/match/show/:id', ensureAuthenticated, (req, res, next) => {
  const { id } = req.params;
  const user = req.user;
  Match.findById(id)
    .populate('owner')
    .populate('participants')
    .populate('field')
    .then( match => {
        let isOwner = match.owner.username === user.username ? true : false;
        let lat = match.location.coordinates[1];
        let lng = match.location.coordinates[0];
        console.log(match)
        res.render('match', { match, user , isOwner , lat, lng , googleApiKey} )
    })
    .catch( err => {
      console.log("Ocorreu um erro ao encontrar a partida: ", err)
    })
});
//incompleto, continuar
router.get('/match/:id/add/player', ensureAuthenticated, (req, res, next) => {
  const { id } = req.params;
  const user = req.user;
  Match.findById(id)
    .populate('owner')
    .then(match => {
     
        res.render('match', { match, user})
      
    })
  res.render('match-add', { user } )
});

router.get('/match/add', ensureAuthenticated, (req, res, next) => {
  const user = req.user;
  Field.find()
    .then((fields) => {
      res.render('match-add', { fields, user, googleApiKey} )
    })
 
});

router.get('/profile', ensureAuthenticated, (req, res, next) => {
  const user = req.user;
  res.render('profile', { user, googleApiKey } )
});

router.post('/match/add', ensureAuthenticated, (req, res, next) => {
  console.log(req.body)
  const {username}  = req.user;
  // const {lat , lng} = req.params;
  const {title, totalPlayers, description, field, latitude, longitude, matchTime ,date, place, participants }  = req.body;
  let location = {
    type: 'Point',
    coordinates: [longitude, latitude],
    place
  }
  User.findOne({username})
  .then(user => {
    const newMatch = new Match({
      title,
      owner: user.id,
      description,
      totalPlayers,
      participants,
      date,
      location,
      field : field != "Other" ? field : undefined
    });
    newMatch.save()
      .then( result => {
          console.log(`Match ${result.title} criado com sucesso`);
          res.redirect(`/matches/${savedLat}/${savedLng}`)
      } )
      .catch( err => console.log(`Ocorreu um erro ao criar match: ${err}`))
  

   })
  .catch((err) => console.log(err))
  
});

router.get('/match/edit/:id', ensureAuthenticated, (req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    Match.find(id)
      .populate('owner')
      .populate('participants')
      .populate('field')
      .then( match => {
        if(match.owner.name != req.user){
          res.redirect('/newmatch/edit', { message: "You are not the owner of this match", user})
        }else {
          res.render('match-edit', { match, user })
        }
      })
      .catch( err => {
        console.log("Ocorreu um erro ao editar a partida: ", err)
      })
});

router.post('/match/edit/:id', ensureAuthenticated, (req, res, next) => {
  const { id } = req.params;
  const user = req.user;
  const  {title, totalPlayers, description, field, date, participants, longitude, latitude } = req.body;
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
    date,
    location,
    field
  }
  Match.findByIdAndUpdate(id, updateMatch)
    .then( match => {
      res.render('matches', { message: "Match Updated Succesfully!", user})
    })
    .catch( err => {
      res.render('match-edit', { message: "An error ocurred while updating match", user})
    })
});
/////////////////////API SECTION 
router.get('/api/field/:id/location', ensureAuthenticated, (req, res, next) => {
  Field.findById(req.params.id)
    .then((field) => {
      res.json(field.location)
    })
    .catch((err) => console.log(err))
});




////////////////////MIDDLEWARE SECTION
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login')
  }
}


////////////////////HELPER FUNCTIONS SECTION
function distance(lat1, lon1, lat2, lon2) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		return  dist * 1.609344;
	}
}
function orderByDistance(matches){
  return matches.sort((a,b) => { return Number(a.distance) - Number(b.distance) })
}
function setDistance(match, latitude, longitude){
  let matchLng = match.location.coordinates[0];
  let matchLat = match.location.coordinates[1];
  match.distance = Number(distance(latitude,longitude,matchLat,matchLng)).toFixed(2).toString();
  return match
}
module.exports = router;
