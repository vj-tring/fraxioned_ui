import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
  isLastMinuteBooking: boolean;
}

export interface DatePickerState {
  dateRange: DateRange | undefined;
  errorMessage: string | null;
  isCalendarOpen: boolean;
  validationMessage: string | null;
  selectedYear: number | null;
  startDate: Date | null;
  startDateSelected: boolean;
}

const initialState: DatePickerState = {
  dateRange: {
    from: undefined,
    to: undefined,
    isLastMinuteBooking: false,
  },  errorMessage: null,
  isCalendarOpen: false,
  validationMessage: null,
  selectedYear: null,
  startDate: null,
  startDateSelected: false,
};

const datePickerSlice = createSlice({
  name: 'datePicker',
  initialState,
  reducers: {
    setDateRange(state, action: PayloadAction<DateRange | undefined>) {
      state.dateRange = action.payload;
    },
    setErrorMessage(state, action: PayloadAction<string | null>) {
      state.errorMessage = action.payload;
    },
    setIsCalendarOpen(state, action: PayloadAction<boolean>) {
      state.isCalendarOpen = action.payload;
    },
    clearDates(state) {
      state.dateRange = undefined;
      state.errorMessage = null;
      state.isCalendarOpen = false;
      state.validationMessage = null;
      state.selectedYear = null;
      state.startDate = null;
      state.startDateSelected = false;
    },
    clearPartial(state) {
      state.dateRange = undefined;
      state.startDate = null;
      state.startDateSelected = false;
    },
    setValidationMessage(state, action: PayloadAction<string | null>) { 
      state.validationMessage = action.payload;
    },
    clearValidationMessage(state) {
      state.validationMessage = null;
    },
    setSelectedYear(state, action: PayloadAction<number | null>) {
      state.selectedYear = action.payload;
    },
    setStartDate(state, action: PayloadAction<Date | null>) {
      state.startDate = action.payload;
    },
    setStartDateSelected(state, action: PayloadAction<boolean>) {
      state.startDateSelected = action.payload;
    },
  },
});

export const { setDateRange, setErrorMessage, setIsCalendarOpen, clearDates, clearPartial, setValidationMessage, clearValidationMessage, setSelectedYear, setStartDate, setStartDateSelected } = datePickerSlice.actions;
export default datePickerSlice.reducer;