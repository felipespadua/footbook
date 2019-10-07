const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const eventSchema = new Schema({
  title: { type: String, required: true},
  owner: { type: Schema.Types.ObjectId, required: true},
  totalPlayers: { type: Number, required: true},
  participants: {type: [Schema.Types.ObjectId] },
  location: { type: { type: String }, coordinates: [Number]},
  field: { type: Schema.Types.ObjectId }
}, {
  timestamps: true
});

eventSchema.index({ location: '2dsphere' });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;