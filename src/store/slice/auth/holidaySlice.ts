import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { addHolidayApi, updateHolidaysApi } from '@/api';

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

export interface HolidayState {
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

export const updateHoliday = createAsyncThunk(
    'holiday/updateHoliday',
    async (
        { id, updatedHolidayData }: {
            id: number,
            updatedHolidayData: {
                name: string;
                year: number;
                startDate: string | undefined;
                endDate: string | undefined;
                properties: { id: number; }[];
                updatedBy: { id: number; };
            }
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await updateHolidaysApi(id, updatedHolidayData);
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
            })
            .addCase(updateHoliday.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default holidaySlice.reducer;