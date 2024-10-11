import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store/reducers';
import { createSpaceProperty, deleteSpaceProperty, getAllSpaceProperties, getAllSpacePropertiesById } from '@/api'; // Import your API functions

// Define the Space interface
export interface Space {
    id: number;
    name: string;
    isBedTypeAllowed: boolean;
    isBathroomTypeAllowed: boolean;
}

// Define the Property interface
export interface Property {
    id: number;
    propertyName: string;
}

// Define the CreatedBy interface
export interface CreatedBy {
    id: number;
}

// Define the SpaceProperty interface
export interface SpaceProperty {
    id: number;
    instanceNumber: number;
    createdAt: string;
    updatedAt: string;
    property: Property;
    space: Space;
    createdBy: CreatedBy;
    updatedBy: CreatedBy | null;
}

// Response structure for fetching all space properties
export interface SpacePropertyResponse {
    success: boolean;
    message: string;
    data: SpaceProperty[]; // An array of SpaceProperty
    statusCode: number;
}

// State interface for the slice
export interface SpacePropertyState {
    spaceProperties: SpaceProperty[];
    loading: boolean;
    error: string | null;
}

// Initial state for the slice
const initialState: SpacePropertyState = {
    spaceProperties: [],
    loading: false,
    error: null,
};

// Thunks
export const fetchAllSpaceProperties = createAsyncThunk<SpaceProperty[], void>(
    'spaceProperty/fetchAllSpaceProperties',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAllSpaceProperties();
            return response.data.data;
        } catch (error) {
            return rejectWithValue("Failed to fetch space properties");
        }
    }
);

export const fetchSpacePropertiesById = createAsyncThunk<SpaceProperty[], number>(
    'spaceProperty/fetchSpacePropertiesById',
    async (propertyId: number, { rejectWithValue }) => {
        try {
            const response = await getAllSpacePropertiesById(propertyId);
            return response.data.data;
        } catch (error) {
            return rejectWithValue("Failed to fetch space properties");
        }
    }
);


export const createNewSpaceProperty = createAsyncThunk<SpaceProperty, SpaceProperty>(
    'spaceProperty/createNewSpaceProperty',
    async (spacePropertyData, { rejectWithValue }) => {
        try {
            const response = await createSpaceProperty(spacePropertyData);
            return response.data; // Assuming the API returns the created SpaceProperty
        } catch (error) {
            return rejectWithValue("Failed to create space property");
        }
    }
);

export const deleteExistingSpaceProperty = createAsyncThunk<number, number>(
    'spaceProperty/deleteExistingSpaceProperty',
    async (propertyId, { rejectWithValue }) => {
        try {
            await deleteSpaceProperty(propertyId);
            return propertyId; // Return the deleted property ID
        } catch (error) {
            return rejectWithValue("Failed to delete space property");
        }
    }
);

// Slice
const spacePropertySlice = createSlice({
    name: 'spaceProperty',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllSpaceProperties.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllSpaceProperties.fulfilled, (state, action: PayloadAction<SpaceProperty[]>) => {
                state.spaceProperties = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchAllSpaceProperties.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchSpacePropertiesById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSpacePropertiesById.fulfilled, (state, action: PayloadAction<SpaceProperty[]>) => {
                state.spaceProperties = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchSpacePropertiesById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // .addCase(createNewSpaceProperty.fulfilled, (state, action: PayloadAction<SpaceProperty>) => {
            //     state.spaceProperties.push(action.payload);
            // })
            .addCase(deleteExistingSpaceProperty.fulfilled, (state, action: PayloadAction<number>) => {
                // Remove the deleted space property from the state
                state.spaceProperties = state.spaceProperties.filter(sp => sp.id !== action.payload);
            });
    },
});

// Selectors
export const selectSpaceProperties = (state: RootState) => state.spaceProperties.spaceProperties;

// Export the reducer
export default spacePropertySlice.reducer;
