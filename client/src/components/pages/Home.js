import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          HiiT Workout Generator
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom color="text.secondary">
          Generate personalized HiiT workouts tailored to your goals
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/generate')}
            sx={{ mr: 2 }}
          >
            Generate Workout
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            onClick={() => navigate('/history')}
          >
            View History
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home; 