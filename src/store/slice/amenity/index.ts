import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AmenitiesState, Amenity } from "@/store/model";
import {
  fetchAmenities,
  createAmenity,
  updateAmenity,
  deleteAmenityAsync,
} from "./actions";

const initialState: AmenitiesState = {
  amenities: [],
  loading: true,
  status: "idle",
  error: null,
  success: false,
  deleteLoading: false,
  deleteError: null,
  deleteSuccess: false,
};

const amenitiesSlice = createSlice({
  name: "amenities",
  initialState,
  reducers: {
    resetAmenitiesState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.status = "idle";
      state.deleteLoading = false;
      state.deleteError = null;
      state.deleteSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAmenities.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(
        fetchAmenities.fulfilled,
        (state, action: PayloadAction<{ data: Amenity[] }>) => {
          state.loading = false;
          state.status = "succeeded";
          state.amenities = action.payload.data;
        }
      )
      .addCase(fetchAmenities.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch amenities";
      })
      .addCase(createAmenity.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createAmenity.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.amenities.push(action.payload.data);
      })
      .addCase(createAmenity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(updateAmenity.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        updateAmenity.fulfilled,
        (state, action: PayloadAction<{ data: Amenity }>) => {
          state.loading = false;
          state.error = null;
          state.success = true;
          const updatedAmenity = action.payload.data;
          // Find the index of the amenity to update based on its id
          const index = state.amenities.findIndex(
            (amenity) => amenity.id === updatedAmenity.id
          );
          if (index !== -1) {
            // Replace the old amenity with the updated one
            state.amenities[index] = updatedAmenity;
          }
        }
      )
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
        // state.amenities = state.amenities.filter((amenity) => {
        //   return amenity.id !== state.deleteSuccess;
        // });
      })
      .addCase(deleteAmenityAsync.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload as string;
        state.deleteSuccess = false;
      });
  },
});

export const { resetAmenitiesState } = amenitiesSlice.actions;
export * from "./actions";
export default amenitiesSlice.reducer;
