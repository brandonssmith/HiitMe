import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const generateWorkout = createAsyncThunk(
  'workout/generate',
  async (workoutParams, { rejectWithValue }) => {
    try {
      const response = await axios.post('/.netlify/functions/generate-workout', workoutParams);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const saveWorkout = createAsyncThunk(
  'workout/save',
  async (workout, { rejectWithValue }) => {
    try {
      const response = await axios.post('/.netlify/functions/save-workout', workout);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getWorkoutHistory = createAsyncThunk(
  'workout/history',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/.netlify/functions/api/workouts/history');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  currentWorkout: null,
  workoutHistory: [],
  loading: false,
  error: null,
};

const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    clearCurrentWorkout: (state) => {
      state.currentWorkout = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateWorkout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateWorkout.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWorkout = action.payload;
      })
      .addCase(generateWorkout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveWorkout.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveWorkout.fulfilled, (state, action) => {
        state.loading = false;
        state.workoutHistory.unshift(action.payload);
      })
      .addCase(saveWorkout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getWorkoutHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getWorkoutHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.workoutHistory = action.payload;
      })
      .addCase(getWorkoutHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentWorkout, clearError } = workoutSlice.actions;
export default workoutSlice.reducer; 