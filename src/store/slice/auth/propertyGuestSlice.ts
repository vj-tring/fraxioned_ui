import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { propertywithDetails } from '../../../api/index';
import { RootState } from '@/store/reducers';

export interface LimitsState {
  limits: {
    noOfGuestsAllowed: number;
    noOfPetsAllowed: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: LimitsState = {
  limits: {
    noOfGuestsAllowed: 0,
    noOfPetsAllowed: 0,
  },
  loading: false,
  error: null,
};

export const fetchLimits = createAsyncThunk(
  'limits/fetchLimits',
  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await propertywithDetails();
      const { selectedPropertyId } = (getState() as RootState).properties;

      if (Array.isArray(response.data) && response.data.length > 0) {
        const propertySelect = response.data;
        const selectedProperty = propertySelect.find(prop => prop.propertyId === selectedPropertyId);

        if (selectedProperty) {
          return {
            noOfGuestsAllowed: selectedProperty.noOfGuestsAllowed,
            noOfPetsAllowed: selectedProperty.noOfPetsAllowed,
          };
        } else {
          return rejectWithValue('Property ID not found');
        }
      } else {
        return rejectWithValue('Invalid response data');
      }
    } catch (error) {
      return rejectWithValue('Failed to fetch limits');
    }
  }
);

const limitsSlice = createSlice({
  name: 'limits',
  initialState,
  reducers: {
    resetLimits: (state) => {
      state.limits = initialState.limits;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLimits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLimits.fulfilled, (state, action) => {
        state.limits = action.payload;
        state.loading = false;
      })
      .addCase(fetchLimits.rejected, (state, action) => {
        state.limits = initialState.limits;
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetLimits } = limitsSlice.actions;
export default limitsSlice.reducer;
