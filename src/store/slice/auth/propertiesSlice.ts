import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProperties, getPropertyById } from '@/api';

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

export interface PropertiesState {
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
    const response = await getProperties();
    return response.data;
});

export const fetchPropertyById = createAsyncThunk(
    'properties/fetchPropertyById',
    async (id: number) => {
        const response = await getPropertyById(id);
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
            .addCase(fetchPropertyById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPropertyById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.selectedProperty = action.payload;
            })
            .addCase(fetchPropertyById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch property';
            });
    },
});

export default propertiesSlice.reducer;