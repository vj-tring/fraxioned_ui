import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getPropertyDetailsbyId } from "@/store/services";
import { RootState } from "@/store/reducers";

export interface ThingsToKnowState {
  propertyDetails: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: ThingsToKnowState = {
  propertyDetails: null,
  loading: false,
  error: null,
};

export const fetchPropertyDetailsById = createAsyncThunk(
  "thingsToKnow/fetchPropertyDetailsById",
  async (propId: number, { rejectWithValue }) => {
    try {
      const response = await getPropertyDetailsbyId(propId);
      return response.data;
    } catch (error) {
      return rejectWithValue("Error fetching property details");
    }
  }
);

const ThingsToKnowSlice = createSlice({
  name: "thingsToKnow",
  initialState,
  reducers: {
    clearPropertyDetails: (state) => {
      state.propertyDetails = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPropertyDetailsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPropertyDetailsById.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.propertyDetails = action.payload;
          state.loading = false;
        }
      )
      .addCase(
        fetchPropertyDetailsById.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const selectPropertyDetails = (state: RootState) =>
  state.thingsToKnow.propertyDetails;
export const selectLoading = (state: RootState) => state.thingsToKnow.loading;
export const selectError = (state: RootState) => state.thingsToKnow.error;

export default ThingsToKnowSlice.reducer;
