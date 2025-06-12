import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const getMovements = createAsyncThunk(
  'movement/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/.netlify/functions/api/movements');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getMovementsByMuscleGroup = createAsyncThunk(
  'movement/getByMuscleGroup',
  async (muscleGroup, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/.netlify/functions/api/movements/muscle-group/${muscleGroup}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  movements: [],
  filteredMovements: [],
  loading: false,
  error: null,
};

const movementSlice = createSlice({
  name: 'movement',
  initialState,
  reducers: {
    filterMovements: (state, action) => {
      const { muscleGroups, difficulty } = action.payload;
      state.filteredMovements = state.movements.filter(movement => {
        const matchesMuscleGroups = muscleGroups.length === 0 || 
          muscleGroups.some(group => movement.muscleGroups.includes(group));
        const matchesDifficulty = !difficulty || movement.difficulty === difficulty;
        return matchesMuscleGroups && matchesDifficulty;
      });
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMovements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMovements.fulfilled, (state, action) => {
        state.loading = false;
        state.movements = action.payload;
        state.filteredMovements = action.payload;
      })
      .addCase(getMovements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMovementsByMuscleGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMovementsByMuscleGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredMovements = action.payload;
      })
      .addCase(getMovementsByMuscleGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { filterMovements, clearError } = movementSlice.actions;
export default movementSlice.reducer; 