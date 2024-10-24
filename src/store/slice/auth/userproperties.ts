import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getUserByProperty } from "@/store/services";

interface Owner {
  userId: number;
  noOfShare: number;
  acquisitionDate: string;
}

interface UserPropertyDetails {
  propertyId: number;
  propertyDetailsId: number;
  createdAt: string;
  updatedAt: string;
  ownerRezPropId: number;
  propertyName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipcode: number;
  houseDescription: string;
  isExclusive: boolean;
  propertyShare: number;
  propertyRemainingShare: number;
  latitude: number;
  longitude: number;
  isActive: boolean;
  displayOrder: number;
  createdBy: {
    id: number;
  };
  updatedBy: null | { id: number };
  noOfGuestsAllowed: number;
  noOfBedrooms: number;
  noOfBathrooms: number;
  noOfBathroomsFull: number;
  noOfBathroomsHalf: number;
  noOfPetsAllowed: number;
  squareFootage: string;
  checkInTime: number;
  checkOutTime: number;
  petPolicy: string;
  feePerPet: number;
  cleaningFee: number;
  peakSeasonStartDate: string;
  peakSeasonEndDate: string;
  peakSeasonAllottedNights: number;
  offSeasonAllottedNights: number;
  peakSeasonAllottedHolidayNights: number;
  offSeasonAllottedHolidayNights: number;
  lastMinuteBookingAllottedNights: number;
  wifiNetwork: string;
  owners: Owner[];
}

export interface UserPropertiesState {
  propertyDetails: UserPropertyDetails | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserPropertiesState = {
  propertyDetails: null,
  loading: false,
  error: null,
};

export const fetchUserPropertyDetails = createAsyncThunk(
  "userProperties/fetchUserPropertyDetails",
  async (id: number) => {
    const response = await getUserByProperty(id);
    return response.data;
  }
);

const userPropertiesSlice = createSlice({
  name: "userProperties",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPropertyDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserPropertyDetails.fulfilled,
        (state, action: PayloadAction<UserPropertyDetails>) => {
          state.loading = false;
          state.propertyDetails = action.payload;
        }
      )
      .addCase(fetchUserPropertyDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      });
  },
});

export default userPropertiesSlice.reducer;
