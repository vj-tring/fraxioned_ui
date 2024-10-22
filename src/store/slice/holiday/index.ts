import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HolidayState, Holiday, FetchHolidayResponse } from '@/store/model/holiday.types';
import { fetchPropertyHoliday, addHoliday, updateHoliday } from './action';

const initialState: HolidayState = {
    holidays: [],
    selectedHoliday: null,
    loading: false,
    error: null,
};

const holidaySlice = createSlice({
    name: 'holiday',
    initialState,
    reducers: {
        clearSelectedHoliday: (state) => {
            state.selectedHoliday = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPropertyHoliday.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPropertyHoliday.fulfilled, (state, action: PayloadAction<FetchHolidayResponse>) => {
                state.loading = false;
                state.selectedHoliday = action.payload.data;
            })
            .addCase(fetchPropertyHoliday.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
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
            })
            .addCase(updateHoliday.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateHoliday.fulfilled, (state, action: PayloadAction<Holiday>) => {
                state.loading = false;
                const index = state.holidays.findIndex(holiday => holiday.id === action.payload.id);
                if (index !== -1) {
                    state.holidays[index] = action.payload;
                }
                if (state.selectedHoliday?.id === action.payload.id) {
                    state.selectedHoliday = action.payload;
                }
            })
            .addCase(updateHoliday.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearSelectedHoliday } = holidaySlice.actions;
export default holidaySlice.reducer;