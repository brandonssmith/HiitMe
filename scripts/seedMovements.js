const mongoose = require('mongoose');
const Movement = require('../models/Movement');
const fs = require('fs');
const csv = require('csv-parse/sync');
require('dotenv').config();

// Read and parse CSV file
const csvData = fs.readFileSync('Movement,Major Muscle Groups,Minor.csv', 'utf-8');
const records = csv.parse(csvData, {
  columns: true,
  skip_empty_lines: true
});

// Map CSV data to movement objects
const movements = records.map(record => {
  // Combine major and minor muscle groups
  const muscleGroups = [
    ...record['Major Muscle Groups'].split(','),
    ...record['Minor Muscle Groups'].split(',')
  ].map(group => group.trim());

  // Determine difficulty based on movement complexity
  let difficulty = 'intermediate';
  if (record.Movement.toLowerCase().includes('strict') || 
      record.Movement.toLowerCase().includes('snatch') ||
      record.Movement.toLowerCase().includes('clean') ||
      record.Movement.toLowerCase().includes('muscle-up')) {
    difficulty = 'advanced';
  } else if (record.Movement.toLowerCase().includes('air squat') ||
             record.Movement.toLowerCase().includes('push-up') ||
             record.Movement.toLowerCase().includes('ring row')) {
    difficulty = 'beginner';
  }

  // Determine category based on movement type
  let category = 'strength';
  if (record.Movement.toLowerCase().includes('run') ||
      record.Movement.toLowerCase().includes('row') ||
      record.Movement.toLowerCase().includes('bike') ||
      record.Movement.toLowerCase().includes('double-under')) {
    category = 'cardio';
  } else if (record.Movement.toLowerCase().includes('muscle-up') ||
             record.Movement.toLowerCase().includes('handstand') ||
             record.Movement.toLowerCase().includes('toes-to-bar') ||
             record.Movement.toLowerCase().includes('l-sit')) {
    category = 'gymnastics';
  } else if (record.Movement.toLowerCase().includes('snatch') ||
             record.Movement.toLowerCase().includes('clean') ||
             record.Movement.toLowerCase().includes('jerk')) {
    category = 'olympic';
  }

  // Determine equipment based on movement
  const equipment = [];
  if (record.Movement.toLowerCase().includes('barbell') ||
      record.Movement.toLowerCase().includes('clean') ||
      record.Movement.toLowerCase().includes('snatch') ||
      record.Movement.toLowerCase().includes('jerk')) {
    equipment.push('Barbell', 'Weight Plates');
  }
  if (record.Movement.toLowerCase().includes('kettlebell')) {
    equipment.push('Kettlebell');
  }
  if (record.Movement.toLowerCase().includes('ring')) {
    equipment.push('Rings');
  }
  if (record.Movement.toLowerCase().includes('pull-up') ||
      record.Movement.toLowerCase().includes('muscle-up') ||
      record.Movement.toLowerCase().includes('toes-to-bar')) {
    equipment.push('Pull-up Bar');
  }
  if (record.Movement.toLowerCase().includes('box')) {
    equipment.push('Box');
  }
  if (record.Movement.toLowerCase().includes('wall ball')) {
    equipment.push('Medicine Ball');
  }
  if (record.Movement.toLowerCase().includes('double-under')) {
    equipment.push('Jump Rope');
  }

  return {
    name: record.Movement,
    description: `A CrossFit movement targeting ${muscleGroups.join(', ')}`,
    muscleGroups,
    difficulty,
    equipment,
    defaultReps: difficulty === 'advanced' ? 5 : difficulty === 'intermediate' ? 10 : 15,
    defaultSets: 3,
    category
  };
});

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing movements
    await Movement.deleteMany({});

    // Insert new movements
    await Movement.insertMany(movements);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 