import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createPropertyAddditionalImage,
  getAdditionalImageforProperty,
} from "@/api/api-endpoints";

export const uploadPropertyImages = createAsyncThunk(
  "propertyImages/upload",
  async (data: FormData, { rejectWithValue }) => {
    try {
      const response = await createPropertyAddditionalImage(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload images"
      );
    }
  }
);

export const fetchAdditionalImages = createAsyncThunk(
  "propertyImages/fetchAdditional",
  async (propertyId: number, { rejectWithValue }) => {
    try {
      const response = await getAdditionalImageforProperty(propertyId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch additional images"
      );
    }
  }
);
