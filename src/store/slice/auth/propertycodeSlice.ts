import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { axiosInstance } from '@/api/axiosSetup';

interface PropertyCode {
    id: number;
    propertyCode: string;
    property: {
        id: number;
        propertyName: string;
    };
    propertyCodeCategory: {
        id: number;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
    createdBy: {
        id: number;
    };
    updatedBy: null | {
        id: number;
    };
}

interface PropertyCodesState {
    propertyCodes: PropertyCode[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialPropertyCodesState: PropertyCodesState = {
    propertyCodes: [],
    status: 'idle',
    error: null,
};

export const fetchPropertyCodes = createAsyncThunk(
    'propertyCodes/fetchPropertyCodes',
    async () => {
        const response = await axiosInstance.get('/property-codes');
        return response.data.data;
    }
);

export const postPropertyCode = createAsyncThunk(
    'propertyCodes/postPropertyCode',
    async (payload: {
        property: { id: number };
        propertyCodeCategory: { id: number; name: string };
        createdBy: { id: number };
        propertyCode: string;
    }) => {
        const response = await axiosInstance.post('/property-codes/property-code', payload);
        return response.data;
    }
);

const propertyCodesSlice = createSlice({
    name: 'propertyCodes',
    initialState: initialPropertyCodesState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPropertyCodes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPropertyCodes.fulfilled, (state, action: PayloadAction<PropertyCode[]>) => {
                state.status = 'succeeded';
                state.propertyCodes = action.payload;
            })
            .addCase(fetchPropertyCodes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch property codes';
            })
            .addCase(postPropertyCode.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(postPropertyCode.fulfilled, (state, action: PayloadAction<PropertyCode>) => {
                state.status = 'succeeded';
                state.propertyCodes.push(action.payload);
            })
            .addCase(postPropertyCode.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to post property code';
            });
    },
});

export const propertyCodesReducer = propertyCodesSlice.reducer;