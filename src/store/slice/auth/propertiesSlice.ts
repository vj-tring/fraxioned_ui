import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProperties, getPropertyById, getProperrtDetailsbyId } from '@/api';


interface Property {
    id: number;
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
    createdAt: string;
    updatedAt: string;
    mailBannerUrl: string;
    coverImageUrl: string;
  }

export interface PropertyDetails {
    id: number;
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
    createdAt: string;
    updatedAt: string;
    createdBy: {
        id: number;
    };
    updatedBy: {
        id: number;
    };
}

export interface PropertiesState {
    properties: Property[];
    selectedProperty: Property | null;
    selectedPropertyDetails: PropertyDetails | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: PropertiesState = {
    properties: [],
    selectedProperty: null,
    selectedPropertyDetails: null,
    status: 'idle',
    error: null,
};

export const fetchProperties = createAsyncThunk('properties/fetchProperties', async () => {
    const response = await getProperties();
    return response.data;
});

export const fetchPropertyById = createAsyncThunk(
    'properties/fetchPropertyById',
    async (id: number) => {
        const response = await getPropertyById(id);
        return response.data;
    }
);

export const fetchPropertyDetailsById = createAsyncThunk(
    'properties/fetchPropertyDetailsById',
    async (id: number) => {
        const response = await getProperrtDetailsbyId(id);
        return response.data;
    }
);

const propertiesSlice = createSlice({
    name: 'property',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProperties.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProperties.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.properties = action.payload;
            })
            .addCase(fetchProperties.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch properties';
            })
            .addCase(fetchPropertyById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPropertyById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.selectedProperty = action.payload;
            })
            .addCase(fetchPropertyById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch property';
            })
            .addCase(fetchPropertyDetailsById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPropertyDetailsById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.selectedPropertyDetails = action.payload;
            })
            .addCase(fetchPropertyDetailsById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch property details';
            });
    },
});

export default propertiesSlice.reducer;