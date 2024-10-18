import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User, Session } from "../../model";
import { login, fetchAuthState, logoutUser } from "./actions";

const initialState: AuthState = {
  user: null,
  session: null,
  loading: true,
  error: null,
  isAdmin: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; session: Session }>
    ) => {
      state.user = action.payload.user;
      state.session = action.payload.session;
      state.isAdmin = action.payload.user.role.id === 1;
      //   localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem("session", JSON.stringify(action.payload.session));
    },

    logout: (state) => {
      state.user = null;
      state.session = null;
      state.isAdmin = false;
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthState.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAuthState.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.session = action.payload.session;
        state.isAdmin = action.payload.user?.role?.id === 1;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchAuthState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<{ user: User; session: Session }>) => {
          state.user = action.payload.user;
          state.session = action.payload.session;
          state.isAdmin = action.payload.user.role.id === 1;
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.session = null;
        state.isAdmin = false;
        localStorage.clear();
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export * from "./actions";
// Selectors
export const selectCurrentUser = (state: { auth: AuthState }) =>
  state.auth.user;
export const selectIsAdmin = (state: { auth: AuthState }) => state.auth.isAdmin;
export const selectAuthLoading = (state: { auth: AuthState }) =>
  state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export default authSlice.reducer;
