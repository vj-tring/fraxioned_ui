import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosSetup';

interface AddAmenityData {
  amenityGroup: { id: number };
  createdBy: { id: number };
  amenityName: string;
  amenityDescription: string;
}

interface AddAmenityState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const addAmenity = createAsyncThunk(
  'amenities/addAmenity',
  async (data: AddAmenityData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/v1/amenities/amenity', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
  }
);

const initialState: AddAmenityState = {
  loading: false,
  error: null,
  success: false,
};

const addAmenitySlice = createSlice({
  name: 'addAmenity',
  initialState,
  reducers: {
    resetAddAmenityState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addAmenity.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addAmenity.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(addAmenity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { resetAddAmenityState } = addAmenitySlice.actions;
export default addAmenitySlice.reducer;