import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getUserProperties } from "@/store/services";
import imageParadiseShores from "../../../assests/bear-lake-bluffs.jpg";
import imageBlueBearLake from "../../../assests/crown-jewel.jpg";
import imageCrownJewel from "../../../assests/blue-bear-lake.jpg";
import imageLakeEscape from "../../../assests/lake-escape.jpg";
import { RootState } from "@/store/reducers";

const mockData: Card[] = [
  {
    id: 1,
    name: "The Lake Escape",
    address: "123 Mock Lane",
    image: "imageParadiseShores",
    coverImageUrl: null,
    details: {
      2024: {
        offSeason: "2/10",
        peakSeason: "3/15",
        peakHoliday: "4/20",
        offSeasonHoliday: "5/25",
        peakRemainingNights: 10,
        offRemainingNights: 10,
        lastMinuteRemainingNights: 6,
        offRemainingHolidayNights: 1,
        peakRemainingHolidayNights: 1,
        maximumStayLength: 14,
        lastMinute: "",
        peakUsedNights: 0,
        offUsedNights: 0,
        peakBookedNights: 0,
        offBookedNights: 0,
        peakBookedHolidayNights: 0,
        offBookedHolidayNights: 0,
        lastMinuteLostNights: 0,
        peakCancelledHolidayNights: 0,
        offCancelledHolidayNights: 0,
        peakLostHolidayNights: 0,
        offLostHolidayNights: 0,
        offUsedHolidayNights: 0,
        peakUsedHolidayNights: 0,
        lastMinuteBookedNights: 0,
        lastMinuteAllottedNights: 0,
        lastMinuteCancelledNights: 0,
        offAllottedHolidayNights: 0,
        peakAllottedHolidayNights: 0,
        peakAllottedNights: 0,
        offAllottedNights: 0,

        // ... add the other 17 missing properties
      },
    },
    propertyShare: 3,
    maxGuestsAllowed: 4,
    maxPetsAllowed: 2,
    share: 0,
    peakSeasonStartDate: "2024-03-15",
    peakSeasonEndDate: "2024-11-15",
    propertyId: 101,
    propertyDetailsId: 201,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-10",
    ownerRezPropId: 301,
    propertyName: "The Lake Escape",
    city: "Mock City",
    state: "Mock State",
    country: "Mock Country",
    zipcode: 12345,
    houseDescription: "A serene lakefront escape.",
    isExclusive: true,
    latitude: 34.0522,
    longitude: -118.2437,
    isActive: true,
    displayOrder: 1,
    createdBy: { id: 1 },
    updatedBy: null,
    noOfGuestsAllowed: 4,
    noOfBedrooms: 2,
    noOfBathrooms: 2,
    noOfBathroomsFull: 1,
    noOfBathroomsHalf: 1,
    noOfPetsAllowed: 2,
    squareFootage: "1500 sqft",
    checkInTime: 15,
    checkOutTime: 11,
    petPolicy: "Pets allowed with an additional fee.",
    feePerPet: 50,
    cleaningFee: 100,
    peakSeasonAllottedNights: 20,
    offSeasonAllottedNights: 30,
    peakSeasonAllottedHolidayNights: 5,
    offSeasonAllottedHolidayNights: 10,
    lastMinuteBookingAllottedNights: 3,
    wifiNetwork: "LakeEscape_WiFi",
    users: [
      {
        userId: 1,
        id: 1,
        firstName: "John",
        lastName: "Doe",
        password: "hashedPassword",
        imageURL: null,
        isActive: 1,
        addressLine1: "456 Main St",
        addressLine2: null,
        coverImageUrl: null,
        state: "Mock State",
        country: "Mock Country",
        city: "Mock City",
        zipcode: "12345",
        resetToken: "token123",
        resetTokenExpires: "2024-02-01",
        lastLoginTime: "2024-01-15T08:30:00Z",
        createdBy: 1,
        updatedBy: 2,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-10",
      },
    ],
  },
  // Additional mock data entries as needed
];

