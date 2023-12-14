import { configureStore } from '@reduxjs/toolkit';
import cardReducer from './card/cardSlice';

export const store = configureStore({
  reducer: {
    card: cardReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
