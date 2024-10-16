import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllSpaceProperties, getAllSpacePropertiesById, createSpaceProperty, deleteSpaceProperty } from '@/api';
import { SpaceProperty } from "@/store/model";

// Thunks
export const fetchAllSpaceProperties = createAsyncThunk<SpaceProperty[], void>(
    'spaceProperty/fetchAllSpaceProperties',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAllSpaceProperties();
            return response.data.data;
        } catch (error) {
            return rejectWithValue("Failed to fetch space properties");
        }
    }
);

export const fetchSpacePropertiesById = createAsyncThunk<SpaceProperty[], number>(
    'spaceProperty/fetchSpacePropertiesById',
    async (propertyId: number, { rejectWithValue }) => {
        try {
            const response = await getAllSpacePropertiesById(propertyId);
            return response.data.data;
        } catch (error) {
            return rejectWithValue("Failed to fetch space properties");
        }
    }
);


export const createNewSpaceProperty = createAsyncThunk<SpaceProperty, SpaceProperty>(
    'spaceProperty/createNewSpaceProperty',
    async (spacePropertyData, { rejectWithValue }) => {
        try {
            const response = await createSpaceProperty(spacePropertyData);
            return response.data; // Assuming the API returns the created SpaceProperty
        } catch (error) {
            return rejectWithValue("Failed to create space property");
        }
    }
);

export const deleteExistingSpaceProperty = createAsyncThunk<number, number>(
    'spaceProperty/deleteExistingSpaceProperty',
    async (propertyId, { rejectWithValue }) => {
        try {
            await deleteSpaceProperty(propertyId);
            return propertyId; // Return the deleted property ID
        } catch (error) {
            return rejectWithValue("Failed to delete space property");
        }
    }
);