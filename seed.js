require('dotenv').config();

const mongoose = require('mongoose');
const Field = require('./models/Field');
const Match = require('./models/Match');
const User = require('./models/User');

const dbtitle = 'footbook';

let fields = [
  {
    name: "Campo da Alegria",
    location: {
      type: 'Point',
      coordinates: [-46.5799064, -23.5371129],
    },
    description: "Melhor campo!",
    imgName: "campo1.jpg",
    imgPath: `/images/fields`
  },
  {
    name: "Campo da Tristeza",
    location: {
      type: 'Point',
      coordinates: [-46.5644216, -23.5334633],
    },
    description: "Segundo Melhor campo!",
    imgName: "campo2.jpg",
    imgPath: `/images/fields`
  },
  {
    name: "Campo da Harmonia",
    location: {
      type: 'Point',
      coordinates: [-44.5644216, -23.5334633]
    },
    description: "Terceiro Melhor campo!",
    imgName: "campo3.jpg",
    imgPath: `/images/fields`
  }
]



mongoose
.connect(process.env.MONGODB_URI, {useNewUrlParser: true})
.then(x => {
  Field.collection.drop();
  let createFields = fields.map( field => {
    const newField = new Field(field);
    console.log(`Campo ${field.name} criado com sucesso`)
    return newField.save()
  })
  User.findOne()
  .then(user => {
    let userId =user.id
    console.log(userId, "id")
    // Match.collection.drop();
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
    User.findByIdAndUpdate(userId, { matchesOwner: []})
    .then(() => console.log("Atualizado com sucesso"))
    let idArrays = [];
    let matches = defMatches(userId)
    let createMatches = matches.map( match => {
      const newMatch = new Match(match);
      return newMatch.save()
        .then( match =>{
            idArrays.push(match._id)
        } )
        .catch( err => console.log("Ocorreu um erro ao criar match",err))
    })
    Promise.all(createFields)
    .then(() => {
      console.log("Campos criados com sucesso");
    })
    .catch(err => console.log(err))
    Promise.all(createMatches)
      .then(() => {
          console.log("Partidas criadas com sucesso");
          idArrays.forEach( id => {
            User.findByIdAndUpdate(userId, { $push: { matchesOwner: id}})
              .then(() => console.log("Atualizado com sucesso"))
          })
      })
      .catch(err => console.log(err))

  })
  .catch(err => {
    console.error('Error finding user', err)
  });

})
.catch(err => {
  console.error('Error connecting to mongo', err)
});

let defMatches = (userId) => {
  let matches = 
  [
    {
      title: "Partida do Felipe",
      owner: userId,
      description: "Diversao Garantida!!",
      totalPlayers: 25,
      // participants: [{type: [Schema.Types.ObjectId] }],
      date: new Date(2019,11,28),
      location: {
        type: 'Point',
        coordinates: [-46.5644216, -23.5334633]
      }
    },
    // {
    //   title: "Partida do Felipe 2",
    //   owner: userId,
    //   description: "Diversao Garantida!!",
    //   totalPlayers: 25,
    //   // participants: [{type: [Schema.Types.ObjectId] }],
    //   date: new Date(2019,11,28),
    //   location: {
    //     type: 'Point',
    //     coordinates: [-43.5644216, -20.5334633]
    //   }
    // }, {
    //   title: "Partida do Felipe 3",
    //   owner: userId,
    //   description: "Diversao Garantida!!",
    //   totalPlayers: 25,
    //   // participants: [{type: [Schema.Types.ObjectId] }],
    //   date: new Date(2019,11,28),
    //   location: {
    //     type: 'Point',
    //     coordinates: [-41.5644216, -20.5334633]
    //   }
    // },
    // {
    //   title: "Partida do Felipe 4",
    //   owner: userId,
    //   description: "Diversao Garantida!!",
    //   totalPlayers: 25,
    //   // participants: [{type: [Schema.Types.ObjectId] }],
    //   date: new Date(2019,11,28),
    //   location: {
    //     type: 'Point',
    //     coordinates: [-41.5644216, -21.5334633]
    //   }
    // },
    // {
    //   title: "Partida do Felipe 5",
    //   owner: userId,
    //   description: "Diversao Garantida!!",
    //   totalPlayers: 25,
    //   // participants: [{type: [Schema.Types.ObjectId] }],
    //   date: new Date(2019,11,28),
    //   location: {
    //     type: 'Point',
    //     coordinates: [-35.5644216, -20.5334633]
    //   }
    // },
    // {
    //   title: "Partida do Felipe 6",
    //   owner: userId,
    //   description: "Diversao Garantida!!",
    //   totalPlayers: 25,
    //   // participants: [{type: [Schema.Types.ObjectId] }],
    //   date: new Date(2019,11,28),
    //   location: {
    //     type: 'Point',
    //     coordinates: [-41.5644216, -19.5334633]
    //   }
    // },
    ]
  return matches
}
