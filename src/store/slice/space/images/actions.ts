import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchAllPropertySpaceImages,
  fetchPropertyImagesByPropertyId,
  fetchSpaceImageDetailsById,
  uploadPropertySpaceImages,
  updateSpaceImageById,
  deleteSpaceImageById,
  deleteMultipleSpaceImages,
  fetchPropertyImagesByPropertySpaceId,
} from "@/api";
import { RootState } from "@/store/reducers";

// Define Space Image Interface
export interface SpaceImage {
  id: number;
  description: string;
  url: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  propertySpace: {
    id: number;
    space: { id: number; name: string };
    property: { id: number; propertyName: string };
  };
  createdBy: { id: number };
  updatedBy: { id: number } | null;
}

// State Interface
interface SpaceImageState {
  images: SpaceImage[];
  loading: boolean;
  error: string | null;
}

// Initial State
const initialState: SpaceImageState = {
  images: [],
  loading: false,
  error: null,
};

// Thunks for Async Actions
    fetchAllPropertySpaceImages,
    fetchPropertyImagesByPropertyId,
    uploadPropertySpaceImages,
    updateSpaceImageById,
    deleteSpaceImageById,
    deleteMultipleSpaceImages
} from '@/api';

// Fetch All Space Property Images
export const fetchAllImages = createAsyncThunk(
  "spaceImage/fetchAllImages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchAllPropertySpaceImages();
      return response.data;
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
      const response = await fetchPropertyImagesByPropertyId(propertyId);
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
      const response = await fetchPropertyImagesByPropertySpaceId(propertyId);
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
      const response = await uploadPropertySpaceImages(formData);
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
      const response = await updateSpaceImageById(imageId, formData);
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
      await deleteSpaceImageById(id);
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
      await deleteMultipleSpaceImages(spaceImages);
      return spaceImages.ids;
    } catch (error) {
      return rejectWithValue("Failed to delete images");
    }
  }
);
