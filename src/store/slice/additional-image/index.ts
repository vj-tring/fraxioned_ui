import { createSlice } from "@reduxjs/toolkit";
import { uploadPropertyImages, fetchAdditionalImages } from "./action";
import { PropertyImagesState } from "@/store/model/additional-image";

const initialState: PropertyImagesState = {
    images: [],
    loading: false,
    error: null,
    success: false,
    additionalImages: [],
    fetchLoading: false,
    fetchError: null,
};

const propertyImagesSlice = createSlice({
    name: "propertyImages",
    initialState,
    reducers: {
        resetPropertyImagesState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
        clearPropertyImages: (state) => {
            state.images = [];
            state.additionalImages = [];
        },
        clearAdditionalImages: (state) => {
            state.additionalImages = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadPropertyImages.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(uploadPropertyImages.fulfilled, (state, action) => {
                state.loading = false;
                state.images = action.payload;
                state.success = true;
                state.error = null;
            })
            .addCase(uploadPropertyImages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.success = false;
            })
            .addCase(fetchAdditionalImages.pending, (state) => {
                state.fetchLoading = true;
                state.fetchError = null;
            })
            .addCase(fetchAdditionalImages.fulfilled, (state, action) => {
                state.fetchLoading = false;
                state.additionalImages = action.payload;
                state.fetchError = null;
            })
            .addCase(fetchAdditionalImages.rejected, (state, action) => {
                state.fetchLoading = false;
                state.fetchError = action.payload as string;
            });
    },
});

export const { resetPropertyImagesState, clearPropertyImages, clearAdditionalImages } = propertyImagesSlice.actions;
export default propertyImagesSlice.reducer;
