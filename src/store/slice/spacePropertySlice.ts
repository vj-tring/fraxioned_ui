import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store/reducers';
import { createSpaceProperty, deleteSpaceProperty, getAllSpaceProperties, getAllSpacePropertiesById } from '@/api/api-endpoints'; // Import your API functions

export interface Space {
    id: number;
    name: string;
    isBedTypeAllowed: boolean;
    isBathroomTypeAllowed: boolean;
}

export interface Property {
    id: number;
    propertyName: string;
}

export interface CreatedBy {
    id: number;
}

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

export interface SpacePropertyResponse {
    success: boolean;
    message: string;
    data: SpaceProperty[];
    statusCode: number;
}

export interface SpacePropertyState {
    spaceProperties: SpaceProperty[];
    loading: boolean;
    error: string | null;
}

const initialState: SpacePropertyState = {
    spaceProperties: [],
    loading: false,
    error: null,
};

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
            // console.log("space proerpyty",response.data.data);

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
            return response.data;
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
            return propertyId;
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
                state.spaceProperties = state.spaceProperties.filter(sp => sp.id !== action.payload);
            });
    },
});

export const selectSpaceProperties = (state: RootState) => state.spaceProperties.spaceProperties;

export default spacePropertySlice.reducer;
