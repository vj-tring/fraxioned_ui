import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllSpaces, createSpace, updateSpace, deleteSpace } from '@/api';

// Thunks
export const fetchAllSpaces = createAsyncThunk(
    'space/fetchAllSpaces',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAllSpaces();
            return response.data.data; // Ensure this matches your API response structure
        } catch (error) {
            return rejectWithValue("Failed to fetch spaces");
        }
    }
);

export const createNewSpace = createAsyncThunk(
    'space/createNewSpace',
    async (spaceData: FormData, { rejectWithValue }) => {
        try {
            const response = await createSpace(spaceData);
            return response.data; // Assuming the API returns the created space
        } catch (error) {
            return rejectWithValue("Failed to create space");
        }
    }
);

export const updateExistingSpace = createAsyncThunk(
    'space/updateExistingSpace',
    async ({ id, spaceData }: { id: number; spaceData: FormData }, { rejectWithValue }) => {
        try {
            const response = await updateSpace(id, spaceData); // Pass the formData directly here
            return response.data; // Return updated space
        } catch (error) {
            return rejectWithValue("Failed to update space");
        }
    }
);

export const deleteExistingSpace = createAsyncThunk(
    'space/deleteExistingSpace',
    async (id: number, { rejectWithValue }) => {
        try {
            await deleteSpace(id);
            return id; // Return the deleted space ID
        } catch (error) {
            return rejectWithValue("Failed to delete space");
        }
    }
);
