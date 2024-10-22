import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createAddditionalImage, getAdditionalImageforProperty } from '@/api/api-endpoints';

interface PropertyImage {
    id?: number;
    description: string;
    displayOrder: number;
    property: {
        id: number;
    };
    createdBy: {
        id: number;
    };
}

interface PropertyImagesState {
    images: PropertyImage[];
    loading: boolean;
    error: string | null;
    success: boolean;
    additionalImages: PropertyImage[];
    fetchLoading: boolean;
    fetchError: string | null;
}

const initialState: PropertyImagesState = {
    images: [],
    loading: false,
    error: null,
    success: false,
    additionalImages: [],
    fetchLoading: false,
    fetchError: null,
};

export const uploadPropertyImages = createAsyncThunk(
    'propertyImages/upload',
    async (data: FormData, { rejectWithValue }) => {
        try {
            const response = await createAddditionalImage(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to upload images');
        }
    }
);

export const fetchAdditionalImages = createAsyncThunk(
    'propertyImages/fetchAdditional',
    async (propertyId: number, { rejectWithValue }) => {
        try {
            const response = await getAdditionalImageforProperty(propertyId);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch additional images');
        }
    }
);

const propertyImagesSlice = createSlice({
    name: 'propertyImages',
    initialState,
    reducers: {
        resetPropertyImagesState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
        clearPropertyImages: (state) => {
            state.images = [];
            state.additionalImages = [];
        },
        clearAdditionalImages: (state) => {
            state.additionalImages = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadPropertyImages.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(uploadPropertyImages.fulfilled, (state, action) => {
                state.loading = false;
                state.images = action.payload;
                state.success = true;
                state.error = null;
            })
            .addCase(uploadPropertyImages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.success = false;
            })
            .addCase(fetchAdditionalImages.pending, (state) => {
                state.fetchLoading = true;
                state.fetchError = null;
            })
            .addCase(fetchAdditionalImages.fulfilled, (state, action) => {
                state.fetchLoading = false;
                state.additionalImages = action.payload;
                state.fetchError = null;
            })
            .addCase(fetchAdditionalImages.rejected, (state, action) => {
                state.fetchLoading = false;
                state.fetchError = action.payload as string;
            });
    },
});

export const { 
    resetPropertyImagesState, 
    clearPropertyImages, 
    clearAdditionalImages 
} = propertyImagesSlice.actions;

export default propertyImagesSlice.reducer;