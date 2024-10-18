import { RootState } from "../../reducers";
import { loginUser, logoutUserApi, getUserById } from "../../../api/api-endpoints";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { User, Session, AuthState } from "../../model";

export const fetchAuthState = createAsyncThunk<
  AuthState,
  void,
  { rejectValue: string }
>("authentication/fetchAuthState", async () => {
  try {
    const session = localStorage.getItem("session");
    if (session) {
      const parsedSession: Session = JSON.parse(session);
      const response = await getUserById(parsedSession.userId);
      const data: User = response.data.user;
      const isAdmin = data.role.id === 1;
      return {
        user: data,
        session: parsedSession,
        loading: false,
        error: null,
        isAdmin,
      };
    }
  } catch (error) {
    console.log("Failed to load state:", error);
  }
  return {
    user: null,
    session: null,
    loading: false,
    error: null,
    isAdmin: false,
  };
});

export const login = createAsyncThunk<
  { user: User; session: Session },
  { email: string; password: string },
  { rejectValue: string }
>("authentication/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await loginUser(email, password);
    const data = response.data;

    if (response.data.status === 200 && data.message === "Login successful") {
      const { session, user } = data;
      const sessionWithUserId: Session = {
        ...session,
        userId: user.id,
      };
      //   localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("session", JSON.stringify(sessionWithUserId));
      localStorage.setItem("accessToken", session.token);
      return { user, session: sessionWithUserId };
    } else {
      return rejectWithValue(data.message);
    }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      "Something went wrong. Please try again later.";
    return rejectWithValue(errorMessage);
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "authentication/logout",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const sessionToken = state.auth.session?.token;

      if (sessionToken) {
        await logoutUserApi(sessionToken);
        localStorage.clear();
      }
    } catch (error: any) {
      return rejectWithValue("Logout failed. Please try again.");
    }
  }
);