export interface User {
  userId: number;
  id: number;
  firstName: string;
  lastName: string;
  password: string;
  imageURL: string | null;
  coverImageUrl: string | null;
  isActive: number;
  addressLine1: string;
  addressLine2: string | null;
  state: string;
  country: string | null;
  city: string | null;
  zipcode: string | null;
  resetToken: string;
  resetTokenExpires: string | null;
  lastLoginTime: string;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
}
export interface propertyAvailableDaysDetails {
  offSeason: string;
  peakSeason: string;
  peakHoliday: string;
  lastMinute: string;
  offSeasonHoliday: string;
  peakRemainingNights: number;
  offRemainingNights: number;
  lastMinuteRemainingNights: number;
  offRemainingHolidayNights: number;
  peakRemainingHolidayNights: number;
  maximumStayLength: number;
  peakUsedNights: number;
  offUsedNights: number;
  peakBookedNights: number;
  offBookedNights: number;
  lastMinuteAllottedNights: number;
  lastMinuteLostNights: number;
  peakBookedHolidayNights: number;
  offBookedHolidayNights: number;
  peakCancelledHolidayNights: number;
  offCancelledHolidayNights: number;
  peakLostHolidayNights: number;
  offLostHolidayNights: number;
  offUsedHolidayNights: number;
  peakUsedHolidayNights: number;
  lastMinuteBookedNights: number;
  lastMinuteCancelledNights: number;
  offAllottedHolidayNights: number;
  peakAllottedNights: number;
  offAllottedNights: number;
  peakAllottedHolidayNights: number;
}
export interface Card {
  id: number;
  name: string;
  address: string;
  image: string;
  details: {
    [year: number]: propertyAvailableDaysDetails;
  };
  coverImageUrl: string | null;
  propertyShare: number;
  maxGuestsAllowed: number;
  maxPetsAllowed: number;
  share: number;
  peakSeasonStartDate: string;
  peakSeasonEndDate: string;
  propertyId: number;
  propertyDetailsId: number;
  createdAt: string;
  updatedAt: string;
  ownerRezPropId: number;
  propertyName: string;
  city: string;
  state: string;
  country: string;
  zipcode: number;
  houseDescription: string;
  isExclusive: boolean;
  latitude: number;
  longitude: number;
  isActive: boolean;
  displayOrder: number;
  createdBy: { id: number };
  updatedBy: number | null;
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
  peakSeasonAllottedNights: number;
  offSeasonAllottedNights: number;
  peakSeasonAllottedHolidayNights: number;
  offSeasonAllottedHolidayNights: number;
  lastMinuteBookingAllottedNights: number;

  wifiNetwork: string;
  users: User[];
}

export interface PropertyState {
  data: any;
  // find(arg0: (p: any) => boolean): unknown;
  cards: Card[];
  loading: boolean;
  error: string | null;
  selectedYear: number;
  selectedPropertyId: number | null;
  selectedCard: Card | null;
  selectedCardIndex: number;
  selectedPropertyLimits: {
    noOfGuestsAllowed: number;
    noOfPetsAllowed: number;
  } | null;
}

const initialState: PropertyState = {
  cards: [],
  loading: false,
  error: null,
  selectedPropertyId: null,
  selectedCard: null,
  selectedCardIndex: 0,
  selectedYear: new Date().getFullYear(),
  selectedPropertyLimits: null,
};

