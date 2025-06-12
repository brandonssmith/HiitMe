import React from 'react';
import { Container, Typography, Box, Paper, List, ListItem, ListItemText } from '@mui/material';

const WorkoutHistory = () => {
  // This will be replaced with actual workout history data from Redux store
  const mockWorkouts = [
    { id: 1, date: '2024-03-15', type: 'AMRAP', duration: '20 min' },
    { id: 2, date: '2024-03-14', type: 'For Time', duration: '15 min' },
    { id: 3, date: '2024-03-13', type: 'EMOM', duration: '10 min' },
  ];

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Workout History
        </Typography>
        <Paper elevation={3}>
          <List>
            {mockWorkouts.map((workout) => (
              <ListItem key={workout.id} divider>
                <ListItemText
                  primary={`${workout.type} - ${workout.duration}`}
                  secondary={workout.date}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Container>
  );
};

export default WorkoutHistory; 