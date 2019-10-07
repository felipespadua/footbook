const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const fieldSchema = new Schema({
  name: { type: String, required: true},
  location: { type: { type: String }, coordinates: [Number], required: true},
  description: String,
  imgName: String,
  imgPath: String,
}, {
  timestamps: true
});

fieldSchema.index({ location: '2dsphere' });

const Field = mongoose.model('Field', fieldSchema);
module.exports = Field;