export const fetchProperties = createAsyncThunk(
  "properties/fetchProperties",
  async (userId: number, {}) => {
    try {
      const response = await getUserProperties(userId);

      if (!Array.isArray(response.data) || response.data.length === 0) {
        console.warn("No data from API, using mock data.");
        return mockData;
      }

      const combinedData: Card[] = response.data.map((property: any) => {
        const userProperties = property.userProperties || [];
        const shareMap: { [year: number]: number } = {};
        const details: { [year: number]: propertyAvailableDaysDetails } = {};

        userProperties.forEach((userProp: any) => {
          if (userProp.isActive) {
            shareMap[userProp.year] = userProp.noOfShare;

            details[userProp.year] = {
              offSeason: `${userProp.offRemainingNights}/${userProp.offAllottedNights}`,
              peakSeason: `${userProp.peakRemainingNights}/${userProp.peakAllottedNights}`,
              peakHoliday: `${userProp.peakRemainingHolidayNights}/${userProp.peakAllottedHolidayNights}`,
              offSeasonHoliday: `${userProp.offRemainingHolidayNights}/${userProp.offAllottedHolidayNights}`,
              lastMinute: `${userProp.lastMinuteRemainingNights}/${userProp.lastMinuteAllottedNights}`,
              peakRemainingNights: userProp.peakRemainingNights,
              offRemainingNights: userProp.offRemainingNights,
              lastMinuteRemainingNights: userProp.lastMinuteRemainingNights,
              offRemainingHolidayNights: userProp.offRemainingHolidayNights,
              peakRemainingHolidayNights: userProp.peakRemainingHolidayNights,
              maximumStayLength: userProp.maximumStayLength,
              peakUsedNights: userProp.peakUsedNights,
              offUsedNights: userProp.offUsedNights,
              peakBookedNights: userProp.peakBookedNights,
              offBookedNights: userProp.offBookedNights,
              lastMinuteLostNights: userProp.lastMinuteLostNights,
              peakBookedHolidayNights: userProp.peakBookedHolidayNights,
              offBookedHolidayNights: userProp.offBookedHolidayNights,
              peakCancelledHolidayNights: userProp.peakCancelledHolidayNights,
              offCancelledHolidayNights: userProp.offCancelledHolidayNights,
              peakLostHolidayNights: userProp.peakLostHolidayNights,
              offLostHolidayNights: userProp.offLostHolidayNights,
              offUsedHolidayNights: userProp.offUsedHolidayNights,
              peakUsedHolidayNights: userProp.peakUsedHolidayNights,
              lastMinuteBookedNights: userProp.lastMinuteBookedNights,
              lastMinuteCancelledNights: userProp.lastMinuteCancelledNights,
              lastMinuteAllottedNights: userProp.lastMinuteAllottedNights,
              offAllottedHolidayNights: userProp.offAllottedHolidayNights,
              peakAllottedHolidayNights: userProp.peakAllottedHolidayNights,
              peakAllottedNights: userProp.peakAllottedNights,
              offAllottedNights: userProp.offAllottedNights,
            };
          }
        });

        return {
          id: property.propertyId,
          name: property.propertyName || "Unknown Property",
          address: property.address || "Unknown",
          image: getImageForProperty(property.propertyId),
          share: shareMap[2024] || 0,
          details,
          coverImageUrl: property.coverImageUrl,
          maxGuestsAllowed: property.noOfGuestsAllowed || 0,
          maxPetsAllowed: property.noOfPetsAllowed || 0,
          propertyShare: property.propertyShare,
          peakSeasonStartDate: property.peakSeasonStartDate,
          peakSeasonEndDate: property.peakSeasonEndDate,
          propertyId: property.propertyId,
          propertyDetailsId: property.propertyDetailsId,
          createdAt: property.createdAt,
          updatedAt: property.updatedAt,
          ownerRezPropId: property.ownerRezPropId,
          propertyName: property.propertyName || "Unknown Property",
          city: property.city || "Unknown City",
          state: property.state || "Unknown State",
          country: property.country || "Unknown Country",
          zipcode: property.zipcode || 0,
          houseDescription:
            property.houseDescription || "No description available.",
          isExclusive: property.isExclusive || false,
          latitude: property.latitude || 0,
          longitude: property.longitude || 0,
          isActive: property.isActive || false,
          displayOrder: property.displayOrder || 0,
          createdBy: { id: property.createdBy || 0 },
          updatedBy: property.updatedBy || null,
          noOfGuestsAllowed: property.noOfGuestsAllowed || 0,
          noOfBedrooms: property.noOfBedrooms || 0,
          noOfBathrooms: property.noOfBathrooms || 0,
          noOfBathroomsFull: property.noOfBathroomsFull || 0,
          noOfBathroomsHalf: property.noOfBathroomsHalf || 0,
          noOfPetsAllowed: property.noOfPetsAllowed || 0,
          squareFootage: property.squareFootage || "Unknown sqft",
          checkInTime: property.checkInTime || 0,
          checkOutTime: property.checkOutTime || 0,
          petPolicy: property.petPolicy || "No pets allowed.",
          feePerPet: property.feePerPet || 0,
          cleaningFee: property.cleaningFee || 0,
          peakSeasonAllottedNights: property.peakSeasonAllottedNights || 0,
          offSeasonAllottedNights: property.offSeasonAllottedNights || 0,
          peakSeasonAllottedHolidayNights:
            property.peakSeasonAllottedHolidayNights || 0,
          offSeasonAllottedHolidayNights:
            property.offSeasonAllottedHolidayNights || 0,
          lastMinuteBookingAllottedNights:
            property.lastMinuteBookingAllottedNights || 0,
          wifiNetwork: property.wifiNetwork || "No WiFi available",
          users: property.users || [],
          // peakUsedNights:property.peakUsedNights || 0,
          // offUsedNights:property.offUsedNights|| 0,
          // peakBookedNights:property.peakBookedNights || 0,
          // offBookedNights:property.offBookedNights || 1
        };
      });

      return combinedData;
    } catch (error) {
      console.error("Fetching properties failed:", error);
      console.warn("Error fetching properties, using mock data.");
      return mockData;
    }
  }
);

