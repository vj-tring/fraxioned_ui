// src/Redux/store/index.ts
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { useDispatch as useReduxDispatch } from 'react-redux';
import rootReducer from '../reducers'; // Adjust this path as needed

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const useDispatch = () => useReduxDispatch<AppDispatch>();

export default store;
