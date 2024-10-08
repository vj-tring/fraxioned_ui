import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { addHolidayApi } from '@/api';

interface Holiday {
    id: number;
    name: string;
    year: number;
    startDate: string;
    endDate: string;
    createdBy: {
        id: number;
    };
    properties: { id: number }[];
}

interface HolidayState {
    holidays: Holiday[];
    loading: boolean;
    error: string | null;
}

const initialState: HolidayState = {
    holidays: [],
    loading: false,
    error: null,
};

export const addHoliday = createAsyncThunk(
    'holiday/addHoliday',
    async (holidayData: Omit<Holiday, 'id'>, { rejectWithValue }) => {
        try {
            const response = await addHolidayApi(holidayData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

const holidaySlice = createSlice({
    name: 'holiday',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addHoliday.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addHoliday.fulfilled, (state, action: PayloadAction<Holiday>) => {
                state.loading = false;
                state.holidays.push(action.payload);
            })
            .addCase(addHoliday.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default holidaySlice.reducer;