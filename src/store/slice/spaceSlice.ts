import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store/reducers';
import { getAllSpaces, createSpace, updateSpace, deleteSpace } from '@/api/api-endpoints';

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

// Create Space Thunk
export const createNewSpace = createAsyncThunk(
    'space/createNewSpace',
    async (spaceData: FormData) => {
        const response = await createSpace(spaceData);
        // Handle conflict by checking the statusCode in the response
        if (response.data.statusCode === 409) {
            return { statusCode: 409, message: response.data.message };
        }
        return { statusCode: 201, data: response.data.data }; // Success case
    }
);

export const updateExistingSpace = createAsyncThunk(
    'space/updateExistingSpace',
    async ({ id, spaceData }: { id: number; spaceData: FormData }) => {
        const response = await updateSpace(id, spaceData);
        if (response.data.statusCode === 409) {
            return { statusCode: 409, message: response.data.message };
        }
        return { statusCode: 200, data: response.data.data }; // Success case
    }
);


export const deleteExistingSpace = createAsyncThunk<
    { statusCode: number; spaceId?: number; message?: string }, // Success and conflict payload type
    number // Argument type (spaceId)
>(
    'space/deleteExistingSpace',
    async (spaceId) => {
        try {
            const response = await deleteSpace(spaceId);

            if (response.data.statusCode === 409) {
                // Conflict case
                return {
                    statusCode: 409,
                    message: response.data.message,
                };
            } else if (response.data.statusCode === 204) {
                // Success case: Space deleted
                return {
                    statusCode: 204,
                    spaceId,
                };
            }

            throw new Error("Unexpected response");
        } catch (error: any) {
            // Handle unexpected errors
            return {
                statusCode: 500,
                message: error.message || "An unexpected error occurred",
            };
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
            .addCase(fetchAllSpaces.rejected, (state) => {
                state.loading = false;
                state.error = "Failed to fetch spaces";
            })
            .addCase(createNewSpace.fulfilled, (state, action) => {
                if (action.payload.statusCode === 201) {
                    state.spaces.push(action.payload.data); // Add new space
                    state.error = null;
                } else if (action.payload.statusCode === 409) {
                    state.error = action.payload.message; // Conflict error message
                }
            })
            .addCase(createNewSpace.rejected, (state) => {
                state.error = "Failed to create space"; // Generic error
            })
            .addCase(updateExistingSpace.fulfilled, (state, action) => {
                if (action.payload.statusCode === 200) {
                    const index = state.spaces.findIndex(space => space.id === action.payload.data.id);
                    if (index !== -1) {
                        state.spaces[index] = action.payload.data; // Update space
                    }
                    state.error = null;
                } else if (action.payload.statusCode === 409) {
                    state.error = action.payload.message; // Conflict error message
                }
            })
            .addCase(updateExistingSpace.rejected, (state) => {
                state.error = "Failed to update space"; // Generic error
            })
            .addCase(
                deleteExistingSpace.fulfilled,
                (
                    state,
                    action: PayloadAction<{ statusCode: number; spaceId?: number; message?: string }>
                ) => {
                    const { statusCode, spaceId, message } = action.payload;

                    if (statusCode === 204 && spaceId !== undefined) {
                        // Successfully deleted, remove the space
                        state.spaces = state.spaces.filter(space => space.id !== spaceId);
                        state.error = null;
                    } else if (statusCode === 409) {
                        // Conflict error
                        state.error = message || "Conflict occurred while deleting space";
                    } else if (statusCode === 500) {
                        // Unexpected error
                        state.error = message || "An unexpected error occurred";
                    }
                }
            );

    },
});


// Selector
export const selectSpaces = (state: RootState) => state.spaces.spaces;

export default spaceSlice.reducer;
