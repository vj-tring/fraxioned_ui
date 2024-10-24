export interface Owner {
    userId: number;
    noOfShare: number;
    acquisitionDate: string;
}

export interface UserPropertyDetails {
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