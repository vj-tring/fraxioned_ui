import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosSetup';

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
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: PropertiesState = {
    properties: [],
    status: 'idle',
    error: null,
};

export const fetchProperties = createAsyncThunk('properties/fetchProperties', async () => {
    const response = await axiosInstance.get('/v1/properties');
    return response.data;
});

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
            });
    },
});

export default propertiesSlice.reducer;