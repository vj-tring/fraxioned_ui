import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAmenitiesByPropertyId } from '@/api';

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
  propertyAmenities: PropertyAmenity[];
  loading: boolean;
  error: string | null;
}

const initialState: AmenitiesState = {
  propertyAmenities: [],
  loading: false,
  error: null,
};

export const fetchAmenities = createAsyncThunk(
  'amenities/fetchPropertyAmenities',
  async (propertyId: number) => {
    const response = await getAmenitiesByPropertyId(propertyId);
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
        console.log("Updated propertyAmenities:", state.propertyAmenities); 
      })
      .addCase(fetchAmenities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch amenities';
      });
  },
});

export default amenitiesSlice.reducer;
