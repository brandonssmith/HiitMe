const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db();
    
    const { type, duration, intensity } = JSON.parse(event.body);
    
    // Get exercises from database
    const exercises = await db.collection('exercises').find({}).toArray();
    
    // Generate workout based on parameters
    const workout = generateWorkout(exercises, type, duration, intensity);
    
    await client.close();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify(workout)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

function generateWorkout(exercises, type, duration, intensity) {
  // Your workout generation logic here
  // This is a simplified example
  const selectedExercises = exercises
    .filter(ex => ex.type === type)
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);

  return {
    type,
    duration,
    intensity,
    exercises: selectedExercises
  };
} 