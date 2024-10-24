import {
  getAllUserProperties,
  createUserProperty as createUserPropertyAPI,
  updateUserProperty as updateUserPropertyAPI,
  deleteUserProperty as deleteUserPropertyAPI,
} from "@/store/services";
import { getUserProperties } from "@/store/services";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUserProperties = createAsyncThunk(
  "userProperties/fetchUserProperties",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllUserProperties();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const fetchUserPropertiesWithDetailsByUser = createAsyncThunk(
  "userProperties/fetchUserPropertiesWithDetailsByUser",
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await getUserProperties(userId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const createUserProperty = createAsyncThunk(
  "userProperties/createUserProperty",
  async (createUserPropertyDto: any, { rejectWithValue }) => {
    try {
      const response = await createUserPropertyAPI(createUserPropertyDto);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const updateUserProperty = createAsyncThunk(
  "userProperties/updateUserProperty",
  async (
    { id, updateUserPropertyDto }: { id: number; updateUserPropertyDto: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateUserPropertyAPI(id, updateUserPropertyDto);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const deleteUserProperty = createAsyncThunk(
  "userProperties/deleteUserProperty",
  async (
    { userId, propertyId }: { userId: number; propertyId: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await deleteUserPropertyAPI(userId, propertyId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);
