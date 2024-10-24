import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '@/api/axiosSetup';
import { CreatePropertyCodePayload, EditPropertyCodePayload } from '@/store/model/property-code';

export const fetchPropertyCodes = createAsyncThunk(
    'propertyCodes/fetchPropertyCodes',
    async () => {
        const response = await axiosInstance.get('/property-codes');
        return response.data.data;
    }
);

export const postPropertyCode = (payload: CreatePropertyCodePayload) =>
    axiosInstance.post(`/property-codes/property-code`, payload);

export const createPropertyCode = createAsyncThunk(
    'propertyCode/createPropertyCode',
    async (payload: CreatePropertyCodePayload) => {
        const response = await postPropertyCode(payload);
        return response.data;
    }
);

export const editPropertyCode = createAsyncThunk(
    'propertyCode/editPropertyCode',
    async (payload: EditPropertyCodePayload) => {
        const response = await axiosInstance.patch(`/property-codes/property-code/${payload.id}`, {
            property: { id: payload.property.id },
            propertyCodeCategory: { id: payload.propertyCodeCategory.id },
            updatedBy: { id: payload.updatedBy.id },
            propertyCode: payload.propertyCode
        });
        return response.data;
    }
);

export const deletePropertyCode = createAsyncThunk(
    'propertyCode/deletePropertyCode',
    async (id: number) => {
        await axiosInstance.delete(`/property-codes/property-code/${id}`);
        return id;
    }
);
