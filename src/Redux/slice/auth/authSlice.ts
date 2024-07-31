import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../../reducers'
import { ApiUrl } from '../../../Components/config'

interface User {
  roleId: number
  id: number
  email: string
  firstName: string
  lastName: string
  mobile: string
  address: string
  city: string
  state: string
  isAdmin: boolean
  country: string
  zipcode: string
}

interface Session {
  token: string
  expiresAt: string
}

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
  isAdmin: boolean
}

const loadStateFromLocalStorage = (): AuthState => {
  try {
    const user = localStorage.getItem('user')
    const session = localStorage.getItem('session')
    if (user && session) {
      const parsedUser = JSON.parse(user)
      const isAdmin = parsedUser.roleId === 1
      return {
        user: parsedUser,
        session: JSON.parse(session),
        loading: false,
        error: null,
        isAdmin,
      }
    }
  } catch (e) {
    console.error('Failed to load state from local storage:', e)
  }

  return {
    user: null,
    session: null,
    loading: false,
    error: null,
    isAdmin: false,
  }
}

const initialState: AuthState = loadStateFromLocalStorage()

export const login = createAsyncThunk(
  'authentication/login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${ApiUrl}/authentication/login`, {
        email,
        password,
      })
      const data = response.data
      if (data.message === 'Login successful' && response.data.status === 200) {
        const { session, user } = data
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('session', JSON.stringify(session))
        localStorage.setItem('accessToken', data.session.token)
        return { user, session }
      } else {
        return rejectWithValue(data.message)
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message)
      }
      return rejectWithValue('Something went wrong. Please try again later.')
    }
  }
)

export const logoutUser = createAsyncThunk(
  'authentication/logout',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const sessionToken = state.auth.session?.token

      if (sessionToken) {
        await axios.post('/authentication/logout', { sessionToken })
        localStorage.clear()
      }

      return
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue('Logout failed. Please try again.')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; session: Session }>
    ) => {
      state.user = action.payload.user
      state.session = action.payload.session
      state.isAdmin = action.payload.user.roleId === 1
      localStorage.setItem('user', JSON.stringify(action.payload.user))
      localStorage.setItem('session', JSON.stringify(action.payload.session))
    },
    logout: (state) => {
      state.user = null
      state.session = null
      state.isAdmin = false
      localStorage.removeItem('user')
      localStorage.removeItem('session')
      localStorage.removeItem('accessToken')
      localStorage.clear()
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<{ user: User; session: Session }>) => {
          state.user = action.payload.user
          state.session = action.payload.session
          state.isAdmin = action.payload.user.roleId === 1
          state.loading = false
          state.error = null
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.session = null
        state.isAdmin = false
        localStorage.removeItem('user')
        localStorage.removeItem('session')
        localStorage.removeItem('accessToken')
        localStorage.clear()
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload as string
      })
  },
})

export const { logout, setCredentials } = authSlice.actions

// Selectors
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user
export const selectIsAdmin = (state: { auth: AuthState }) => state.auth.isAdmin
export const selectAuthLoading = (state: { auth: AuthState }) =>
  state.auth.loading
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error

export default authSlice.reducer
