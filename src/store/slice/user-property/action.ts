import { createAsyncThunk } from '@reduxjs/toolkit';
import { getuserbyproperty } from '@/api/api-endpoints';

export const fetchUserPropertyDetails = createAsyncThunk(
    'userProperties/fetchUserPropertyDetails',
    async (id: number) => {
        const response = await getuserbyproperty(id);
        return response.data;
    }
);


