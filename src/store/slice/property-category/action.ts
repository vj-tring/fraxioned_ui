import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '@/api/axiosSetup';
import { CreatePropertyCodeCategoryPayload } from '@/store/model/property-category';

export const fetchPropertyCodeCategories = createAsyncThunk(
    'propertyCodeCategories/fetchPropertyCodeCategories',
    async () => {
        const response = await axiosInstance.get('/property-code-categories');
        return response.data.data;
    }
);

export const createPropertyCodeCategory = createAsyncThunk(
    'propertyCodeCategories/createPropertyCodeCategory',
    async (payload: CreatePropertyCodeCategoryPayload) => {
        const response = await axiosInstance.post('/property-code-categories', payload);
        return response.data;
    }
);
