const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const matchSchema = new Schema({
  title: { type: String, required: true},
  owner: { type: Schema.Types.ObjectId, ref: "User",  required: true},
  description: String,
  totalPlayers: { type: Number, required: true},
  participants:  [{ type: Schema.Types.ObjectId, ref: "User" }],
  date: { type: Date, required: true },
  location: { type: { type: String }, coordinates: [Number]},
  field: { type: Schema.Types.ObjectId , ref: "Field"},
  numberOfParticipants: { type: Number, default: 0 },
  distance: {type: String, default: undefined},
  place: String
}, {
  timestamps: true
});
 
matchSchema.index({ location: '2dsphere' });
matchSchema.pre("save", function(next) {
  this.numberOfParticipants = this.participants ? this.participants.length : 0;
  next();
 });
const Match = mongoose.model('Match', matchSchema);
module.exports = Match;