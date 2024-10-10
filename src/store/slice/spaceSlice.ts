import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store/reducers';
import { getAllSpaces, createSpace, updateSpace, deleteSpace } from '@/api';

// Space interface updated to match your API structure
export interface Space {
    id?: number; // Optional for create and update
    name: string;
    s3_url?: string; // Added for fetched spaces
    isBedTypeAllowed: boolean;
    isBathroomTypeAllowed: boolean;
    createdAt?: string; // Optional for create
    updatedAt?: string; // Optional for create
    createdBy?: {
        id: number;
    };
    updatedBy?: {
        id: number;
    } | null;
}

export interface SpaceState {
    spaces: Space[];
    loading: boolean;
    error: string | null;
}

const initialState: SpaceState = {
    spaces: [],
    loading: false,
    error: null,
};

// Thunks
export const fetchAllSpaces = createAsyncThunk(
    'space/fetchAllSpaces',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAllSpaces();
            return response.data.data; // Ensure this matches your API response structure
        } catch (error) {
            return rejectWithValue("Failed to fetch spaces");
        }
    }
);

export const createNewSpace = createAsyncThunk(
    'space/createNewSpace',
    async (spaceData: FormData, { rejectWithValue }) => {
        try {
            const response = await createSpace(spaceData);
            return response.data; // Assuming the API returns the created space
        } catch (error) {
            return rejectWithValue("Failed to create space");
        }
    }
);

export const updateExistingSpace = createAsyncThunk(
    'space/updateExistingSpace',
    async ({ id, spaceData }: { id: number; spaceData: FormData }, { rejectWithValue }) => {
        try {
            const response = await updateSpace(id, spaceData); // Pass the formData directly here
            return response.data; // Return updated space
        } catch (error) {
            return rejectWithValue("Failed to update space");
        }
    }
);

export const deleteExistingSpace = createAsyncThunk(
    'space/deleteExistingSpace',
    async (id: number, { rejectWithValue }) => {
        try {
            await deleteSpace(id);
            return id; // Return the deleted space ID
        } catch (error) {
            return rejectWithValue("Failed to delete space");
        }
    }
);

// Slice
const spaceSlice = createSlice({
    name: 'space',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllSpaces.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllSpaces.fulfilled, (state, action: PayloadAction<Space[]>) => {
                state.spaces = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchAllSpaces.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(createNewSpace.fulfilled, (state, action: PayloadAction<Space>) => {
                state.spaces.push(action.payload); // Add new space to the state
            })
            .addCase(updateExistingSpace.fulfilled, (state, action: PayloadAction<Space>) => {
                const index = state.spaces.findIndex(space => space.id === action.payload.id);
                if (index !== -1) {
                    state.spaces[index] = action.payload; // Update the space in the state
                }
            })
            .addCase(deleteExistingSpace.fulfilled, (state, action: PayloadAction<number>) => {
                state.spaces = state.spaces.filter(space => space.id !== action.payload); // Remove the deleted space
            });
    },
});

// Selector
export const selectSpaces = (state: RootState) => state.spaces.spaces;

export default spaceSlice.reducer;
