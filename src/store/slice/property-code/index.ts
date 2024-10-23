import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PropertyCode, PropertyCodesState } from '@/store/model/property-code';
import { fetchPropertyCodes, createPropertyCode, editPropertyCode, deletePropertyCode } from './action';

const initialPropertyCodesState: PropertyCodesState = {
    propertyCodes: [],
    status: 'idle',
    error: null,
};

const propertyCodesSlice = createSlice({
    name: 'propertyCodes',
    initialState: initialPropertyCodesState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPropertyCodes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPropertyCodes.fulfilled, (state, action: PayloadAction<PropertyCode[]>) => {
                state.status = 'succeeded';
                state.propertyCodes = action.payload;
            })
            .addCase(fetchPropertyCodes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch property codes';
            })
            .addCase(createPropertyCode.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createPropertyCode.fulfilled, (state, action: PayloadAction<PropertyCode>) => {
                state.status = 'succeeded';
                state.propertyCodes.push(action.payload);
            })
            .addCase(createPropertyCode.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to create property code';
            })
            .addCase(editPropertyCode.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(editPropertyCode.fulfilled, (state, action: PayloadAction<PropertyCode>) => {
                state.status = 'succeeded';
                const index = state.propertyCodes.findIndex(pc => pc.id === action.payload.id);
                if (index !== -1) {
                    state.propertyCodes[index] = action.payload;
                }
            })
            .addCase(editPropertyCode.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to edit property code';
            })
            .addCase(deletePropertyCode.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deletePropertyCode.fulfilled, (state, action: PayloadAction<number>) => {
                state.status = 'succeeded';
                state.propertyCodes = state.propertyCodes.filter(pc => pc.id !== action.payload);
            })
            .addCase(deletePropertyCode.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to delete property code';
            });
    },
});

export default propertyCodesSlice.reducer;