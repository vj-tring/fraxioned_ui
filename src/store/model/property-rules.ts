export interface UpdatedBy {
    id: number;
}

export interface Property {
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

export interface PropertyRules {
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

export interface PropertyRulesState {
    data: PropertyRules | null;
    loading: boolean;
    error: string | null;
}