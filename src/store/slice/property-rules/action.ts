import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '@/api/axiosSetup';
import { PropertyRules } from '@/store/model/property-rules';

export const fetchPropertyDetails = createAsyncThunk(
    'propertyRules/fetchDetails',
    async (id: number) => {
        const response = await axiosInstance.get(`/property-details/property-detail/${id}`);
        return response.data;
    }
);

export const updatePropertyRules = createAsyncThunk(
    'propertyRules/update',
    async ({ id, data }: { id: number; data: Omit<PropertyRules, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'> }) => {
        const response = await axiosInstance.patch(`/property-details/property-detail/${id}`, data);
        return response.data;
    }
);
