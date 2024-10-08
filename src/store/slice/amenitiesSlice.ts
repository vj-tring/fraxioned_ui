import { propertyAmenitiesapi } from '@/api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface AmenityGroup {
  id: number;
  name: string;
}

export interface Amenity {
  id: number;
  amenityName: string;
  amenityDescription: string;
  amenityGroup: AmenityGroup;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyAmenity {
  id: number;
  property: { id: number };
  amenity: Amenity;
  createdAt: string;
  updatedAt: string;
  createdBy: { id: number };
  updatedBy: { id: number };
}

export interface AmenitiesState {
  status: any;
  amenities: any;
  propertyAmenities: PropertyAmenity[];
  loading: boolean;
  error: string | null;
}

const initialState: AmenitiesState = {
  propertyAmenities: [],
  loading: false,
  error: null,
  status: undefined,
  amenities: undefined
};

export const fetchAmenities = createAsyncThunk(
  'amenities/fetchPropertyAmenities',
  async (propertyId: number) => {
    const response = await propertyAmenitiesapi(propertyId);
    return response.data.data;
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
        state.propertyAmenities = action.payload;
      })
      .addCase(fetchAmenities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch amenities';
      });
  },
});

export default amenitiesSlice.reducer;