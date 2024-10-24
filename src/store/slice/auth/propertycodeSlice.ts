import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { axiosInstance } from '../../axiosSetup';

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

interface CreatePropertyCodePayload {
    property: { id: number };
    propertyCodeCategory: { id: number };
    createdBy: { id: number };
    propertyCode: string;
}

interface EditPropertyCodePayload {
    id: number;
    property: { id: number };
    propertyCodeCategory: { id: number };
    updatedBy: { id: number };
    propertyCode: string;
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

export const postPropertyCode = (payload: CreatePropertyCodePayload) =>
    axiosInstance.post(`/property-codes/property-code`, payload);

export const createPropertyCode = createAsyncThunk(
    'propertyCode/createPropertyCode',
    async (payload: CreatePropertyCodePayload) => {
        const response = await postPropertyCode(payload);
        return response.data;
    }
);

export const editPropertyCode = createAsyncThunk(
    'propertyCode/editPropertyCode',
    async (payload: EditPropertyCodePayload) => {
        const response = await axiosInstance.patch(`/property-codes/property-code/${payload.id}`, {
            property: { id: payload.property.id },
            propertyCodeCategory: { id: payload.propertyCodeCategory.id },
            updatedBy: { id: payload.updatedBy.id },
            propertyCode: payload.propertyCode
        });
        return response.data;
    }
);

export const deletePropertyCode = createAsyncThunk(
    'propertyCode/deletePropertyCode',
    async (id: number) => {
        await axiosInstance.delete(`/property-codes/property-code/${id}`);
        return id;
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
            .addCase(createPropertyCode.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createPropertyCode.fulfilled, (state, action: PayloadAction<PropertyCode>) => {
                state.status = 'succeeded';
                state.propertyCodes.push(action.payload);
            })
            .addCase(createPropertyCode.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to create property code';
            })
            .addCase(editPropertyCode.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(editPropertyCode.fulfilled, (state, action: PayloadAction<PropertyCode>) => {
                state.status = 'succeeded';
                const index = state.propertyCodes.findIndex(pc => pc.id === action.payload.id);
                if (index !== -1) {
                    state.propertyCodes[index] = action.payload;
                }
            })
            .addCase(editPropertyCode.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to edit property code';
            })
            .addCase(deletePropertyCode.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deletePropertyCode.fulfilled, (state, action: PayloadAction<number>) => {
                state.status = 'succeeded';
                state.propertyCodes = state.propertyCodes.filter(pc => pc.id !== action.payload);
            })
            .addCase(deletePropertyCode.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to delete property code';
            });
    },
});

export const propertyCodesReducer = propertyCodesSlice.reducer;