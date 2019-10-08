const mongoose = require('mongoose');
const Field = require('../models/Field');
const Match = require('../models/Match');
const User = require('../models/User');

const dbtitle = 'footbook';
mongoose.connect(`mongodb://localhost/${dbtitle}`);
User.collection.drop();
Field.collection.drop();
Match.collection.drop();

const matches = [
  {
    title: "Partida do Felipe",
    owner: ObjectId("5d9b80b7ee9235249f963ff1"),
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
    owner: ObjectId("5d9b80b7ee9235249f963ff1"),
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
    owner: ObjectId("5d9b80b7ee9235249f963ff1"),
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

const createMatches = matches.forEach( match => {
  const newMatch = new Match(match);
  return newMatch.save()
    .then( response => console.log("Match criada com sucesso"))
    .catch( err => console.log("Ocorreu um erro ao criar match",err))
})


Promise.all(createMatches)
.then(matches => matches.forEach(matches => console.log(`created ${matches.title}`)))
.then(() => mongoose.connection.close())
.catch(err => console.log("Error while saving the book: ",err))
