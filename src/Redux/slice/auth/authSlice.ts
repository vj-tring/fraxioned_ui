import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../reducers';
import { loginUser, logoutUserApi } from 'utils/api';
interface Role {
  id: number;
  roleName: string;
}
interface User {
  roleId: number;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  isAdmin: boolean;
  country: string;
  zipcode: string;
  password: string;
  imageURL: string | null;
  isActive: number;
  addressLine1: string | null;
  addressLine2: string | null;
  resetToken: string;
  resetTokenExpires: string | null;
  lastLoginTime: string;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
  role: Role;
}
interface Session {
  token: string;
  expiresAt: string;
}
interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
}
const loadStateFromLocalStorage = (): AuthState => {
  try {
    const user = localStorage.getItem('user');
    const session = localStorage.getItem('session');
    if (user && session) {
      const parsedUser = JSON.parse(user);
      const isAdmin = parsedUser.role.id === 1;
      return {
        user: parsedUser,
        session: JSON.parse(session),
        loading: false,
        error: null,
        isAdmin,
      };
    }
  } catch (e) {
    console.error('Failed to load state from local storage:', e);
  }
  return {
    user: null,
    session: null,
    loading: false,
    error: null,
    isAdmin: false,
  };
};
const initialState: AuthState = loadStateFromLocalStorage();
export const login = createAsyncThunk<
  { user: User; session: Session },
  { email: string; password: string },
  { rejectValue: string }
>(
  'authentication/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await loginUser(email, password);
      const data = response.data;
      if (response.data.status === 200 && data.message === 'Login successful') {
        const { session, user } = data;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('session', JSON.stringify(session));
        localStorage.setItem('accessToken', session.token);
        return { user, session };
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again later.';
      return rejectWithValue(errorMessage);
    }
  }
);
export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'authentication/logout',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const sessionToken = state.auth.session?.token;
      if (sessionToken) {
        await logoutUserApi(sessionToken);
        localStorage.clear();
      }
    } catch (error: any) {
      return rejectWithValue('Logout failed. Please try again.');
    }
  }
);
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; session: Session }>) => {
      state.user = action.payload.user;
      state.session = action.payload.session;
      state.isAdmin = action.payload.user.role.id === 1;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('session', JSON.stringify(action.payload.session));
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
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ user: User; session: Session }>) => {
        state.user = action.payload.user;
        state.session = action.payload.session;
        state.isAdmin = action.payload.user.role.id === 1;
        state.loading = false;
        state.error = null;
      })
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
// Selectors
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAdmin = (state: { auth: AuthState }) => state.auth.isAdmin;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export default authSlice.reducer;