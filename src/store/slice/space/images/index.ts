import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchAllImages,
  deleteImageById,
  deleteImagesBatch,
  uploadImages,
  updateImageById,
  fetchImagesByPropertySpaceId,
} from "./actions";
import { RootState } from "@/store/reducers";
import { SpaceImage, SpaceImageState } from "@/store/model";

// Initial State
const initialState: SpaceImageState = {
  images: [],
  loading: false,
  error: null,
};

// Thunks for Async Actions

// Slice Definition
const spaceImageSlice = createSlice({
  name: "spaceImage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllImages.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchAllImages.fulfilled,
        (state, action: PayloadAction<SpaceImage[]>) => {
          state.images = action.payload;
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(fetchAllImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchImagesByPropertySpaceId.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchImagesByPropertySpaceId.fulfilled,
        (state, action: PayloadAction<SpaceImage[]>) => {
          state.images = action.payload;
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(fetchImagesByPropertySpaceId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(
        uploadImages.fulfilled,
        (state, action: PayloadAction<SpaceImage[]>) => {
          state.images.push(...action.payload);
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(
        updateImageById.fulfilled,
        (state, action: PayloadAction<SpaceImage>) => {
          const index = state.images.findIndex(
            (img) => img.id === action.payload.id
          );
          if (index !== -1) state.images[index] = action.payload;
        }
      )
      .addCase(
        deleteImageById.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.images = state.images.filter(
            (img) => img.id !== action.payload
          );
        }
      )
      .addCase(deleteImagesBatch.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        deleteImagesBatch.fulfilled,
        (state, action: PayloadAction<number[]>) => {
          state.images = state.images.filter(
            (img) => !action.payload.includes(img.id)
          );
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(deleteImagesBatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Selector to Get Images from State
export const selectSpaceImages = (state: RootState) => state.spaceImage.images;
export * from "./actions";
export default spaceImageSlice.reducer;
