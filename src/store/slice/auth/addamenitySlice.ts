import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '@/api/axiosSetup';

interface AddAmenityData {
  amenityGroup: { id: number };
  createdBy: { id: number };
  amenityName: string;
  amenityDescription: string;
  imageFile: File | null;
}

export interface AddAmenityState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const addAmenity = createAsyncThunk(
  'amenities/addAmenity',
  async (data: AddAmenityData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('amenityGroup', JSON.stringify(data.amenityGroup));
      formData.append('createdBy', JSON.stringify(data.createdBy));
      formData.append('amenityName', data.amenityName);
      formData.append('amenityDescription', data.amenityDescription);
      
      if (data.imageFile) {
        formData.append('imageFile', data.imageFile);
      }

      const response = await axiosInstance.post('/amenities/amenity', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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