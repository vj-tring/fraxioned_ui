import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { addPropertyApi } from '@/api/api-endpoints';

interface PropertyData {
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
}

interface PropertyState {
    properties: PropertyData[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: PropertyState = {
    properties: [],
    status: 'idle',
    error: null,
};

export const addProperty = createAsyncThunk(
    'property/addProperty',
    async (propertyData: PropertyData) => {
        const response = await addPropertyApi(propertyData);
        return response.data;
    }
);

const propertySlice = createSlice({
    name: 'property',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addProperty.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addProperty.fulfilled, (state, action: PayloadAction<PropertyData>) => {
                state.status = 'succeeded';
                state.properties.push(action.payload);
            })
            .addCase(addProperty.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to add property';
            });
    },
});

export default propertySlice.reducer;