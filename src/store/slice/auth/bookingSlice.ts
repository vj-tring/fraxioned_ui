import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  createBooking,
  createBookingSummary,
  getBookings,
  getUserBookings,
} from "../../../api/index"; // Ensure these imports are correct

export interface BookingData {
  property: { id: number };
  propertyName: string;
  checkinDate: string;
  checkoutDate: string;
  noOfAdults: number;
  noOfChildren: number;
  noOfPets: number;
  isLastMinuteBooking: boolean;
  cleaningFee: number;
  petFee: number;
  createdAt: string;
  notes?: string; // Added notes field
}

interface BookingSummaryResponse {
  adults: number;
  bookingId: string;
  checkIn: string;
  checkInTime: number;
  checkOut: string;
  checkOutTime: number;
  children: number;
  cleaningFee: number;
  dateOfCharge: string;
  holiday: string;
  isLastMinuteBooking: boolean;
  noOfGuests: number;
  offHolidayNights: number;
  offNights: number;
  peakHolidayNights: number;
  peakNights: number;
  petFee: number;
  pets: number;
  property: { id: number };
  season: string;
  totalAmountDue: number;
  totalNights: number;
}

interface ConfirmBookingResponse {
  message: string;
  data: any; // Replace with actual data type if possible
}

interface BookingState {
  bookings: BookingData[]; // Added bookings array to state
  currentBooking: BookingData | null;
  userBookings: BookingData[];
  error: string | null;
  successMessage: string | null;
  isLoading: boolean;
}

export const fetchBookings = createAsyncThunk(
  "bookings/fetchBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getBookings();
      console.log("Fetched bookings:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { message: "An error occurred" }
      );
    }
  }
);

export const fetchUserBookings = createAsyncThunk(
  "bookings/fetchUserBookings",
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await getUserBookings(userId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { message: "An error occurred" }
      );
    }
  }
);

// export const saveBooking = createAsyncThunk(
//   'bookings/saveBooking',
//   async (bookingData: BookingData) => {
//     return bookingData;
//   }
// );

export const bookingSummary = createAsyncThunk<
  BookingSummaryResponse,
  BookingData,
  { rejectValue: string }
>(
  "bookings/bookingSummary",
  async (bookingData: BookingData, { rejectWithValue }) => {
    try {
      console.log("Sending booking data to API:", bookingData);
      const response = await createBookingSummary(bookingData);
      console.log("API response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error in bookingSummary:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong. Please try again later.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const saveBooking = createAsyncThunk(
  "bookings/saveBooking",
  async (bookingData: BookingData) => {
    return bookingData;
  }
);

export const confirmBooking = createAsyncThunk<
  { message: string; data: any },
  BookingData,
  { rejectValue: string }
>(
  "bookings/confirmBooking",
  async (bookingData: BookingData, { rejectWithValue }) => {
    try {
      const {
        propertyName,
        noOfInfants,
        confirmationCode,
        cleaningFee,
        petFee,
        ...filteredBookingData
      } = bookingData;

      // Make the API call with the filtered data
      const response = await createBooking(filteredBookingData);

      if (response.data.statusCode === 201) {
        return { message: response.data.message, data: response.data };
      } else {
        console.log("rejected");
        return rejectWithValue(
          response.data.message || "Failed to confirm booking"
        );
      }
    } catch (error: any) {
      console.log("error", error);
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again later.";
      return rejectWithValue(errorMessage);
    }
  }
);

const bookingSlice = createSlice({
  name: "bookings",
  initialState: {
    bookings: [],
    userBookings: [],

    currentBooking: null as BookingData | null,
    error: null as string | null,
    successMessage: null as string | null,
    isLoading: false,
  } as BookingState,
  reducers: {
    clearBookingMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    setNotes: (state, action: PayloadAction<string>) => {
      if (state.currentBooking) {
        state.currentBooking.notes = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.bookings = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchUserBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchUserBookings.fulfilled,
        (state, action: PayloadAction<BookingData[]>) => {
          state.userBookings = action.payload;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(saveBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(
        saveBooking.fulfilled,
        (state, action: PayloadAction<BookingData>) => {
          state.currentBooking = action.payload;
          state.isLoading = false;
          state.error = null;
          state.successMessage = "Booking successfully saved in Redux!";
        }
      )
      .addCase(saveBooking.rejected, (state) => {
        state.isLoading = false;
        state.error = "An error occurred while saving the booking data";
        state.successMessage = null;
      })
      .addCase(confirmBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(
        confirmBooking.fulfilled,
        (state, action: PayloadAction<ConfirmBookingResponse>) => {
          state.currentBooking = action.payload.data;
          state.isLoading = false;
          state.error = null;
          state.successMessage = action.payload.message;
        }
      )
      .addCase(confirmBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.successMessage = null;
      })
      .addCase(bookingSummary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(
        bookingSummary.fulfilled,
        (state, action: PayloadAction<BookingSummaryResponse>) => {
          if (state.currentBooking) {
            state.currentBooking = {
              ...state.currentBooking,
              season: action.payload.season,
              cleaningFee: action.payload.cleaningFee,
              petFee: action.payload.petFee,
              totalAmountDue: action.payload.totalAmountDue,
              noOfAdults: action.payload.adults,
              noOfChildren: action.payload.children,
              noOfPets: action.payload.pets,
              checkinDate: action.payload.checkIn,
              checkoutDate: action.payload.checkOut,
              isLastMinuteBooking: action.payload.isLastMinuteBooking,
            };
          }
          state.isLoading = false;
          state.error = null;
          state.successMessage = "Booking summary created successfully";
        }
      )
      .addCase(bookingSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.successMessage = null;
      });
  },
});

export const { clearBookingMessages, setNotes } = bookingSlice.actions;
export default bookingSlice.reducer;
