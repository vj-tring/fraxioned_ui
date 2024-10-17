import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { getUserProperties } from '@/api/api-endpoints';


interface UserProperty {
    id: number;
    noOfShare: number;
    acquisitionDate: string;
    isActive: number;
    year: number;
    peakAllottedNights: number;
    peakUsedNights: number;
    peakBookedNights: number;
    peakCancelledNights: number;
    peakLostNights: number;
    peakRemainingNights: number;
    peakAllottedHolidayNights: number;
    peakUsedHolidayNights: number;
    peakBookedHolidayNights: number;
    peakRemainingHolidayNights: number;
    peakCancelledHolidayNights: number | null;
    peakLostHolidayNights: number | null;
    offAllottedNights: number;
    offUsedNights: number;
    offBookedNights: number;
    offCancelledNights: number;
    offLostNights: number;
    offRemainingNights: number;
    offAllottedHolidayNights: number;
    offUsedHolidayNights: number;
    offBookedHolidayNights: number;
    offRemainingHolidayNights: number;
    offCancelledHolidayNights: number | null;
    offLostHolidayNights: number | null;
    lastMinuteAllottedNights: number;
    lastMinuteUsedNights: number | null;
    lastMinuteBookedNights: number | null;
    lastMinuteRemainingNights: number;
    maximumStayLength: number;
    createdAt: string;
    updatedAt: string;
}

interface PropertyDetails {
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
    mailBannerUrl: string;
    coverImageUrl: string;
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
    userProperties: UserProperty[];
}

interface UserPropertyState {
    properties: PropertyDetails[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: UserPropertyState = {
    properties: [],
    status: 'idle',
    error: null,
};

export const fetchUserProperties = createAsyncThunk<
    PropertyDetails[],
    number,
    { rejectValue: string }
>('userProperty/fetchUserProperties', async (userId, { rejectWithValue }) => {
    try {
        const response = await getUserProperties(userId);
        return response.data;
    } catch (err) {
        const error: AxiosError = err as AxiosError;
        return rejectWithValue(error.message || 'Failed to fetch user properties');
    }
});

const userPropertySlice = createSlice({
    name: 'userProperty',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProperties.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserProperties.fulfilled, (state, action: PayloadAction<PropertyDetails[]>) => {
                state.status = 'succeeded';
                state.properties = action.payload;
            })
            .addCase(fetchUserProperties.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to fetch user properties';
            });
    },
});

export default userPropertySlice.reducer;