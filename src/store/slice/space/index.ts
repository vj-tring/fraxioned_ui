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
      .addCase(fetchAllSpaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(
        createNewSpace.fulfilled,
        (state, action: PayloadAction<Space>) => {
          state.spaces.push(action.payload); // Add new space to the state
        }
      )
      .addCase(
        updateExistingSpace.fulfilled,
        (state, action: PayloadAction<Space>) => {
          const index = state.spaces.findIndex(
            (space) => space.id === action.payload.id
          );
          if (index !== -1) {
            state.spaces[index] = action.payload; // Update the space in the state
          }
        }
      )
      .addCase(
        deleteExistingSpace.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.spaces = state.spaces.filter(
            (space) => space.id !== action.payload
          ); // Remove the deleted space
        }
      );
  },
});

// Selector
export const selectSpaces = (state: RootState) => state.spaces.spaces;
export * from "./actions";
export default spaceSlice.reducer;
