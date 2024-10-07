import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { amenitiesapi } from '@/api';

interface Amenity {
  id: number;
  amenityName: string;
  amenityDescription: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: number;
  };
  updatedBy: {
    id: number;
  } | null;
  amenityGroup: {
    id: number;
    name: string;
  };
}

interface AmenitiesState {
  amenities: Amenity[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AmenitiesState = {
  amenities: [],
  status: 'idle',
  error: null,
};

export const fetchAmenities = createAsyncThunk('amenities/fetchAmenities', async () => {
  const response = await amenitiesapi();
  return response.data;
});

const amenitiesSlice = createSlice({
  name: 'amenities',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAmenities.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAmenities.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.amenities = action.payload.data;
      })
      .addCase(fetchAmenities.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch amenities';
      });
  },
});

export default amenitiesSlice.reducer;