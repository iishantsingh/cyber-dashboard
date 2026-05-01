import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import threatsReducer from './threatsSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    threats: threatsReducer,
  },
});
