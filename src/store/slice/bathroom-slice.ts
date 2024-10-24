import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '@/api/api-endpoints/space-type-endpoints';
import {
  CreatePropertySpaceBathroomDto,
  CreateOrDeletePropertySpaceBathroomsDto,
  CreateSpaceBathroomTypesDto,
  UpdateSpaceBathroomTypesDto,
  UpdatePropertySpaceBathroomDto
} from '@/store/model/space-types';

interface BathroomState {
  propertySpaceBathrooms: any[];
  spaceBathroomTypes: any[];
  loading: boolean;
  error: string | null;
}

const initialState: BathroomState = {
  propertySpaceBathrooms: [],
  spaceBathroomTypes: [],
  loading: false,
  error: null,
};

export const fetchAllPropertySpaceBathrooms = createAsyncThunk(
  'bathroom/fetchAllPropertySpaceBathrooms',
  async () => {
    const response = await api.getAllPropertySpaceBathroom();
    return response.data.data;
  }
);

export const fetchAllPropertySpaceBathroomsByPropertySpace = createAsyncThunk(
    'bathroom/fetchAllPropertySpaceBathroomsByPropertySpace',
    async (propertySpaceId: number) => {
      const response = await api.getAllPropertySpaceBathroomsByPropertySpace(propertySpaceId);
      return response.data.data;
    }
  );
  

export const createPropertySpaceBathroom = createAsyncThunk(
  'bathroom/createPropertySpaceBathroom',
  async (data: CreatePropertySpaceBathroomDto) => {
    const response = await api.createPropertySpaceBathroom(data);
    return response.data.data;
  }
);

export const updatePropertySpaceBathroom = createAsyncThunk(
  'bathroom/updatePropertySpaceBathroom',
  async ({ id, data }: { id: number; data: UpdatePropertySpaceBathroomDto }) => {
    const response = await api.updatePropertySpaceBathroomById(id, data);
    return response.data.data;
  }
);

export const deletePropertySpaceBathroom = createAsyncThunk(
  'bathroom/deletePropertySpaceBathroom',
  async (id: number) => {
    await api.deletePropertySpaceBathroomById(id);
    return id;
  }
);

export const createOrDeletePropertySpaceBathrooms = createAsyncThunk(
  'bathroom/createOrDeletePropertySpaceBathrooms',
  async (data: CreateOrDeletePropertySpaceBathroomsDto) => {
    const response = await api.createOrDeletePropertySpaceBathrooms(data);
    return response.data;
  }
);

export const fetchAllSpaceBathroomTypes = createAsyncThunk(
  'bathroom/fetchAllSpaceBathroomTypes',
  async () => {
    const response = await api.getAllSpaceBathroomTypes();
    return response.data.data;
  }
);

export const createSpaceBathroomType = createAsyncThunk(
  'bathroom/createSpaceBathroomType',
  async ({ data, imageFile }: { data: CreateSpaceBathroomTypesDto; imageFile: File }) => {
    const response = await api.createSpaceBathroomType(data, imageFile);
    return response.data.data;
  }
);

export const updateSpaceBathroomType = createAsyncThunk(
  'bathroom/updateSpaceBathroomType',
  async ({ id, data, imageFile }: { id: number; data: UpdateSpaceBathroomTypesDto; imageFile?: File }) => {
    const response = await api.updateSpaceBathroomTypeById(id, data, imageFile);
    return response.data.data;
  }
);

export const deleteSpaceBathroomType = createAsyncThunk(
  'bathroom/deleteSpaceBathroomType',
  async (id: number) => {
    await api.deleteSpaceBathroomTypeById(id);
    return id;
  }
);

const bathroomSlice = createSlice({
  name: 'bathroom',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPropertySpaceBathrooms.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllPropertySpaceBathrooms.fulfilled, (state, action) => {
        state.loading = false;
        state.propertySpaceBathrooms = action.payload;
      })
      .addCase(fetchAllPropertySpaceBathrooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(fetchAllPropertySpaceBathroomsByPropertySpace.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllPropertySpaceBathroomsByPropertySpace.fulfilled, (state, action) => {
        state.loading = false;
        state.propertySpaceBathrooms = action.payload;
      })
      .addCase(fetchAllPropertySpaceBathroomsByPropertySpace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(createPropertySpaceBathroom.fulfilled, (state, action) => {
        state.propertySpaceBathrooms.push(action.payload);
      })
      .addCase(updatePropertySpaceBathroom.fulfilled, (state, action) => {
        const index = state.propertySpaceBathrooms.findIndex(bathroom => bathroom.id === action.payload.id);
        if (index !== -1) {
          state.propertySpaceBathrooms[index] = action.payload;
        }
      })
      .addCase(deletePropertySpaceBathroom.fulfilled, (state, action) => {
        state.propertySpaceBathrooms = state.propertySpaceBathrooms.filter(bathroom => bathroom.id !== action.payload);
      })
      .addCase(createOrDeletePropertySpaceBathrooms.fulfilled, (state, action) => {
        state.propertySpaceBathrooms = action.payload;
      })
      .addCase(fetchAllSpaceBathroomTypes.fulfilled, (state, action) => {
        state.spaceBathroomTypes = action.payload;
      })
      .addCase(createSpaceBathroomType.fulfilled, (state, action) => {
        state.spaceBathroomTypes.push(action.payload);
      })
      .addCase(updateSpaceBathroomType.fulfilled, (state, action) => {
        const index = state.spaceBathroomTypes.findIndex(type => type.id === action.payload.id);
        if (index !== -1) {
          state.spaceBathroomTypes[index] = action.payload;
        }
      })
      .addCase(deleteSpaceBathroomType.fulfilled, (state, action) => {
        state.spaceBathroomTypes = state.spaceBathroomTypes.filter(type => type.id !== action.payload);
      });
  },
});

export default bathroomSlice.reducer;