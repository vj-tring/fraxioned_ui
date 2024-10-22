import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../axiosSetup';

interface UpdatedBy {
    id: number;
}

interface Property {
    id: number;
    ownerRezPropId?: number;
    propertyName?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    zipcode?: number;
    houseDescription?: string;
    isExclusive?: boolean;
    propertyShare?: number;
    propertyRemainingShare?: number;
    latitude?: number;
    longitude?: number;
    isActive?: boolean;
    displayOrder?: number;
    mailBannerUrl?: string;
    coverImageUrl?: string;
}

interface PropertyRules {
    id?: number;
    updatedBy: UpdatedBy;
    property: Property;
    noOfGuestsAllowed: number;
    noOfBedrooms: number;
    noOfBathrooms: number;
    noOfBathroomsFull: number;
    noOfBathroomsHalf: number;
    squareFootage: string;
    checkInTime: number;
    checkOutTime: number;
    cleaningFee: number;
    noOfPetsAllowed: number;
    petPolicy: string;
    feePerPet: number;
    peakSeasonStartDate: string;
    peakSeasonEndDate: string;
    peakSeasonAllottedNights: number;
    offSeasonAllottedNights: number;
    peakSeasonAllottedHolidayNights: number;
    offSeasonAllottedHolidayNights: number;
    lastMinuteBookingAllottedNights: number;
    wifiNetwork: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: {
        id: number;
    };
}

interface PropertyRulesState {
    data: PropertyRules | null;
    loading: boolean;
    error: string | null;
}

const initialState: PropertyRulesState = {
    data: null,
    loading: false,
    error: null,
};

export const fetchPropertyDetails = createAsyncThunk(
    'propertyRules/fetchDetails',
    async (id: number) => {
        const response = await axiosInstance.get(`/property-details/property-detail/${id}`);
        return response.data;
    }
);

export const updatePropertyRules = createAsyncThunk(
    'propertyRules/update',
    async ({ id, data }: { id: number; data: Omit<PropertyRules, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'> }) => {
        const response = await axiosInstance.patch(`/property-details/property-detail/${id}`, data);
        return response.data;
    }
);

const propertyRulesSlice = createSlice({
    name: 'propertyRules',
    initialState,
    reducers: {
        resetPropertyRules: (state) => {
            state.data = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPropertyDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPropertyDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchPropertyDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'An error occurred while fetching property details';
            })
            .addCase(updatePropertyRules.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePropertyRules.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(updatePropertyRules.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'An error occurred while updating property rules';
            });
    },
});

export const { resetPropertyRules } = propertyRulesSlice.actions;
export default propertyRulesSlice.reducer;