import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

// Components
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import WorkoutGenerator from './components/pages/WorkoutGenerator';
import WorkoutTimer from './components/workout/WorkoutTimer';
import WorkoutHistory from './components/pages/WorkoutHistory';
import Profile from './components/pages/Profile';
import Login from './components/auth/Login';
import PrivateRoute from './components/routing/PrivateRoute';

//Only adding this in to force a github commit

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/generate" element={<WorkoutGenerator />} />
          <Route path="/timer" element={<WorkoutTimer />} />
          <Route
            path="/history"
            element={
              <PrivateRoute>
                <WorkoutHistory />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App; 