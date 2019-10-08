const mongoose = require('mongoose');
const Field = require('./models/Field');
const Match = require('./models/Match');
const User = require('./models/User');

const dbtitle = 'footbook';


Match.collection.drop();
const matches = [
  {
    title: "Partida do Felipe",
    owner: "5d9b7b07759902356b4a3110",
    description: "Diversao Garantida!!",
    totalPlayers: 25,
    // participants: [{type: [Schema.Types.ObjectId] }],
    date: new Date(2019,11,28),
    location: {
      type: 'Point',
      coordinates: [-46.5644216, -23.5334633]
    }
  },
  {
    title: "Partida do Felipe 2",
    owner: "5d9b7b07759902356b4a3110",
    description: "Diversao Garantida!!",
    totalPlayers: 25,
    // participants: [{type: [Schema.Types.ObjectId] }],
    date: new Date(2019,11,28),
    location: {
      type: 'Point',
      coordinates: [-46.5644216, -23.5334633]
    }
  }, {
    title: "Partida do Felipe 3",
    owner: "5d9b7b07759902356b4a3110",
    description: "Diversao Garantida!!",
    totalPlayers: 25,
    // participants: [{type: [Schema.Types.ObjectId] }],
    date: new Date(2019,11,28),
    location: {
      type: 'Point',
      coordinates: [-46.5644216, -23.5334633]
    }
  }
]

mongoose
  .connect('mongodb://localhost/footbook', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
    User.findByIdAndUpdate("5d9b7b07759902356b4a3110", { matchesOwner: []})
    .then(() => console.log("Atualizado com sucesso"))
    let idArrays = [];
    let createMatches = matches.map( match => {
      const newMatch = new Match(match);
      return newMatch.save()
        .then( match =>{
            idArrays.push(match._id)
        } )
        .catch( err => console.log("Ocorreu um erro ao criar match",err))
      })
    Promise.all(createMatches)
      .then(match => {
          idArrays.forEach( id => {
            User.findByIdAndUpdate("5d9b7b07759902356b4a3110", { $push: { matchesOwner: id}})
              .then(() => console.log("Atualizado com sucesso"))
          })
      })
      .catch(err => console.log(err))

  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

