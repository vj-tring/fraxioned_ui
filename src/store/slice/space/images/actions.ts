import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllPropertySpaceImages,
  fetchPropertySpaceImagesByPropertyId,
  propertySpaceImageUpload,
  updatePropertySpaceImageById,
  deletePropertySpaceImageById,
  deleteMultiplePropertySpaceImages,
  fetchPropertyImagesByPropertySpaceIds,
} from "@/api/api-endpoints";

// Fetch All Space Property Images
export const fetchAllImages = createAsyncThunk(
  "spaceImage/fetchAllImages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchAllPropertySpaceImages();
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch property space images");
    }
  }
);

// Fetch Images by Property ID
export const fetchImagesByPropertyId = createAsyncThunk(
  "spaceImage/fetchImagesByPropertyId",
  async (propertyId: number, { rejectWithValue }) => {
    try {
      const response = await fetchPropertySpaceImagesByPropertyId(propertyId);
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch images for the property");
    }
  }
);

export const fetchImagesByPropertySpaceId = createAsyncThunk(
  "spaceImage/fetchImagesByPropertyId",
  async (propertyId: number, { rejectWithValue }) => {
    try {
      const response = await fetchPropertyImagesByPropertySpaceIds(propertyId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch images for the property");
    }
  }
);

// Upload New Property Space Images
export const uploadImages = createAsyncThunk(
  "spaceImage/uploadImages",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await propertySpaceImageUpload(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to upload images");
    }
  }
);

// Update Image Details and/or Image File
export const updateImageById = createAsyncThunk(
  "spaceImage/updateImageById",
  async (
    { imageId, formData }: { imageId: number; formData: FormData },
    { rejectWithValue }
  ) => {
    try {
      const response = await updatePropertySpaceImageById(imageId, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to update image");
    }
  }
);

// Delete a Single Space Image
export const deleteImageById = createAsyncThunk(
  "spaceImage/deleteImageById",
  async (id: number, { rejectWithValue }) => {
    try {
      await deletePropertySpaceImageById(id);
      return id;
    } catch (error) {
      return rejectWithValue("Failed to delete image");
    }
  }
);

// Delete Multiple Space Images
export const deleteImagesBatch = createAsyncThunk(
  "spaceImage/deleteImagesBatch",
  async (spaceImages: { ids: number[] }, { rejectWithValue }) => {
    try {
      await deleteMultiplePropertySpaceImages(spaceImages);
      return spaceImages.ids;
    } catch (error) {
      return rejectWithValue("Failed to delete images");
    }
  }
);
