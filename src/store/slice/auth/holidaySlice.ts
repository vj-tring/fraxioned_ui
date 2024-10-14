import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { addHolidayApi, updateHolidaysApi, fetchpropertyHolidaysApi } from '@/api';

interface Property {
    id: number;
    propertyName: string;
}

interface PropertySeasonHoliday {
    id: number;
    property: Property;
}

interface Holiday {
    id: number;
    name: string;
    year: number;
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
    createdBy: {
        id: number;
    };
    updatedBy: {
        id: number;
    };
    properties: { id: number }[];
    propertySeasonHolidays?: PropertySeasonHoliday[];
}

interface FetchHolidayResponse {
    success: boolean;
    message: string;
    data: Holiday;
    statusCode: number;
}

export interface HolidayState {
    holidays: Holiday[];
    selectedHoliday: Holiday | null;
    loading: boolean;
    error: string | null;
}

const initialState: HolidayState = {
    holidays: [],
    selectedHoliday: null,
    loading: false,
    error: null,
};

export const fetchPropertyHoliday = createAsyncThunk(
    'holiday/fetchPropertyHoliday',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await fetchpropertyHolidaysApi(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

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
    reducers: {
        clearSelectedHoliday: (state) => {
            state.selectedHoliday = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Property Holiday
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
            // Add Holiday
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
            // Update Holiday
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