import { createSlice } from "@reduxjs/toolkit";
import { AmenityGroupState } from "@/store/model";
import { addAmenityGroup, fetchAmenityGroups } from "./actions";

const initialState: AmenityGroupState = {
  loading: false,
  error: null,
  success: false,
  data: null,
  addLoading: false,
  addError: null,
  addSuccess: false,
};

const amenityGroupsSlice = createSlice({
  name: "amenityGroups",
  initialState,
  reducers: {
    resetAmenityGroupState: (state) => {
      state.addLoading = false;
      state.addError = null;
      state.addSuccess = false;
    },
    resetFetchState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Amenity Group cases
      .addCase(addAmenityGroup.pending, (state) => {
        state.addLoading = true;
        state.addError = null;
      })
      .addCase(addAmenityGroup.fulfilled, (state, action) => {
        state.addLoading = false;
        state.addSuccess = true;
        if (state.data) {
          state.data.push(action.payload.data);
        }
      })
      .addCase(addAmenityGroup.rejected, (state, action) => {
        state.addLoading = false;
        state.addError = action.payload as string;
      })
      // Fetch Amenity Groups cases
      .addCase(fetchAmenityGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAmenityGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload.data;
      })
      .addCase(fetchAmenityGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetAmenityGroupState, resetFetchState } =
  amenityGroupsSlice.actions;
export * from "./actions";
export default amenityGroupsSlice.reducer;
