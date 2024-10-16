import { createAsyncThunk } from "@reduxjs/toolkit";
import { amenitiesapi, addAmenity, updateamenities, deleteAmenity } from "@/api";
import { Amenity } from "@/store/model";

export const fetchAmenities = createAsyncThunk(
  "amenities/fetchAmenities",
  async () => {
    const response = await amenitiesapi();
    return response.data;
  }
);
export const createAmenity = createAsyncThunk(
    'amenities/addAmenity',
    async (data: Amenity, { rejectWithValue }) => {
      try {
        const response = await addAmenity(data);
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'An error occurred');
      }
    }
  );

  export const updateAmenity = createAsyncThunk(
    'amenities/updateAmenity',
    async ({ id, updateData }: { id: number; updateData: Amenity }, { rejectWithValue }) => {
        try {
            const response = await updateamenities(id, updateData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update amenity');
        }
    }
);

export const deleteAmenityAsync = createAsyncThunk(
    'amenities/deleteAmenity',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await deleteAmenity(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete amenity');
        }
    }
);
