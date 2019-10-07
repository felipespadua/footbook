
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true},
  password: { type: String, required: true },
  email: {type: String, required: true },
  type: { type: String, enum: ['player', 'referee', 'admin'], default: 'player'},
  matches: [Schema.Types.ObjectId],
  matchesOwner: [Schema.Types.ObjectId],
  friends: [Schema.Types.ObjectId]
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;