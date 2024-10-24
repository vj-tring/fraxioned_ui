import { createSlice } from '@reduxjs/toolkit';
import { PropertyRulesState } from '@/store/model/property-rules';
import { fetchPropertyDetails, updatePropertyRules } from './action';

const initialState: PropertyRulesState = {
    data: null,
    loading: false,
    error: null,
};

const propertyRulesSlice = createSlice({
    name: 'propertyRules',
    initialState,
    reducers: {
        resetPropertyRules: (state) => {
            state.data = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPropertyDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPropertyDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchPropertyDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'An error occurred while fetching property details';
            })
            .addCase(updatePropertyRules.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePropertyRules.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(updatePropertyRules.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'An error occurred while updating property rules';
            });
    },
});

export const { resetPropertyRules } = propertyRulesSlice.actions;
export default propertyRulesSlice.reducer;