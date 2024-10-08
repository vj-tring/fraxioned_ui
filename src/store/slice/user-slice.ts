import { getUserById, updateuserapi } from "@/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UserState, User } from "../model/user";

const initialState: UserState = {
  user: {
    id: 0,
    role: {
      id: 0,
      roleName: "",
    },
    firstName: "",
    lastName: "",
    imageURL: null,
    isActive: false,
    addressLine1: null,
    addressLine2: null,
    state: null,
    country: null,
    city: null,
    zipcode: null,
    lastLoginTime: "",
    contactDetails: {
      id: 0,
      primaryEmail: "",
      secondaryEmail: null,
      optionalEmailOne: null,
      optionalEmailTwo: null,
      primaryPhone: "",
      secondaryPhone: null,
      optionalPhoneOne: null,
      optionalPhoneTwo: null,
    },
  },
  loading: false,
  error: null,
};

export const fetchUserById = createAsyncThunk(
  "user/fetchUserDetails",
  async (userId: number) => {
    const response = await getUserById(userId);
    return response.data.user;
  }
);

export const updateUserById = createAsyncThunk(
  "user/updateUserDetails",
  async ({ userId, userData }: { userId: number; userData: User }) => {
    const response = await updateuserapi(userId, userData);
    console.log("updateduser", response.data);
    return response.data.user;
  }
);

const userSlice = createSlice({
  name: "UserDetails",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        const {
          password,
          resetToken,
          resetTokenExpires,
          updatedAt,
          createdAt,
          updatedBy,
          createdBy,
          ...userData
        } = action.payload;
        state.user = userData;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user details";
      })
      .addCase(updateUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserById.fulfilled, (state, action) => {
        const {
          password,
          resetToken,
          resetTokenExpires,
          updatedAt,
          createdAt,
          updatedBy,
          createdBy,
          contactDetails: {
            createdAt: contactCreatedAt,
            updatedAt: contactUpdatedAt,
            ...restContactDetails
          },
          ...userData
        } = action.payload;
        state.user = {
          ...userData,
          contactDetails: restContactDetails,
        };
        state.loading = false;
        state.error = null;
      })
      .addCase(updateUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user details";
      });
  },
});

export default userSlice.reducer;
