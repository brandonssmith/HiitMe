import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  IconButton,
  Stack,
  CircularProgress,
  Modal,
  LinearProgress,
} from '@mui/material';
import { PlayArrow, Pause, Refresh } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const WorkoutTimer = () => {
  const navigate = useNavigate();
  const workout = JSON.parse(sessionStorage.getItem('currentWorkout'));
  const [timeLeft, setTimeLeft] = useState(workout?.movementDuration * 60 || 0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [showCountdown, setShowCountdown] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(workout?.restTime || 30);
  const [showSummary, setShowSummary] = useState(false);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [isWarmup, setIsWarmup] = useState(true);
  const [warmupTimeLeft, setWarmupTimeLeft] = useState(workout?.warmupTime * 60 || 0);
  const [isCooldown, setIsCooldown] = useState(false);
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState(workout?.cooldownTime * 60 || 0);

  // Create audio context and oscillator for beeps
  const createBeep = useCallback((frequency = 800, duration = 0.1) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  }, []);

  // Create round completion sound
  const playRoundComplete = useCallback(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
  }, []);

  useEffect(() => {
    if (!workout) {
      navigate('/generate');
    }
  }, [workout, navigate]);

  // Warmup timer effect
  useEffect(() => {
    let warmupTimer;
    if (isRunning && isWarmup && warmupTimeLeft > 0) {
      warmupTimer = setInterval(() => {
        setWarmupTimeLeft((prev) => {
          if (prev <= 1) {
            setIsWarmup(false);
            setTimeLeft(workout.movementDuration * 60);
            return 0;
          }
          // Play beep for last 10 seconds of warmup
          if (prev <= 10) {
            createBeep(800, 0.2);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(warmupTimer);
  }, [isRunning, isWarmup, warmupTimeLeft, createBeep, workout.movementDuration]);

  // Main timer effect
  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0 && !isResting && !isWarmup && !isCooldown) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          // Play beep for last 10 seconds
          if (prev <= 10) {
            createBeep(1000, 0.2);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, isResting, createBeep, isWarmup, isCooldown]);

  // Rest timer effect
  useEffect(() => {
    let restTimer;
    if (isResting && restTimeLeft > 0) {
      restTimer = setInterval(() => {
        setRestTimeLeft((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            setRestTimeLeft(workout.restTime);
            return 0;
          }
          // Play beep for last 10 seconds of rest
          if (prev <= 10) {
            createBeep(600, 0.2);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(restTimer);
  }, [isResting, restTimeLeft, createBeep, workout.restTime]);

  // Countdown effect
  useEffect(() => {
    let countdownTimer;
    if (showCountdown && countdown > 0) {
      createBeep();
      countdownTimer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setShowCountdown(false);
            setIsRunning(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countdownTimer);
  }, [showCountdown, countdown, createBeep]);

  // Cooldown timer effect
  useEffect(() => {
    let cooldownTimer;
    if (isRunning && isCooldown && cooldownTimeLeft > 0) {
      cooldownTimer = setInterval(() => {
        setCooldownTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setShowSummary(true);
            return 0;
          }
          // Play beep for last 10 seconds of cooldown
          if (prev <= 10) {
            createBeep(600, 0.2);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(cooldownTimer);
  }, [isRunning, isCooldown, cooldownTimeLeft, createBeep]);

  // Handle exercise completion
  const handleExerciseComplete = () => {
    // Record completed exercise
    setCompletedExercises(prev => [...prev, {
      round: currentRound,
      exercise: workout.exercises[currentExercise],
      timestamp: new Date().toISOString()
    }]);

    if (currentExercise < workout.exercises.length - 1) {
      setCurrentExercise(prev => prev + 1);
      if (workout.restTime > 0) {
        setIsResting(true);
      }
    } else if (currentRound < workout.rounds) {
      playRoundComplete();
      setCurrentRound(prev => prev + 1);
      setCurrentExercise(0);
      if (workout.restTime > 0) {
        setIsResting(true);
      }
    } else {
      // Start cooldown if workout is complete
      if (workout.cooldownTime > 0) {
        setIsCooldown(true);
        setCooldownTimeLeft(workout.cooldownTime * 60);
      } else {
        setIsRunning(false);
        setShowSummary(true);
      }
    }
  };

  // Add handlers for warmup and cooldown completion
  const handleWarmupComplete = () => {
    setIsWarmup(false);
    setTimeLeft(workout.movementDuration * 60);
  };

  const handleCooldownComplete = () => {
    setIsCooldown(false);
    setIsRunning(false);
    setShowSummary(true);
  };

  if (!workout) {
    return null;
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    if (!isRunning && !showCountdown) {
      setCountdown(10);
      setShowCountdown(true);
    } else {
      setIsRunning(false);
    }
  };

  const resetTimer = () => {
    setTimeLeft(workout.movementDuration * 60);
    setWarmupTimeLeft(workout.warmupTime * 60);
    setCooldownTimeLeft(workout.cooldownTime * 60);
    setIsRunning(false);
    setCurrentRound(1);
    setCurrentExercise(0);
    setShowCountdown(false);
    setCountdown(0);
    setIsResting(false);
    setRestTimeLeft(workout.restTime);
    setCompletedExercises([]);
    setShowSummary(false);
    setIsWarmup(true);
    setIsCooldown(false);
  };

  const progress = ((workout.movementDuration * 60 - timeLeft) / (workout.movementDuration * 60)) * 100;
  const roundProgress = ((currentExercise + 1) / workout.exercises.length) * 100;
  const workoutProgress = ((currentRound - 1 + (currentExercise + 1) / workout.exercises.length) / workout.rounds) * 100;

  // Workout Summary Component
  const WorkoutSummary = () => (
    <Modal
      open={showSummary}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={24}
        sx={{
          p: 4,
          maxWidth: 600,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Workout Complete! 🎉
        </Typography>
        <Typography variant="h6" color="primary" gutterBottom>
          {workout.type} - {workout.totalTime} minutes
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Completed Exercises
          </Typography>
          {Array.from({ length: workout.rounds }, (_, i) => i + 1).map((round) => (
            <Box key={round} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" color="primary">
                Round {round}
              </Typography>
              {completedExercises
                .filter(ex => ex.round === round)
                .map((ex, index) => (
                  <Typography key={index} variant="body1" sx={{ ml: 2 }}>
                    • {ex.exercise.name}: {ex.exercise.reps} reps
                  </Typography>
                ))}
            </Box>
          ))}
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Workout Details
          </Typography>
          <Typography variant="body1">
            Difficulty: {workout.difficulty}
          </Typography>
          <Typography variant="body1">
            Focus: {workout.focus.join(', ')}
          </Typography>
          <Typography variant="body1">
            Target Muscles: {workout.muscleGroups.join(', ')}
          </Typography>
        </Box>

        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/generate')}
          >
            New Workout
          </Button>
          <Button
            variant="outlined"
            onClick={() => setShowSummary(false)}
          >
            Close
          </Button>
        </Box>
      </Paper>
    </Modal>
  );

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isWarmup ? 'Warmup' : isCooldown ? 'Cooldown' : workout.type}
        </Typography>

        {/* Overall Workout Progress */}
        {!isWarmup && !isCooldown && (
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Round {currentRound} of {workout.rounds}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={workoutProgress} 
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Paper>
        )}

        {/* Timer Display */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mt: 3,
            position: 'relative',
            overflow: 'hidden',
            minHeight: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress
            variant="determinate"
            value={isWarmup 
              ? ((workout.warmupTime * 60 - warmupTimeLeft) / (workout.warmupTime * 60)) * 100
              : isCooldown
                ? ((workout.cooldownTime * 60 - cooldownTimeLeft) / (workout.cooldownTime * 60)) * 100
                : progress}
            size={100}
            thickness={4}
            sx={{
              color: 'primary.main',
              position: 'absolute',
              top: '50%',
              right: '20px',
              transform: 'translateY(-50%)',
              zIndex: 2,
            }}
          />
          <Typography
            variant="h1"
            component="div"
            sx={{
              fontSize: '6rem',
              fontWeight: 'bold',
              position: 'relative',
              zIndex: 1,
              textAlign: 'center',
              width: '100%',
            }}
          >
            {isWarmup 
              ? formatTime(warmupTimeLeft)
              : isCooldown
                ? formatTime(cooldownTimeLeft)
                : isResting 
                  ? formatTime(restTimeLeft) 
                  : formatTime(timeLeft)}
          </Typography>
          {isResting && (
            <Typography variant="h5" color="primary" sx={{ mt: 2 }}>
              Rest Time
            </Typography>
          )}
        </Paper>

        {/* Controls */}
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          sx={{ mt: 4 }}
        >
          <IconButton
            color="primary"
            onClick={toggleTimer}
            size="large"
            sx={{ width: 64, height: 64 }}
          >
            {isRunning ? <Pause fontSize="large" /> : <PlayArrow fontSize="large" />}
          </IconButton>
          <IconButton
            color="secondary"
            onClick={resetTimer}
            size="large"
            sx={{ width: 64, height: 64 }}
          >
            <Refresh fontSize="large" />
          </IconButton>
        </Stack>

        {/* Warmup Phase */}
        {isWarmup && (
          <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Warmup Phase
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Prepare your body for the workout ahead
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleWarmupComplete}
              sx={{ mt: 2 }}
              disabled={!isRunning}
            >
              Complete Warmup
            </Button>
          </Paper>
        )}

        {/* Cooldown Phase */}
        {isCooldown && (
          <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Cooldown Phase
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Take time to stretch and recover
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCooldownComplete}
              sx={{ mt: 2 }}
              disabled={!isRunning}
            >
              Complete Cooldown
            </Button>
          </Paper>
        )}

        {/* Current Exercise */}
        {!isWarmup && !isCooldown && (
          <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              {isResting ? 'Next Exercise' : 'Current Exercise'}
            </Typography>
            <Typography variant="h4" color="primary">
              {workout.exercises[currentExercise].name}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {workout.exercises[currentExercise].reps} reps
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Exercise {currentExercise + 1} of {workout.exercises.length}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={roundProgress} 
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleExerciseComplete}
              sx={{ mt: 2 }}
              disabled={!isRunning || isResting}
            >
              Complete Exercise
            </Button>
          </Paper>
        )}

        {/* Workout Details */}
        <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Workout Details
          </Typography>
          <Typography variant="body1">
            Difficulty: {workout.difficulty}
          </Typography>
          <Typography variant="body1">
            Focus: {workout.focus.join(', ')}
          </Typography>
          <Typography variant="body1">
            Target Muscles: {workout.muscleGroups.join(', ')}
          </Typography>
          <Typography variant="body1">
            Total Time: {workout.totalTime} minutes
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/generate')}
            sx={{ mt: 2 }}
          >
            Back to Generator
          </Button>
        </Paper>
      </Box>

      {/* Countdown Modal */}
      <Modal
        open={showCountdown}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={24}
          sx={{
            p: 4,
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          <Typography variant="h1" color="primary" sx={{ fontSize: '8rem' }}>
            {countdown}
          </Typography>
          <Typography variant="h5" color="text.secondary">
            Get Ready!
          </Typography>
        </Paper>
      </Modal>

      {/* Workout Summary */}
      <WorkoutSummary />
    </Container>
  );
};

export default WorkoutTimer; 