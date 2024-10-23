import { createAsyncThunk } from "@reduxjs/toolkit";
import { addAmenityGroup, getAllAmenityGroup } from "@/api/api-endpoints";

export const fetchAmenityGroups = createAsyncThunk(
  "amenityGroups/fetchAmenityGroups",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllAmenityGroup();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch amenity groups"
      );
    }
  }
);

export const addAmenityGroup = createAsyncThunk(
  "amenityGroups/addAmenityGroup",
  async (
    data: { createdBy: { id: number }; name: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await addAmenityGroup(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add amenity group"
      );
    }
  }
);
