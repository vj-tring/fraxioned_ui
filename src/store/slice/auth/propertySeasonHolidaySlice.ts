import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getPropertySeasonHolidayByPropertyId } from "../../../api/api-endpoints/index";
import { RootState } from "@/store/reducers";

export interface Holiday {
  id: number;
  name: string;
  year: number;
  startDate: string;
  endDate: string;
}

export interface SeasonHoliday {
  id: number;
  isPeakSeason: boolean;
  property: {
    id: number;
  };
  holiday: Holiday;
}

export interface PropertySeasonHolidayState {
  seasonHolidays: SeasonHoliday[];
  loading: boolean;
  error: string | null;
}

const initialState: PropertySeasonHolidayState = {
  seasonHolidays: [],
  loading: false,
  error: null,
};

export const fetchPropertySeasonHoliday = createAsyncThunk(
  "propertySeasonHoliday/fetchPropertySeasonHoliday",
  async (propertyId: number, { rejectWithValue }) => {
    try {
      const response = await getPropertySeasonHolidayByPropertyId(propertyId);
      return response.data.data;
    } catch (error) {
      console.error("Fetching property season holiday failed:", error);
      return rejectWithValue("Failed to fetch property season holiday data");
    }
  }
);

const propertySeasonHolidaySlice = createSlice({
  name: "propertySeasonHoliday",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPropertySeasonHoliday.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchPropertySeasonHoliday.fulfilled,
        (state, action: PayloadAction<SeasonHoliday[]>) => {
          state.seasonHolidays = action.payload;
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(fetchPropertySeasonHoliday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectPropertySeasonHolidays = (state: RootState) =>
  state.propertySeasonHoliday.seasonHolidays;

export default propertySeasonHolidaySlice.reducer;
