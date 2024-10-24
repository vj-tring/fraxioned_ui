import { createAsyncThunk } from "@reduxjs/toolkit";
import { propertyImageapi } from "@/api/api-endpoints";

export const fetchPropertyImages = createAsyncThunk(
  "propertyImages/fetchPropertyImages",
  async (propertyId: number, { rejectWithValue }) => {
    try {
      const response = await propertyImageapi(propertyId);
      return response.data.data;
    } catch (error) {
      console.error("Fetching property images failed:", error);
      return rejectWithValue("Failed to fetch property images");
    }
  }
);
