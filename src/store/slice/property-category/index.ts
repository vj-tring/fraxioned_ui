import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PropertyCodeCategoriesState, PropertyCodeCategory, CreatePropertyCodeCategoryResponse } from '@/store/model/property-category';
import { fetchPropertyCodeCategories, createPropertyCodeCategory } from './action';

const initialPropertyCodeCategoriesState: PropertyCodeCategoriesState = {
    propertyCodeCategories: [],
    status: 'idle',
    error: null,
};

const propertyCodeCategoriesSlice = createSlice({
    name: 'propertyCodeCategories',
    initialState: initialPropertyCodeCategoriesState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPropertyCodeCategories.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPropertyCodeCategories.fulfilled, (state, action: PayloadAction<PropertyCodeCategory[]>) => {
                state.status = 'succeeded';
                state.propertyCodeCategories = action.payload;
            })
            .addCase(fetchPropertyCodeCategories.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch property code categories';
            })
            .addCase(createPropertyCodeCategory.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createPropertyCodeCategory.fulfilled, (state, action: PayloadAction<CreatePropertyCodeCategoryResponse>) => {
                state.status = 'succeeded';
                state.propertyCodeCategories.push({
                    id: state.propertyCodeCategories.length + 1,
                    name: action.payload.name,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    createdBy: action.payload.createdBy,
                    updatedBy: null,
                });
            })
            .addCase(createPropertyCodeCategory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to create property code category';
            });
    },
});

export default propertyCodeCategoriesSlice.reducer;