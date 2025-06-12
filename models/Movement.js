const mongoose = require('mongoose');

const movementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  muscleGroups: [{
    type: String,
    required: true
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  equipment: [{
    type: String
  }],
  videoUrl: String,
  defaultReps: {
    type: Number,
    default: 10
  },
  defaultSets: {
    type: Number,
    default: 3
  },
  category: {
    type: String,
    enum: ['strength', 'cardio', 'gymnastics', 'olympic', 'other'],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Movement', movementSchema); 