import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getUserProperties } from '../../../api/index';
import imageParadiseShores from '../../../assests/bear-lake-bluffs.jpg';
import imageBlueBearLake from '../../../assests/crown-jewel.jpg';
import imageCrownJewel from '../../../assests/blue-bear-lake.jpg';
import imageLakeEscape from '../../../assests/lake-escape.jpg';

// Mock data
const mockData: Card[] = [
  {
    id: 1,
    name: ' Blue Bear ',
    address: '123 Mock Lane',
    image: imageParadiseShores,
    details: {
      2024: {
        offSeason: '2/10',
        peakSeason: '3/15',
        peakHoliday: '4/20',
        offSeasonHoliday: '5/25',
      },
      2025: {
        offSeason: '32/10',
        peakSeason: '32/15',
        peakHoliday: '43/20',
        offSeasonHoliday: '5/25',
      },
      2026: {
        offSeason: '2/10',
        peakSeason: '3/15',
        peakHoliday: '4/20',
        offSeasonHoliday: '5/25',
      },
    },
    maxGuestsAllowed: 4,
    maxPetsAllowed: 2,
    share: 0,
  },
  {
    id: 1,
    name: ' The Crown Jewel ',
    address: '123 Mock Lane',
    image: imageParadiseShores,
    details: {
      2024: {
        offSeason: '2/10',
        peakSeason: '3/15',
        peakHoliday: '4/20',
        offSeasonHoliday: '5/25',
      },
      2025: {
        offSeason: '1/10',
        peakSeason: '2/15',
        peakHoliday: '3/2',
        offSeasonHoliday: '2/35',
      },
      2026: {
        offSeason: '2/10',
        peakSeason: '3/15',
        peakHoliday: '4/20',
        offSeasonHoliday: '5/25',
      },
    },
    maxGuestsAllowed: 4,
    maxPetsAllowed: 2,
    share: 0,
  },
  // Add more mock properties if needed
];

interface Card {
  id: number;
  name: string;
  address: string;
  image: string;
  details: {
    [year: number]: {
      offSeason: string;
      peakSeason: string;
      peakHoliday: string;
      offSeasonHoliday: string;
    };
  };
  maxGuestsAllowed: number;
  maxPetsAllowed: number;
  share: number;
}

interface PropertyState {
  cards: Card[];
  loading: boolean;
  error: string | null;
  selectedPropertyId: number | null;
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
  selectedPropertyLimits: null,
};

export const fetchProperties = createAsyncThunk(
  'properties/fetchProperties',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await getUserProperties(userId);
      console.log("response", response);

      if (!Array.isArray(response.data) || response.data.length === 0) {
        // Use mock data if API response is empty
        console.warn("No data from API, using mock data.");
        return mockData;
      }

      // Process the data to include noOfShare and other details
      const combinedData: Card[] = response.data.map((property: any) => {
        // Find all relevant userProperties entries
        const userProperties = property.userProperties || [];
        
        // Create a map for share values by year
        const shareMap: { [year: number]: number } = {};
        const details: { [year: number]: any } = {};

        userProperties.map((userProp: any) => {
          if (userProp.isActive) {
            shareMap[userProp.year] = userProp.noOfShare;

            // Calculate fraction or formatted string for offSeason, peakSeason, peakHoliday, and offSeasonHoliday
            const offSeasonNumerator = userProp.offRemainingNights;
            const offSeasonDenominator = userProp.offAllottedNights;

            const peakSeasonNumerator = userProp.peakRemainingNights;
            const peakSeasonDenominator = userProp.peakAllottedNights;

            const peakHolidayNumerator = userProp.peakRemainingHolidayNights;
            const peakHolidayDenominator = userProp.peakAllottedHolidayNights;

            const offSeasonHolidayNumerator = userProp.offRemainingHolidayNights;
            const offSeasonHolidayDenominator = userProp.offAllottedHolidayNights;

            details[userProp.year] = {
              offSeason: offSeasonDenominator !== null ? `${offSeasonNumerator}/${offSeasonDenominator}` : 'undefined',
              peakSeason: peakSeasonDenominator !== null ? `${peakSeasonNumerator}/${peakSeasonDenominator}` : 'undefined',
              peakHoliday: peakHolidayDenominator !== null ? `${peakHolidayNumerator}/${peakHolidayDenominator}` : 'undefined',
              offSeasonHoliday: offSeasonHolidayDenominator !== null ? `${offSeasonHolidayNumerator}/${offSeasonHolidayDenominator}` : 'undefined',
            };
          }
        });

        [2024, 2025, 2026].forEach(year => {
          if (!details[year]) {
            details[year] = {
              offSeason: '2',
              peakSeason: '3',
              peakHoliday: '4',
              offSeasonHoliday: '5',
            };
          }
        });

        return {
          id: property.propertyId,
          name: property.propertyName || 'Unknown Property',
          address: `${property.address || 'Unknown'}`,
          image: getImageForProperty(property.propertyId),
          share: shareMap[2024] || 0, // Default to 0 if not found
          details,
          propertyShare:property.propertyShare,
          maxGuestsAllowed: property.noOfGuestsAllowed || 0,
          maxPetsAllowed: property.noOfPetsAllowed || 0,
        };
      });

      return combinedData;
    } catch (error) {
      console.error("Fetching properties failed:", error);
      // Use mock data in case of error
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
      return imageCrownJewel;
    default:
      return imageParadiseShores; 
  }
};

const propertySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    selectProperty: (state, action: PayloadAction<number>) => {
      state.selectedPropertyId = action.payload;
      const selectedProperty = state.cards.find(card => card.id === action.payload);
      if (selectedProperty) {
        state.selectedPropertyLimits = {
          noOfGuestsAllowed: selectedProperty.maxGuestsAllowed,
          noOfPetsAllowed: selectedProperty.maxPetsAllowed,
        };
      } else {
        state.selectedPropertyLimits = null;
      }
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

export const { selectProperty } = propertySlice.actions;
export default propertySlice.reducer;
