import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { propertywithDetails } from "../../../api/api-endpoints/index";
import { RootState } from "@/store/reducers";

export interface LimitsState {
  limits: {
    noOfGuestsAllowed: number;
    noOfPetsAllowed: number;
  };
  counts: {
    Adults: number;
    Children: number;
    Pets: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: LimitsState = {
  limits: {
    noOfGuestsAllowed: 0,
    noOfPetsAllowed: 0,
  },
  counts: {
    Adults: 1,
    Children: 0,
    Pets: 0,
  },
  loading: false,
  error: null,
};

export const fetchLimits = createAsyncThunk(
  "limits/fetchLimits",
  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await propertywithDetails();
      const { selectedPropertyId } = (getState() as RootState).properties;

      if (Array.isArray(response.data) && response.data.length > 0) {
        const propertySelect = response.data;
        const selectedProperty = propertySelect.find(
          (prop) => prop.propertyId === selectedPropertyId
        );

        if (selectedProperty) {
          return {
            noOfGuestsAllowed: selectedProperty.noOfGuestsAllowed,
            noOfPetsAllowed: selectedProperty.noOfPetsAllowed,
          };
        } else {
          return rejectWithValue("Property ID not found");
        }
      } else {
        return rejectWithValue("Invalid response data");
      }
    } catch (error) {
      return rejectWithValue("Failed to fetch limits");
    }
  }
);
const limitsSlice = createSlice({
  name: "limits",
  initialState,
  reducers: {
    resetLimits: (state) => {
      state.limits = initialState.limits;
      state.counts = initialState.counts;
      state.loading = false;
      state.error = null;
    },
    updateCount: (
      state,
      action: { type: string; payload: { name: string; count: number } }
    ) => {
      state.counts[action.payload.name] = action.payload.count;
    },
    initializeCounts: (
      state,
      action: PayloadAction<{ Adults: number; Children: number; Pets: number }>
    ) => {
      state.counts = action.payload;
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

export const { resetLimits, updateCount, initializeCounts } =
  limitsSlice.actions;

export default limitsSlice.reducer;
