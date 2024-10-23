import { createAsyncThunk } from '@reduxjs/toolkit';
import { addHolidayApi, updateHolidaysApi, fetchpropertyHolidaysApi } from '@/api/api-endpoints';
import { Holiday } from '@/store/model/holiday.types';

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
