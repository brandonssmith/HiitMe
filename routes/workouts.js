const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Workout = require('../models/Workout');
const Movement = require('../models/Movement');

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Generate workout
router.post('/generate', auth, async (req, res) => {
  try {
    const { muscleGroups, warmup, rounds, restInterval, difficulty } = req.body;

    // Get movements based on selected muscle groups and difficulty
    const movements = await Movement.find({
      muscleGroups: { $in: muscleGroups },
      difficulty,
    });

    if (movements.length === 0) {
      return res.status(400).json({ message: 'No movements found for selected criteria' });
    }

    // Select random movements for the workout
    const selectedMovements = [];
    const numMovements = Math.min(5, movements.length);
    for (let i = 0; i < numMovements; i++) {
      const randomIndex = Math.floor(Math.random() * movements.length);
      selectedMovements.push(movements[randomIndex]);
      movements.splice(randomIndex, 1);
    }

    // Create workout structure
    const workout = {
      user: req.userId,
      name: `Workout ${new Date().toLocaleDateString()}`,
      warmup: [{
        movement: warmup,
        duration: 5,
      }],
      mainWorkout: selectedMovements.map(movement => ({
        movement: movement.name,
        reps: movement.defaultReps,
        sets: movement.defaultSets,
        restInterval,
      })),
      cooldown: [{
        movement: 'Stretching',
        duration: 5,
      }],
      rounds,
      totalDuration: (5 + (selectedMovements.length * rounds * 2) + 5), // Rough estimate
      difficulty,
      targetMuscleGroups: muscleGroups,
    };

    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Error generating workout' });
  }
});

// Save workout
router.post('/', auth, async (req, res) => {
  try {
    const workout = new Workout({
      ...req.body,
      user: req.userId,
    });
    await workout.save();
    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Error saving workout' });
  }
});

// Get workout history
router.get('/history', auth, async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workout history' });
  }
});

// Get specific workout
router.get('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.userId,
    });
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workout' });
  }
});

// Update workout
router.put('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Error updating workout' });
  }
});

// Delete workout
router.delete('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.json({ message: 'Workout deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting workout' });
  }
});

module.exports = router; 