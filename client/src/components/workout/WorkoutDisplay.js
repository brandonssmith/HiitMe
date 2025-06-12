import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Chip,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { saveWorkout } from '../../store/slices/workoutSlice';

const WorkoutDisplay = ({ workout }) => {
  const dispatch = useDispatch();

  const handleSaveWorkout = () => {
    dispatch(saveWorkout(workout));
  };

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h5" gutterBottom>
        Your Workout
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" color="primary" gutterBottom>
          Warm-up
        </Typography>
        <List>
          {workout.warmup.map((exercise, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={exercise.movement}
                secondary={`${exercise.duration ? `${exercise.duration} minutes` : `${exercise.reps} reps`}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" color="primary" gutterBottom>
          Main Workout ({workout.rounds} rounds)
        </Typography>
        <List>
          {workout.mainWorkout.map((exercise, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText
                  primary={exercise.movement}
                  secondary={
                    <>
                      {exercise.reps && `${exercise.reps} reps`}
                      {exercise.weight && ` • ${exercise.weight} kg`}
                      {exercise.notes && ` • ${exercise.notes}`}
                    </>
                  }
                />
              </ListItem>
              {index < workout.mainWorkout.length - 1 && (
                <ListItem>
                  <ListItemText
                    secondary={`Rest: ${workout.restInterval} seconds`}
                    sx={{ textAlign: 'center', color: 'text.secondary' }}
                  />
                </ListItem>
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" color="primary" gutterBottom>
          Cooldown
        </Typography>
        <List>
          {workout.cooldown.map((exercise, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={exercise.movement}
                secondary={`${exercise.duration ? `${exercise.duration} minutes` : `${exercise.reps} reps`}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Target Muscle Groups:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {workout.targetMuscleGroups.map((group) => (
            <Chip key={group} label={group} size="small" />
          ))}
        </Box>
      </Box>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.secondary">
          Estimated Duration: {workout.totalDuration} minutes
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Difficulty: {workout.difficulty}
        </Typography>
      </Box>
    </Paper>
  );
};

export default WorkoutDisplay; 