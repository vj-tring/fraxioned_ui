import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addamenitygroup, getamenitygroup } from '@/api/api-endpoints';

interface AmenityGroup {
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

export interface AmenityGroupState {
    loading: boolean;
    error: string | null;
    success: boolean;
    data: AmenityGroup[] | null;
    addLoading: boolean;
    addError: string | null;
    addSuccess: boolean;
}

const initialState: AmenityGroupState = {
    loading: false,
    error: null,
    success: false,
    data: null,
    addLoading: false,
    addError: null,
    addSuccess: false,
};

export const fetchAmenityGroups = createAsyncThunk(
    'amenityGroups/fetchAmenityGroups',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getamenitygroup();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch amenity groups');
        }
    }
);

export const addAmenityGroup = createAsyncThunk(
    'amenityGroups/addAmenityGroup',
    async (data: { createdBy: { id: number }; name: string }, { rejectWithValue }) => {
        try {
            const response = await addamenitygroup(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add amenity group');
        }
    }
);

const amenityGroupsSlice = createSlice({
    name: 'amenityGroups',
    initialState,
    reducers: {
        resetAmenityGroupState: (state) => {
            state.addLoading = false;
            state.addError = null;
            state.addSuccess = false;
        },
        resetFetchState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Add Amenity Group cases
            .addCase(addAmenityGroup.pending, (state) => {
                state.addLoading = true;
                state.addError = null;
            })
            .addCase(addAmenityGroup.fulfilled, (state, action) => {
                state.addLoading = false;
                state.addSuccess = true;
                if (state.data) {
                    state.data.push(action.payload.data);
                }
            })
            .addCase(addAmenityGroup.rejected, (state, action) => {
                state.addLoading = false;
                state.addError = action.payload as string;
            })
            // Fetch Amenity Groups cases
            .addCase(fetchAmenityGroups.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAmenityGroups.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.data = action.payload.data;
            })
            .addCase(fetchAmenityGroups.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetAmenityGroupState, resetFetchState } = amenityGroupsSlice.actions;
export default amenityGroupsSlice.reducer;
