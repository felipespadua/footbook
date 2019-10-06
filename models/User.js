
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String },
  password: { type: String },
  type: { type: String, enum: ['player', 'referee', 'admin'] },
  events: [Schema.Types.ObjectId],
  eventsOwner: [Schema.Types.ObjectId],
  friends: [Schema.Types.ObjectId]
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;