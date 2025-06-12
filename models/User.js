const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  profilePicture: String,
  workoutHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workout'
  }],
  preferences: {
    defaultRestInterval: {
      type: Number,
      default: 30
    },
    defaultRounds: {
      type: Number,
      default: 3
    },
    favoriteMovements: [{
      type: String
    }]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema); 