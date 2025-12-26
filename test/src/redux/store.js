// store.js
import { configureStore } from '@reduxjs/toolkit';
import wallpaperReducer from './wallpaperSlice';

export const store = configureStore({
  reducer: {
    wallpaper: wallpaperReducer,
  },
});
