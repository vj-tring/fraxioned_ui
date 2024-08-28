import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createBooking, getBookings } from '../../../api/index';


  export const fetchBookings = createAsyncThunk(
    'bookings/fetchBookings',
    async (_, { rejectWithValue }) => {
      try {
        const response = await getBookings();
        console.log('Fetched bookings:', response.data); // Add this line
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || { message: 'An error occurred' });
      }
    }
  );

export const saveBooking = createAsyncThunk(
  'bookings/saveBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await createBooking(bookingData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'An error occurred' });
    }
  }
);

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    bookings: [],
    currentBooking: null,
    error: null as string | null,
    successMessage: null as string | null,
    isLoading: false,
  },
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
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.bookings = action.payload;
        state.isLoading = false;
        console.log('Bookings stored in state:', state.bookings);
      })
      .addCase(saveBooking.fulfilled, (state, action) => {
        state.currentBooking = action.payload;
        state.isLoading = false;
        state.error = null;
        state.successMessage = "Booking successfully created!";
      })
      .addCase(saveBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload && typeof action.payload === 'object' && 'message' in action.payload
          ? action.payload.message as string
          : 'An error occurred';
        state.successMessage = null;
      });
  },
});

export const { clearBookingMessages } = bookingSlice.actions;
export default bookingSlice.reducer;