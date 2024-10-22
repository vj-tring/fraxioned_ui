export interface Property {
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
    createdBy: {
      id: number;
    };
    updatedBy: {
      id: number;
    };
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