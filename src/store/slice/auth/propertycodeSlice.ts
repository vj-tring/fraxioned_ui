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


interface CreatePropertyCodePayload {
    property: { id: number };
    propertyCodeCategory: { id: number };
    createdBy: { id: number };
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
            });
    },
});

export const propertyCodesReducer = propertyCodesSlice.reducer;