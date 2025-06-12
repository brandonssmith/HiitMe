import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getTitle = () => {
    if (location.pathname === '/timer') {
      const workout = JSON.parse(sessionStorage.getItem('currentWorkout'));
      return workout ? `${workout.type} Workout` : 'HiiT Me';
    }
    return 'HiiT Me';
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          {getTitle()}
        </Typography>
        <Box>
          <Button color="inherit" onClick={() => navigate('/generate')}>
            Generate
          </Button>
          <Button color="inherit" onClick={() => navigate('/history')}>
            History
          </Button>
          <Button color="inherit" onClick={() => navigate('/profile')}>
            Profile
          </Button>
          <Button color="inherit" onClick={() => navigate('/login')}>
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 