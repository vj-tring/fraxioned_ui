import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { amenitiesapi, propertyAmenitiesapi } from "@/api";

interface Amenity {
  id: number;
  amenityName: string;
  amenityDescription: string;
  amenityGroup: {
    id: number;
    name: string;
  };
}
export interface AmenitiesState {
  amenities: Amenity[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AmenitiesState = {
  amenities: [],
  status: "idle",
  error: null,
};

export const fetchAmenities = createAsyncThunk(
  "amenities/fetchAmenities",
  async (id: number) => {
    const response = await propertyAmenitiesapi(id);
    console.log("API Response:", response.data); // Log the response to verify structure
    return response.data; // Ensure this matches the structure you're using in your slice
  }
);

const amenitiesSlice = createSlice({
  name: "amenities",
  initialState,
  reducers: {
    resetAmenitiesState: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAmenities.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchAmenities.fulfilled,
        (state, action: PayloadAction<{ data: Amenity[] }>) => {
          state.status = "succeeded";
          state.amenities = action.payload.data;
        }
      )
      .addCase(fetchAmenities.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch amenities";
      });
  },
});

export const { resetAmenitiesState } = amenitiesSlice.actions;
export default amenitiesSlice.reducer;
