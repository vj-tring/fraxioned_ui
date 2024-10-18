import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store/reducers";
import { Space, SpaceState } from "@/store/model";
import {
  fetchAllSpaces,
  createNewSpace,
  updateExistingSpace,
  deleteExistingSpace,
} from "./actions";
// Space interface updated to match your API structure

const initialState: SpaceState = {
  spaces: [],
  loading: false,
  error: null,
};

// Slice
const spaceSlice = createSlice({
  name: "space",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSpaces.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchAllSpaces.fulfilled,
        (state, action: PayloadAction<Space[]>) => {
          state.spaces = action.payload;
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(fetchAllSpaces.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch spaces";
      })
      .addCase(createNewSpace.fulfilled, (state, action) => {
        if (action.payload.statusCode === 201) {
          state.spaces.push(action.payload.data); // Add new space
          state.error = null;
        } else if (action.payload.statusCode === 409) {
          state.error = action.payload.message; // Conflict error message
        }
      })
      .addCase(createNewSpace.rejected, (state) => {
        state.error = "Failed to create space"; // Generic error
      })
      .addCase(updateExistingSpace.fulfilled, (state, action) => {
        if (action.payload.statusCode === 200) {
          const index = state.spaces.findIndex(
            (space) => space.id === action.payload.data.id
          );
          if (index !== -1) {
            state.spaces[index] = action.payload.data; // Update space
          }
          state.error = null;
        } else if (action.payload.statusCode === 409) {
          state.error = action.payload.message; // Conflict error message
        }
      })
      .addCase(updateExistingSpace.rejected, (state) => {
        state.error = "Failed to update space"; // Generic error
      })
      .addCase(
        deleteExistingSpace.fulfilled,
        (
          state,
          action: PayloadAction<{
            statusCode: number;
            spaceId?: number;
            message?: string;
          }>
        ) => {
          const { statusCode, spaceId, message } = action.payload;

          if (statusCode === 204 && spaceId !== undefined) {
            // Successfully deleted, remove the space
            state.spaces = state.spaces.filter((space) => space.id !== spaceId);
            state.error = null;
          } else if (statusCode === 409) {
            // Conflict error
            state.error = message || "Conflict occurred while deleting space";
          } else if (statusCode === 500) {
            // Unexpected error
            state.error = message || "An unexpected error occurred";
          }
        }
      );
  },
});

// Selector
export const selectSpaces = (state: RootState) => state.spaces.spaces;
export * from "./actions";
export default spaceSlice.reducer;
