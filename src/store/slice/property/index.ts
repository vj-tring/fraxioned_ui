import { createSlice } from '@reduxjs/toolkit';
import { PropertiesState } from '@/store/model/properties.types';
import { fetchProperties, fetchPropertyById, fetchPropertyDetailsById } from './action';

const initialState: PropertiesState = {
    properties: [],
    selectedProperty: null,
    selectedPropertyDetails: null,
    status: 'idle',
    error: null,
};

const propertiesSlice = createSlice({
    name: 'property',
    initialState,
    reducers: {
        resetPropertiesState: (state) => {
            state.status = 'idle';
            state.error = null;
        },
        clearSelectedProperty: (state) => {
            state.selectedProperty = null;
            state.selectedPropertyDetails = null;
        },
    },
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
            })
            .addCase(fetchPropertyDetailsById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPropertyDetailsById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.selectedPropertyDetails = action.payload;
            })
            .addCase(fetchPropertyDetailsById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch property details';
            });
    },
});

export const { resetPropertiesState, clearSelectedProperty } = propertiesSlice.actions;
export default propertiesSlice.reducer;