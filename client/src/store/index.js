import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import workoutReducer from './slices/workoutSlice';
import movementReducer from './slices/movementSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    workout: workoutReducer,
    movement: movementReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store; 