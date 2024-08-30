import { createBooking } from '@/api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface BookingData {
  // Define your booking data structure
  property: { id: string };
  checkinDate: string;
  checkoutDate: string;
  noOfAdults: number;
  noOfChildren: number;
  noOfPets: number;
  isLastMinuteBooking: boolean;
  cleaningFee: number;
  petFee: number;
}

interface ConfirmBookingResponse {
  message: string;
  data: any; // Replace with actual data type if possible
}

interface BookingState {
  currentBooking: BookingData | null;
  error: string | null;
  successMessage: string | null;
  isLoading: boolean;
}

export const saveBooking = createAsyncThunk(
  'bookings/saveBooking',
  async (bookingData: BookingData) => {
    // Placeholder for save booking logic if needed
    return bookingData;
  }
);

export const confirmBooking = createAsyncThunk(
  'bookings/confirmBooking',
  async (bookingData: BookingData, { rejectWithValue }) => {
    try {
      const response = await createBooking(bookingData);
      if (response.status === 200) {
        return { message: 'Booking successfully confirmed in the database', data: response.data };
      } else {
        return rejectWithValue(response.data.message || 'Failed to confirm booking');
      }
    } catch (error) {
      return rejectWithValue('Failed to confirm booking');
    }
  }
);

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    currentBooking: null,
    error: null,
    successMessage: null,
    isLoading: false,
  } as BookingState,
  reducers: {
    clearBookingMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(saveBooking.fulfilled, (state, action: PayloadAction<BookingData>) => {
        state.currentBooking = action.payload;
        state.isLoading = false;
        state.error = null;
        state.successMessage = 'Booking successfully saved in Redux!';
      })
      .addCase(saveBooking.rejected, (state) => {
        state.isLoading = false;
        state.error = 'An error occurred while saving the booking data';
        state.successMessage = null;
      })
      .addCase(confirmBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(confirmBooking.fulfilled, (state, action: PayloadAction<ConfirmBookingResponse>) => {
        state.currentBooking = action.payload.data;
        state.isLoading = false;
        state.error = null;
        state.successMessage = action.payload.message;
      })
      .addCase(confirmBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.successMessage = null;
      });
  },
});

export const { clearBookingMessages } = bookingSlice.actions;
export default bookingSlice.reducer;
