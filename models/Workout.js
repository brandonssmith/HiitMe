const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  warmup: [{
    movement: {
      type: String,
      required: true
    },
    duration: Number,
    reps: Number,
    restInterval: Number
  }],
  mainWorkout: [{
    movement: {
      type: String,
      required: true
    },
    reps: Number,
    sets: Number,
    restInterval: Number,
    weight: Number,
    notes: String
  }],
  cooldown: [{
    movement: {
      type: String,
      required: true
    },
    duration: Number,
    reps: Number,
    restInterval: Number
  }],
  rounds: {
    type: Number,
    required: true
  },
  totalDuration: Number,
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  targetMuscleGroups: [{
    type: String,
    required: true
  }],
  completed: {
    type: Boolean,
    default: false
  },
  completionDate: Date,
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Workout', workoutSchema); 