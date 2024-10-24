import { createAsyncThunk } from '@reduxjs/toolkit';

import { fetchAllRoomDetailsByPropertyId } from '@/store/services';

// Async Thunk to Fetch Property Space Details
export const fetchPropertyAllRooms = createAsyncThunk(
    'propertySpace/fetchPropertySpace',
    async (propertyId: number, { rejectWithValue }) => {
        try {
            const response = await fetchAllRoomDetailsByPropertyId(propertyId); // Adjust API call as necessary   
            return response.data.data;
        } catch (error) {
            return rejectWithValue('Failed to fetch property space details');
        }
    }
);