const getImageForProperty = (propertyId: number): string => {
  switch (propertyId) {
    case 1:
      return imageParadiseShores;
    case 2:
      return imageBlueBearLake;
    case 3:
      return imageLakeEscape;
    case 4:
      return imageBlueBearLake;
    case 5:
      return imageParadiseShores;
    case 6:
      return imageCrownJewel;
    case 7:
      return imageParadiseShores;
    case 8:
      return imageBlueBearLake;
    case 9:
      return imageCrownJewel;
    case 10:
      return imageParadiseShores;
    default:
      return imageBlueBearLake;
  }
};

const propertySlice = createSlice({
  name: "properties",
  initialState,
  reducers: {
    selectProperty: (state, action: PayloadAction<number>) => {
      state.selectedPropertyId = action.payload;
      const selectedProperty = state.cards.find(
        (card) => card.id === action.payload
      );
      if (selectedProperty) {
        state.selectedPropertyLimits = {
          noOfGuestsAllowed: selectedProperty.maxGuestsAllowed,
          noOfPetsAllowed: selectedProperty.maxPetsAllowed,
        };
      } else {
        state.selectedPropertyLimits = null;
      }
    },

    selectcard: (state, action: PayloadAction<Card | null>) => {
      state.selectedCard = action.payload;
    },
    selectcardindex: (state, action: PayloadAction<number>) => {
      state.selectedCardIndex = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.cards = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { selectProperty, selectcard, selectcardindex } =
  propertySlice.actions;
// export const selectSelectedPropertyDetails = (state: RootState) => {
//   const selectedProperty = state.properties.cards.find(card => card.id === state.properties.selectedPropertyId);
//   if (selectedProperty) {
//     return {
//       ...selectedProperty,
//       details: {
//         2024: selectedProperty.details[2024],
//         2025: selectedProperty.details[2025],
//         2026: selectedProperty.details[2026],
//       },
//     };
//   }
//   return null;
// };

export const selectSelectedPropertyDetails = (state: RootState) => {
  const selectedProperty = state.properties.cards.find(
    (card) => card.id === state.properties.selectedPropertyId
  );
  if (selectedProperty) {
    const currentYear = new Date().getFullYear();
    const relevantYears = [currentYear, currentYear + 1, currentYear + 2];

    const dynamicDetails = relevantYears.reduce((acc, year) => {
      if (selectedProperty?.details?.[year]) {
        acc[year] = {
          ...selectedProperty?.details[year],
          peakSeasonStartDate: selectedProperty.peakSeasonStartDate,
          peakSeasonEndDate: selectedProperty.peakSeasonEndDate,
        };
      }
      return acc;
    }, {} as Record<number, any>);

    return {
      ...selectedProperty,
      details: dynamicDetails,
    };
  }
  return null;
};
export default propertySlice.reducer;
