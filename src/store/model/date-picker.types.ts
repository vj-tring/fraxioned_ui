export interface DateRange {
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
