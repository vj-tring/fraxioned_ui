import { combineReducers, configureStore } from "@reduxjs/toolkit";
import loginSlice from "./Features/loginSlice";

export type RootState = ReturnType<typeof rootReducer>;

const rootReducer = combineReducers({
  login: loginSlice,
});

export const store = configureStore({
  reducer: rootReducer,
});
