const express = require('express');
const router = express.Router();
const Movement = require('../models/Movement');

// Get all movements
router.get('/', async (req, res) => {
  try {
    const movements = await Movement.find().sort({ name: 1 });
    res.json(movements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movements' });
  }
});

// Get movements by muscle group
router.get('/muscle-group/:group', async (req, res) => {
  try {
    const movements = await Movement.find({
      muscleGroups: req.params.group,
    }).sort({ name: 1 });
    res.json(movements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movements' });
  }
});

// Get movements by difficulty
router.get('/difficulty/:level', async (req, res) => {
  try {
    const movements = await Movement.find({
      difficulty: req.params.level,
    }).sort({ name: 1 });
    res.json(movements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movements' });
  }
});

// Get movements by category
router.get('/category/:category', async (req, res) => {
  try {
    const movements = await Movement.find({
      category: req.params.category,
    }).sort({ name: 1 });
    res.json(movements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movements' });
  }
});

// Search movements
router.get('/search/:query', async (req, res) => {
  try {
    const movements = await Movement.find({
      $or: [
        { name: { $regex: req.params.query, $options: 'i' } },
        { description: { $regex: req.params.query, $options: 'i' } },
      ],
    }).sort({ name: 1 });
    res.json(movements);
  } catch (error) {
    res.status(500).json({ message: 'Error searching movements' });
  }
});

// Add new movement (admin only)
router.post('/', async (req, res) => {
  try {
    const movement = new Movement(req.body);
    await movement.save();
    res.status(201).json(movement);
  } catch (error) {
    res.status(500).json({ message: 'Error adding movement' });
  }
});

// Update movement (admin only)
router.put('/:id', async (req, res) => {
  try {
    const movement = await Movement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!movement) {
      return res.status(404).json({ message: 'Movement not found' });
    }
    res.json(movement);
  } catch (error) {
    res.status(500).json({ message: 'Error updating movement' });
  }
});

// Delete movement (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const movement = await Movement.findByIdAndDelete(req.params.id);
    if (!movement) {
      return res.status(404).json({ message: 'Movement not found' });
    }
    res.json({ message: 'Movement deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting movement' });
  }
});

module.exports = router; 