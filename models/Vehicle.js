const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  numberplate: {
    type: String,
    trim: true,
  },
  color: {
    type: String,
    trim: true,
  },
  doa: {
    type: Date,
  },
  datetimeArrival: {
    type: Date,
  },
  make: {
    type: String,
    trim: true,
  },
  washer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Washer',
  },
  gender: {
    type: String,
    trim: true,
  },
  package: {
    type: String,
    trim: true,
  },
  packagePrice: {
    type: Number,
  },
  washerFee: {
    type: Number,
  },

});

module.exports = mongoose.model('Vehicle', vehicleSchema);
