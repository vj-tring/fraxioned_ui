import { createAsyncThunk } from "@reduxjs/toolkit";
import { addamenitygroup, getamenitygroup } from '@/api';

export const fetchAmenityGroups = createAsyncThunk(
    'amenityGroups/fetchAmenityGroups',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getamenitygroup();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch amenity groups');
        }
    }
);

export const addAmenityGroup = createAsyncThunk(
    'amenityGroups/addAmenityGroup',
    async (data: { createdBy: { id: number }; name: string }, { rejectWithValue }) => {
        try {
            const response = await addamenitygroup(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add amenity group');
        }
    }
);
