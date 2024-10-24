import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { axiosInstance } from '../../axiosSetup';

interface PropertyCodeCategory {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    createdBy: {
        id: number;
    };
    updatedBy: null | {
        id: number;
    };
}

interface CreatePropertyCodeCategoryPayload {
    name: string;
    createdBy: {
        id: number;  
    };
}

interface CreatePropertyCodeCategoryResponse {
    createdBy: {
        id: number;
    };
    name: string;
}

interface PropertyCodeCategoriesState {
    propertyCodeCategories: PropertyCodeCategory[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialPropertyCodeCategoriesState: PropertyCodeCategoriesState = {
    propertyCodeCategories: [],
    status: 'idle',
    error: null,
};

export const fetchPropertyCodeCategories = createAsyncThunk(
    'propertyCodeCategories/fetchPropertyCodeCategories',
    async () => {
        const response = await axiosInstance.get('/property-code-categories');
        return response.data.data;
    }
);

export const createPropertyCodeCategory = createAsyncThunk(
    'propertyCodeCategories/createPropertyCodeCategory',
    async (payload: CreatePropertyCodeCategoryPayload) => {
        const response = await axiosInstance.post('/property-code-categories', payload);
        return response.data;
    }
);

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

export const propertycodecatogoryReducer = propertyCodeCategoriesSlice.reducer;