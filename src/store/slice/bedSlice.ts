import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '@/api/api-endpoints/space-type-endpoints';
import { 
  CreatePropertySpaceBedDto, 
  UpdatePropertySpaceBedDto, 
  CreateOrDeletePropertySpaceBedsDto,
  CreateSpaceBedTypeDto,
  UpdateSpaceBedTypeDto
} from '@/store/model/space-types';

interface BedState {
  propertySpaceBeds: any[];
  spaceBedTypes: any[];
  loading: boolean;
  error: string | null;
}

const initialState: BedState = {
  propertySpaceBeds: [],
  spaceBedTypes: [],
  loading: false,
  error: null,
};

export const fetchAllPropertySpaceBeds = createAsyncThunk(
  'bed/fetchAllPropertySpaceBeds',
  async () => {
    const response = await api.getAllPropertySpaceBeds();
    return response.data.data;
  }
);

export const createPropertySpaceBed = createAsyncThunk(
  'bed/createPropertySpaceBed',
  async (data: CreatePropertySpaceBedDto) => {
    const response = await api.createPropertySpaceBed(data);
    return response.data.data;
  }
);

export const updatePropertySpaceBed = createAsyncThunk(
  'bed/updatePropertySpaceBed',
  async ({ id, data }: { id: number; data: UpdatePropertySpaceBedDto }) => {
    const response = await api.updatePropertySpaceBedDetail(id, data);
    return response.data.data;
  }
);

export const deletePropertySpaceBed = createAsyncThunk(
  'bed/deletePropertySpaceBed',
  async (id: number) => {
    await api.deletePropertySpaceBed(id);
    return id;
  }
);

export const createOrDeletePropertySpaceBeds = createAsyncThunk(
  'bed/createOrDeletePropertySpaceBeds',
  async (data: CreateOrDeletePropertySpaceBedsDto) => {
    const response = await api.createOrDeletePropertySpaceBeds(data);
    return response.data.data;
  }
);

export const fetchAllSpaceBedTypes = createAsyncThunk(
  'bed/fetchAllSpaceBedTypes',
  async () => {
    const response = await api.getAllSpaceBedTypes();
    return response.data.data;
  }
);

export const createSpaceBedType = createAsyncThunk(
  'bed/createSpaceBedType',
  async ({ data, imageFile }: { data: CreateSpaceBedTypeDto; imageFile: File }) => {
    const response = await api.createSpaceBedType(data, imageFile);
    return response.data.data;
  }
);

export const updateSpaceBedType = createAsyncThunk(
  'bed/updateSpaceBedType',
  async ({ id, data, imageFile }: { id: number; data: UpdateSpaceBedTypeDto; imageFile?: File }) => {
    const response = await api.updateSpaceBedTypeDetail(id, data, imageFile);
    return response.data.data;
  }
);

export const deleteSpaceBedType = createAsyncThunk(
  'bed/deleteSpaceBedType',
  async (id: number) => {
    await api.deleteSpaceBedType(id);
    return id;
  }
);

const bedSlice = createSlice({
  name: 'bed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPropertySpaceBeds.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllPropertySpaceBeds.fulfilled, (state, action) => {
        state.loading = false;
        state.propertySpaceBeds = action.payload;
      })
      .addCase(fetchAllPropertySpaceBeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(createPropertySpaceBed.fulfilled, (state, action) => {
        state.propertySpaceBeds.push(action.payload);
      })
      .addCase(updatePropertySpaceBed.fulfilled, (state, action) => {
        const index = state.propertySpaceBeds.findIndex(bed => bed.id === action.payload.id);
        if (index !== -1) {
          state.propertySpaceBeds[index] = action.payload;
        }
      })
      .addCase(deletePropertySpaceBed.fulfilled, (state, action) => {
        state.propertySpaceBeds = state.propertySpaceBeds.filter(bed => bed.id !== action.payload);
      })
      .addCase(createOrDeletePropertySpaceBeds.fulfilled, (state, action) => {
        state.propertySpaceBeds = action.payload;
      })
      .addCase(fetchAllSpaceBedTypes.fulfilled, (state, action) => {
        state.spaceBedTypes = action.payload;
      })
      .addCase(createSpaceBedType.fulfilled, (state, action) => {
        state.spaceBedTypes.push(action.payload);
      })
      .addCase(updateSpaceBedType.fulfilled, (state, action) => {
        const index = state.spaceBedTypes.findIndex(type => type.id === action.payload.id);
        if (index !== -1) {
          state.spaceBedTypes[index] = action.payload;
        }
      })
      .addCase(deleteSpaceBedType.fulfilled, (state, action) => {
        state.spaceBedTypes = state.spaceBedTypes.filter(type => type.id !== action.payload);
      });
  },
});

export default bedSlice.reducer;