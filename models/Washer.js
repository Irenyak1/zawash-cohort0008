const mongoose = require('mongoose');

const washerSchema = new mongoose.Schema({
    firstname: {
      type: String,
      trim: true,
    },
    lastname: {
      type: String,
      trim: true,
    },
    dob: {
        type: Date,
            },
    nin: {
        type: String,
        trim: true,
    },
    phonenumber: {
        type: Number,
    },
    gender: {
        type: String,
        trim: true,
    },
    residence: {
        type: String,
        trim: true
    }
  });

module.exports = mongoose.model('Washer', washerSchema);
