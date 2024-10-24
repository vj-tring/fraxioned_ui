import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUserById, updateuserapi } from "@/api/api-endpoints";

export const fetchUserById = createAsyncThunk(
  "user/fetchUserDetails",
  async (userId: number) => {
    const response = await getUserById(userId);
    return response.data.user;
  }
);

export const updateUserById = createAsyncThunk(
  "user/updateUserDetails",
  async ({ userId, userData }: { userId: number; userData: FormData }) => {
    const response = await updateuserapi(userId, userData);
    return response.data.user;
  }
);
