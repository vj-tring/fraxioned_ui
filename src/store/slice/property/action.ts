import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProperties,
  getPropertyById,
  getPropertyDetailsbyId,
} from "@/store/services";

export const fetchProperties = createAsyncThunk(
  "properties/fetchProperties",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProperties();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch properties"
      );
    }
  }
);

export const fetchPropertyById = createAsyncThunk(
  "properties/fetchPropertyById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await getPropertyById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch property"
      );
    }
  }
);

export const fetchPropertyDetailsById = createAsyncThunk(
  "properties/fetchPropertyDetailsById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await getPropertyDetailsbyId(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch property details"
      );
    }
  }
);
