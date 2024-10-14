import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { amenitiesapi } from '@/store/service';

interface Amenity {
  id: number;
  amenityName: string;
  amenityDescription: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: number;
  } | null;
  updatedBy: {
    id: number;
  } | null;
  amenityGroup: {
    id: number;
    name: string;
  };
}

export interface AmenitiesState {
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
  reducers: {
    resetAmenitiesState: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAmenities.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAmenities.fulfilled, (state, action: PayloadAction<{ data: Amenity[] }>) => {
        state.status = 'succeeded';
        state.amenities = action.payload.data;
      })
      .addCase(fetchAmenities.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch amenities';
      })
  

  },
});

export const { resetAmenitiesState } = amenitiesSlice.actions;
export default amenitiesSlice.reducer;