import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Grid,
  Chip,
  Stack,
  Alert,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Sample exercise database - this would typically come from your backend
const exerciseDatabase = {
  chest: ['Push-ups', 'Diamond Push-ups', 'Wide Push-ups', 'Decline Push-ups', 'Incline Push-ups'],
  back: ['Pull-ups', 'Chin-ups', 'Bent Over Rows', 'Superman', 'Reverse Flyes'],
  shoulders: ['Shoulder Press', 'Lateral Raises', 'Front Raises', 'Arnold Press', 'Pike Push-ups'],
  arms: ['Bicep Curls', 'Tricep Dips', 'Hammer Curls', 'Tricep Pushdowns', 'Concentration Curls'],
  core: ['Sit-ups', 'Plank', 'Russian Twists', 'Leg Raises', 'Mountain Climbers'],
  legs: ['Squats', 'Lunges', 'Jump Squats', 'Step-ups', 'Wall Balls'],
  cardio: ['Burpees', 'Mountain Climbers', 'Jump Rope', 'High Knees', 'Butt Kicks'],
  fullBody: ['Burpees', 'Thrusters', 'Man Makers', 'Devil Press', 'Box Jumps']
};

const WorkoutGenerator = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [workoutParams, setWorkoutParams] = useState({
    type: 'AMRAP',
    movementDuration: 10,
    warmupTime: 5,
    cooldownTime: 5,
    difficulty: 'Intermediate',
    focus: [],
    muscleGroups: [],
    rounds: 3,
    exercisesPerRound: 4,
    restTime: 30,
  });
  const [generatedWorkout, setGeneratedWorkout] = useState(null);

  const workoutTypes = ['AMRAP', 'For Time', 'EMOM', 'Tabata', 'Rounds for Time'];
  const difficultyLevels = ['beginner', 'intermediate', 'advanced'];
  const focusAreas = ['strength', 'cardio', 'endurance', 'power', 'mobility'];
  const muscleGroups = [
    'chest',
    'back',
    'shoulders',
    'arms',
    'core',
    'legs',
    'full body'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkoutParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFocusToggle = (focus) => {
    setWorkoutParams((prev) => ({
      ...prev,
      focus: prev.focus.includes(focus)
        ? prev.focus.filter((f) => f !== focus)
        : [...prev.focus, focus],
    }));
  };

  const handleMuscleGroupToggle = (muscleGroup) => {
    setWorkoutParams((prev) => ({
      ...prev,
      muscleGroups: prev.muscleGroups.includes(muscleGroup)
        ? prev.muscleGroups.filter((m) => m !== muscleGroup)
        : [...prev.muscleGroups, muscleGroup],
    }));
  };

  const getRandomExercises = () => {
    const selectedExercises = new Set();
    const exercises = [];

    // If no muscle groups selected, include some cardio exercises
    const targetGroups = workoutParams.muscleGroups.length > 0 
      ? workoutParams.muscleGroups 
      : ['cardio'];

    // Get all possible exercises from selected muscle groups
    const availableExercises = targetGroups.flatMap(group => 
      exerciseDatabase[group] || []
    );

    // Shuffle the available exercises
    const shuffledExercises = [...availableExercises].sort(() => Math.random() - 0.5);

    // Select unique exercises up to movementsPerRound
    for (const exercise of shuffledExercises) {
      if (selectedExercises.size >= workoutParams.exercisesPerRound) break;
      if (!selectedExercises.has(exercise)) {
        selectedExercises.add(exercise);
        exercises.push({
          name: exercise,
          reps: Math.floor(Math.random() * 10) + 10, // Random reps between 10-20
        });
      }
    }

    return exercises;
  };

  const calculateTotalTime = () => {
    const warmupMinutes = workoutParams.warmupTime;
    const movementMinutes = workoutParams.movementDuration;
    const restMinutes = (workoutParams.restTime / 60) * (workoutParams.exercisesPerRound - 1) * workoutParams.rounds;
    const cooldownMinutes = workoutParams.cooldownTime;
    const totalMinutes = warmupMinutes + (movementMinutes * workoutParams.exercisesPerRound * workoutParams.rounds) + restMinutes + cooldownMinutes;
    return Math.ceil(totalMinutes);
  };

  const handleGenerate = () => {
    const generatedWorkout = {
      type: workoutParams.type,
      movementDuration: workoutParams.movementDuration,
      warmupTime: workoutParams.warmupTime,
      cooldownTime: workoutParams.cooldownTime,
      difficulty: workoutParams.difficulty,
      focus: workoutParams.focus,
      muscleGroups: workoutParams.muscleGroups,
      rounds: workoutParams.rounds,
      exercises: getRandomExercises(),
      restTime: workoutParams.restTime,
      totalTime: calculateTotalTime(),
    };
    
    sessionStorage.setItem('currentWorkout', JSON.stringify(generatedWorkout));
    navigate('/timer');
  };

  const handleSave = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // TODO: Implement save workout logic
    console.log('Saving workout:', generatedWorkout);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Generate Workout
        </Typography>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Workout Type</InputLabel>
                <Select
                  name="type"
                  value={workoutParams.type}
                  label="Workout Type"
                  onChange={handleChange}
                >
                  {workoutTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Movement Duration (minutes)</InputLabel>
                <Select
                  name="movementDuration"
                  value={workoutParams.movementDuration}
                  label="Movement Duration (minutes)"
                  onChange={handleChange}
                >
                  {[1, 2, 3, 4, 5, 10, 15, 20].map((mins) => (
                    <MenuItem key={mins} value={mins}>
                      {mins} minutes
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Warmup Time (minutes)</InputLabel>
                <Select
                  name="warmupTime"
                  value={workoutParams.warmupTime}
                  label="Warmup Time (minutes)"
                  onChange={handleChange}
                >
                  {[1, 2, 3, 5, 10, 15].map((mins) => (
                    <MenuItem key={mins} value={mins}>
                      {mins} minutes
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Cooldown Time (minutes)</InputLabel>
                <Select
                  name="cooldownTime"
                  value={workoutParams.cooldownTime}
                  label="Cooldown Time (minutes)"
                  onChange={handleChange}
                >
                  {[1, 2, 3, 5, 10, 15].map((mins) => (
                    <MenuItem key={mins} value={mins}>
                      {mins} minutes
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  name="difficulty"
                  value={workoutParams.difficulty}
                  label="Difficulty"
                  onChange={handleChange}
                >
                  <MenuItem value="Beginner">Beginner</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="Advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Rounds</InputLabel>
                <Select
                  name="rounds"
                  value={workoutParams.rounds}
                  label="Rounds"
                  onChange={handleChange}
                >
                  {[1, 2, 3, 4, 5].map((rounds) => (
                    <MenuItem key={rounds} value={rounds}>
                      {rounds} {rounds === 1 ? 'Round' : 'Rounds'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Exercises per Round</InputLabel>
                <Select
                  name="exercisesPerRound"
                  value={workoutParams.exercisesPerRound}
                  label="Exercises per Round"
                  onChange={handleChange}
                >
                  {[2, 3, 4, 5, 6].map((count) => (
                    <MenuItem key={count} value={count}>
                      {count} {count === 1 ? 'Exercise' : 'Exercises'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Rest Time (seconds)</InputLabel>
                <Select
                  name="restTime"
                  value={workoutParams.restTime}
                  label="Rest Time (seconds)"
                  onChange={handleChange}
                >
                  {[0, 15, 30, 45, 60, 90].map((seconds) => (
                    <MenuItem key={seconds} value={seconds}>
                      {seconds === 0 ? 'No Rest' : `${seconds} seconds`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                <Typography variant="h6" gutterBottom>
                  Estimated Total Workout Time: {calculateTotalTime()} minutes
                </Typography>
                <Typography variant="body2">
                  Breakdown:
                  <br />• Warmup: {workoutParams.warmupTime} minutes
                  <br />• Movement Time: {workoutParams.movementDuration * workoutParams.exercisesPerRound * workoutParams.rounds} minutes
                  <br />• Rest Time: {Math.ceil((workoutParams.restTime / 60) * (workoutParams.exercisesPerRound - 1) * workoutParams.rounds)} minutes
                  <br />• Cooldown: {workoutParams.cooldownTime} minutes
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Focus Areas
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {focusAreas.map((area) => (
                  <Chip
                    key={area}
                    label={area.charAt(0).toUpperCase() + area.slice(1)}
                    onClick={() => handleFocusToggle(area)}
                    color={workoutParams.focus.includes(area) ? 'primary' : 'default'}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                Target Muscle Groups
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {muscleGroups.map((group) => (
                  <Chip
                    key={group}
                    label={group.split(' ').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                    onClick={() => handleMuscleGroupToggle(group)}
                    color={workoutParams.muscleGroups.includes(group) ? 'secondary' : 'default'}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                onClick={handleGenerate}
              >
                Start Workout
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {generatedWorkout && (
          <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              Your Workout
            </Typography>
            <Typography variant="h6" color="primary" gutterBottom>
              {generatedWorkout.type} - Total Time: {generatedWorkout.totalTime} minutes
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Difficulty: {generatedWorkout.difficulty}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Focus: {generatedWorkout.focus.join(', ')}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Target Muscles: {generatedWorkout.muscleGroups.join(', ')}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Rounds: {generatedWorkout.rounds}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Exercises per Round: {generatedWorkout.exercisesPerRound}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Movement Duration: {generatedWorkout.movementDuration} minutes
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Warmup Time: {generatedWorkout.warmupTime} minutes
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Cooldown Time: {generatedWorkout.cooldownTime} minutes
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Rest Time: {generatedWorkout.restTime} seconds
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Exercises:
              </Typography>
              {generatedWorkout.exercises.map((exercise, index) => (
                <Typography key={index} variant="body1">
                  • {exercise.name}: {exercise.reps} reps
                </Typography>
              ))}
            </Box>
            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSave}
                sx={{ mr: 2 }}
              >
                {isAuthenticated ? 'Save Workout' : 'Login to Save'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => setGeneratedWorkout(null)}
              >
                Generate New Workout
              </Button>
            </Box>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default WorkoutGenerator; 