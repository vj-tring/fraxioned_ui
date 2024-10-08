import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {axiosInstance} from '@/api/axiosSetup';

interface AmenityType {
    id: number;
}

interface PropertyAmenity {
    id: number;
    property: {
        id: number;
    };
    amenity: {
        id: number;
        amenityName: string;
        amenityDescription: string | null;
        amenityGroup: {
            id: number;
            name: string;
        };
    };
    createdBy: {
        id: number;
    };
    updatedBy: {
        id: number;
    };
    createdAt: string;
    updatedAt: string;
}

export interface PropertyAmenitiesState {
    loading: boolean;
    error: string | null;
    success: boolean;
    amenities: PropertyAmenity[];
}

interface UpdateAmenityPayload {
    property: {
        id: number;
    };
    amenities: AmenityType[];
    updatedBy: {
        id: number;
    };
}

const initialState: PropertyAmenitiesState = {
    loading: false,
    error: null,
    success: false,
    amenities: [],
};

export const getAmenitiesById = createAsyncThunk(
    'propertyAmenities/getById',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/property-amenities/property/${id}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'An error occurred');
        }
    }
);

export const updatePropertyAmenities = createAsyncThunk(
    'propertyAmenities/update',
    async (updateData: UpdateAmenityPayload, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch('/property-amenities', updateData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'An error occurred');
        }
    }
);

const propertyAmenitiesSlice = createSlice({
    name: 'propertyAmenities',
    initialState,
    reducers: {
        resetPropertyAmenities: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
            state.amenities = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAmenitiesById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAmenitiesById.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.amenities = action.payload.data;
            })
            .addCase(getAmenitiesById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updatePropertyAmenities.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updatePropertyAmenities.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
                state.success = true;
            })
            .addCase(updatePropertyAmenities.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.success = false;
            });
    },
});

export const { resetPropertyAmenities } = propertyAmenitiesSlice.actions;
export default propertyAmenitiesSlice.reducer;