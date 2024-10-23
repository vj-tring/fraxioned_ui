import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addHoliday,
  updateHoliday,
  fetchHolidayById,
} from "@/api/api-endpoints";
import { Holiday } from "@/store/model/holiday.types";

export const fetchPropertyHoliday = createAsyncThunk(
  "holiday/fetchPropertyHoliday",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetchHolidayById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addHoliday = createAsyncThunk(
  "holiday/addHoliday",
  async (holidayData: Omit<Holiday, "id">, { rejectWithValue }) => {
    try {
      const response = await addHoliday(holidayData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateHoliday = createAsyncThunk(
  "holiday/updateHoliday",
  async (
    {
      id,
      updatedHolidayData,
    }: {
      id: number;
      updatedHolidayData: {
        name: string;
        year: number;
        startDate: string | undefined;
        endDate: string | undefined;
        properties: { id: number }[];
        updatedBy: { id: number };
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateHoliday(id, updatedHolidayData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
