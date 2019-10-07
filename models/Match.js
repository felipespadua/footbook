const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const matchSchema = new Schema({
  title: { type: String, required: true},
  owner: { type: Schema.Types.ObjectId, required: true},
  description: String,
  totalPlayers: { type: Number, required: true},
  participants: {type: [Schema.Types.ObjectId] },
  date: { type: Date, required: true },
  location: { type: { type: String }, coordinates: [Number]},
  field: { type: Schema.Types.ObjectId }
}, {
  timestamps: true
});

matchSchema.index({ location: '2dsphere' });

const Match = mongoose.model('Match', matchSchema);
module.exports = Match;