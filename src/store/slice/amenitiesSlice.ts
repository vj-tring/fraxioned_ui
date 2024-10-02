import { propertyAmenitiesapi } from '@/api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface Amenity {
  id: number;
  amenityName: string;
  amenityDescription: string;
  amenityType: string;
}

export interface AmenitiesState {
  amenities: Amenity[];
  loading: boolean;
  error: string | null;
}

const initialState: AmenitiesState = {
  amenities: [],
  loading: false,
  error: null,
};

export const fetchAmenities = createAsyncThunk(
  'amenities/fetchPropertyAmenities',
  async (propertyId: number) => {
    const response = await propertyAmenitiesapi(propertyId);
    return response.data.data.map((item: any) => item.amenity);
  }
);

const amenitiesSlice = createSlice({
  name: 'propertyAmenities',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAmenities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAmenities.fulfilled, (state, action) => {
        state.loading = false;
        state.amenities = action.payload;
      })
      .addCase(fetchAmenities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch amenities';
      });
  },
});

export default amenitiesSlice.reducer;