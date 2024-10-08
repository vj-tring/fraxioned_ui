import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosSetup';
import { addPropertyApi } from '@/api';

export interface Property {
    id: number;
    ownerRezPropId: number;
    propertyName: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipcode: number;
    houseDescription: string;
    isExclusive: boolean;
    propertyShare: number;
    propertyRemainingShare: number;
    latitude: number;
    longitude: number;
    isActive: boolean;
    displayOrder: number;
}

interface PropertiesState {
    properties: Property[];
    selectedProperty: Property | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: PropertiesState = {
    properties: [],
    selectedProperty: null,
    status: 'idle',
    error: null,
};

export const fetchProperties = createAsyncThunk('properties/fetchProperties', async () => {
    const response = await axiosInstance.get('/v1/properties');
    return response.data;
});

export const getPropertyById = createAsyncThunk(
    'properties/getPropertyById',
    async (id: number) => {
        const response = await axiosInstance.get(`/v1/properties/property/${id}`);
        return response.data;
    }
);

export const addProperty = createAsyncThunk(
    'properties/addProperty',
    async (propertyData: {
        createdBy: { id: number };
        propertyName: string;
        ownerRezPropId: number;
        address: string;
        city: string;
        state: string;
        country: string;
        zipcode: number;
        houseDescription: string;
        isExclusive: boolean;
        propertyShare: number;
        latitude: number;
        longitude: number;
        isActive: boolean;
        displayOrder: number;
    }) => {
        const response = await addPropertyApi(propertyData);
        return response.data;
    }
);

const propertiesSlice = createSlice({
    name: 'property',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProperties.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProperties.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.properties = action.payload;
            })
            .addCase(fetchProperties.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch properties';
            })
            .addCase(getPropertyById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getPropertyById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.selectedProperty = action.payload;
            })
            .addCase(getPropertyById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch property';
            })
            .addCase(addProperty.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addProperty.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.properties.push(action.payload);
            })
            .addCase(addProperty.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to add property';
            });
    },
});

export default propertiesSlice.reducer;