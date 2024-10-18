import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store/reducers";
import {
  fetchAllSpaceProperties,
  fetchSpacePropertiesById,
  deleteExistingSpaceProperty,
} from "./actions";
import { SpacePropertyState, SpaceProperty } from "@/store/model";

// Initial state for the slice
const initialState: SpacePropertyState = {
  spaceProperties: [],
  loading: false,
  error: null,
};

// Slice
const spacePropertySlice = createSlice({
  name: "spaceProperty",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSpaceProperties.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchAllSpaceProperties.fulfilled,
        (state, action: PayloadAction<SpaceProperty[]>) => {
          state.spaceProperties = action.payload;
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(fetchAllSpaceProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSpacePropertiesById.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchSpacePropertiesById.fulfilled,
        (state, action: PayloadAction<SpaceProperty[]>) => {
          state.spaceProperties = action.payload;
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(fetchSpacePropertiesById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // .addCase(createNewSpaceProperty.fulfilled, (state, action: PayloadAction<SpaceProperty>) => {
      //     state.spaceProperties.push(action.payload);
      // })
      .addCase(
        deleteExistingSpaceProperty.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.spaceProperties = state.spaceProperties.filter(
            (sp) => sp.id !== action.payload
          );
        }
      );
  },
});

export const selectSpaceProperties = (state: RootState) =>
  state.spaceProperties.spaceProperties;

export default spacePropertySlice.reducer;
