import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllSpaces,
  createSpace,
  updateSpace,
  deleteSpace,
} from "@/store/services";

// Thunks
export const fetchAllSpaces = createAsyncThunk(
  "space/fetchAllSpaces",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllSpaces();
      return response.data.data; // Ensure this matches your API response structure
    } catch (error) {
      return rejectWithValue("Failed to fetch spaces");
    }
  }
);

// Create Space Thunk
export const createNewSpace = createAsyncThunk(
  "space/createNewSpace",
  async (spaceData: FormData) => {
    const response = await createSpace(spaceData);
    // Handle conflict by checking the statusCode in the response
    if (response.data.statusCode === 409) {
      return { statusCode: 409, message: response.data.message };
    }
    return { statusCode: 201, data: response.data.data }; // Success case
  }
);

export const updateExistingSpace = createAsyncThunk(
  "space/updateExistingSpace",
  async ({ id, spaceData }: { id: number; spaceData: FormData }) => {
    const response = await updateSpace(id, spaceData);
    if (response.data.statusCode === 409) {
      return { statusCode: 409, message: response.data.message };
    }
    return { statusCode: 200, data: response.data.data }; // Success case
  }
);

export const deleteExistingSpace = createAsyncThunk<
  { statusCode: number; spaceId?: number; message?: string }, // Success and conflict payload type
  number // Argument type (spaceId)
>("space/deleteExistingSpace", async (spaceId) => {
  try {
    const response = await deleteSpace(spaceId);

    if (response.data.statusCode === 409) {
      // Conflict case
      return {
        statusCode: 409,
        message: response.data.message,
      };
    } else if (response.data.statusCode === 204) {
      // Success case: Space deleted
      return {
        statusCode: 204,
        spaceId,
      };
    }

    throw new Error("Unexpected response");
  } catch (error: any) {
    // Handle unexpected errors
    return {
      statusCode: 500,
      message: error.message || "An unexpected error occurred",
    };
  }
});
