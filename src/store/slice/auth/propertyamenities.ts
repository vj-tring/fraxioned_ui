import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAmenitiesByPropertyId, getAmenitiesByPropertySpaceId, updateamenityforproperty } from '@/api/api-endpoints';

interface AmenityType {
    id: number;
}

interface PropertyAmenity {
    id: number;
    property: {
        id: number;
    };
    propertySpace: {
        id: null;
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

export interface UpdateAmenityPayload {
    property: {
        id: number;
    };
    propertySpace: {
        id: null;
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

export const getByPropertyId = createAsyncThunk(
    'propertyAmenities/getById',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await getAmenitiesByPropertyId(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'An error occurred');
        }
    }
);

export const getByPropertySpaceId = createAsyncThunk(
    'propertySpaceAmenities/getById',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await getAmenitiesByPropertySpaceId(id);
            if (response?.data?.data) {
                return response.data.data;
            }
            return [];
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'An error occurred');
        }
    }
);

export const updatePropertyAmenities = createAsyncThunk(
    'propertyAmenities/update',
    async (updateData: UpdateAmenityPayload, { rejectWithValue }) => {
        try {
            const response = await updateamenityforproperty(updateData);
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
            .addCase(getByPropertyId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getByPropertyId.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.amenities = action.payload.data.amenityGroup;
            })
            .addCase(getByPropertyId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getByPropertySpaceId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getByPropertySpaceId.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                // Safely handle the payload with null checks
                const amenitiesData = Array.isArray(action.payload) ? action.payload : [];
                state.amenities = amenitiesData;
            })
            .addCase(getByPropertySpaceId.rejected, (state, action) => {
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