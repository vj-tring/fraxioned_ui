import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUserById, updateuserapi } from "@/api/api-endpoints";
import { User } from "@/store/model";

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
        return response.data.user;
    }
);

