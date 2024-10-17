import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { updateamenities, deleteAmenity } from '@/api/api-endpoints';

interface UpdateAmenityPayload {
  id: number;
  updateData: {
    updatedBy: { id: number };
    amenityName: string;
    amenityDescription: string;
    amenityGroup: { id: number };
  };
}

export interface AmenitiesState {
  loading: boolean;
  error: string | null;
  success: boolean;
  deleteLoading: boolean;
  deleteError: string | null;
  deleteSuccess: boolean;
}

const initialState: AmenitiesState = {
    loading: false,
    error: null,
    success: false,
    deleteLoading: false,
    deleteError: null,
    deleteSuccess: false,
};  

export const updateAmenity = createAsyncThunk(
  "amenities/updateAmenity",
  async ({ id, updateData }: UpdateAmenityPayload, { rejectWithValue }) => {
    try {
      const response = await updateamenities(id, updateData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update amenity"
      );
    }
  }
);

export const deleteAmenityAsync = createAsyncThunk(
  "amenities/deleteAmenity",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await deleteAmenity(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete amenity"
      );
    }
  }
);

const amenitiesPageSlice = createSlice({
  name: "amenitiesPage",
  initialState,
  reducers: {
    resetAmenitiesState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.deleteLoading = false;
      state.deleteError = null;
      state.deleteSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateAmenity.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateAmenity.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(updateAmenity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(deleteAmenityAsync.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteAmenityAsync.fulfilled, (state) => {
        state.deleteLoading = false;
        state.deleteError = null;
        state.deleteSuccess = true;
      })
      .addCase(deleteAmenityAsync.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload as string;
        state.deleteSuccess = false;
      });
  },
});

export const { resetAmenitiesState } = amenitiesPageSlice.actions;
export default amenitiesPageSlice.reducer;
