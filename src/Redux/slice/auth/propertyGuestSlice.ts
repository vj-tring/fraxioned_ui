import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define the mock limits
const mockLimits = {
  Adults: 4,
  Children: 10,
  Infants: 5,
  Pets: 2,
};

interface LimitsState {
  limits: { [key: string]: number } | null;
  loading: boolean;
  error: string | null;
}

const initialState: LimitsState = {
  limits: mockLimits, // Start with mock data
  loading: false,
  error: null,
};

export const fetchLimits = createAsyncThunk(
  'limits/fetchLimits',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://example.com/api/limits');
      if (!response.ok) throw new Error('API response error');
      const data = await response.json();
      if (typeof data !== 'object') throw new Error('Invalid data');
      return data;
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
      state.limits = mockLimits; // Reset to mock data
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
        state.error = null;
      })
      .addCase(fetchLimits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetLimits } = limitsSlice.actions;

export default limitsSlice.reducer;
