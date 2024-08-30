import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getUserProperties } from '../../../api/index';
import imageParadiseShores from '../../../assests/bear-lake-bluffs.jpg';
import imageBlueBearLake from '../../../assests/crown-jewel.jpg';
import imageCrownJewel from '../../../assests/blue-bear-lake.jpg';
import imageLakeEscape from '../../../assests/lake-escape.jpg';
import { RootState } from '@/store/reducers';

// Mock data
const mockData: Card[] = [
  {
    id: 1,
    name: 'The Lake Escape ',
    address: '123 Mock Lane',
    image: imageParadiseShores,
    details: {
      2024: {
        offSeason: '2/10',
        peakSeason: '3/15',
        peakHoliday: '4/20',
        offSeasonHoliday: '5/25',
        peakRemainingNights: 10,
        offRemainingNights: 10,
        lastMinuteRemainingNights: 6,
        offRemainingHolidayNights:1,
        peakRemainingHolidayNights:1,
        maximumStayLength: 14,
      },
      2025: {
        offSeason: '32/10',
        peakSeason: '32/15',
        peakHoliday: '43/20',
        offSeasonHoliday: '5/25',
        peakRemainingNights: 10,
        offRemainingNights: 10,
        lastMinuteRemainingNights: 6,
        offRemainingHolidayNights:1,
        peakRemainingHolidayNights:1,
        maximumStayLength: 14,

      },
      2026: {
        offSeason: '2/10',
        peakSeason: '3/15',
        peakHoliday: '4/20',
        offSeasonHoliday: '5/25',
        peakRemainingNights:15,
        offRemainingNights: 10,
        lastMinuteRemainingNights: 6,
        offRemainingHolidayNights:1,
        peakRemainingHolidayNights:1,
        maximumStayLength: 14,
      },
    },
    propertyShare:3,
    maxGuestsAllowed: 4,
    maxPetsAllowed: 2,
    share: 0,
    peakSeasonStartDate: '2024-03-15',
    peakSeasonEndDate: '2024-11-15',
  },
  {
    id: 2,
    name: ' The Crown Jewel ',
    address: '123 Mock Lane',
    image: imageBlueBearLake,
    details: {
      2024: {
        offSeason: '2/10',
        peakSeason: '3/15',
        peakHoliday: '4/20',
        offSeasonHoliday: '5/25',
        peakRemainingNights: 10,
        offRemainingNights: 10,
        lastMinuteRemainingNights: 6,
        offRemainingHolidayNights:1,
        peakRemainingHolidayNights:1,
        maximumStayLength: 14,
      },
      2025: {
        offSeason: '1/10',
        peakSeason: '2/15',
        peakHoliday: '3/2',
        offSeasonHoliday: '2/35',
        peakRemainingNights: 10,
        offRemainingNights: 10,
        lastMinuteRemainingNights: 6,
        offRemainingHolidayNights:1,
        peakRemainingHolidayNights:1,
        maximumStayLength: 14,
      },
      2026: {
        offSeason: '2/10',
        peakSeason: '3/15',
        peakHoliday: '4/20',
        offSeasonHoliday: '5/25',
        peakRemainingNights: 10,
        offRemainingNights: 10,
        lastMinuteRemainingNights: 6,
        offRemainingHolidayNights:1,
        peakRemainingHolidayNights:1,
        maximumStayLength: 14,
      },



    },
    propertyShare:3,

    maxGuestsAllowed: 4,
    maxPetsAllowed: 2,
    share: 0,
    peakSeasonStartDate: '2024-03-15',
    peakSeasonEndDate: '2024-11-15',
  },



  {
    id: 3,
    name: ' Blue Bear ',
    address: '123 Mock Lane',
    image: imageCrownJewel,
    details: {
      2024: {
        offSeason: '2/10',
        peakSeason: '3/15',
        peakHoliday: '4/20',
        offSeasonHoliday: '5/25',
        peakRemainingNights: 10,
        offRemainingNights: 10,
        lastMinuteRemainingNights: 6,
        offRemainingHolidayNights:1,
        peakRemainingHolidayNights:1,
        maximumStayLength: 14,
      },
      2025: {
        offSeason: '32/10',
        peakSeason: '32/15',
        peakHoliday: '43/20',
        offSeasonHoliday: '5/25',
        peakRemainingNights: 10,
        offRemainingNights: 10,
        lastMinuteRemainingNights: 6,
        offRemainingHolidayNights:1,
        peakRemainingHolidayNights:1,
        maximumStayLength: 14,

      },
      2026: {
        offSeason: '2/10',
        peakSeason: '3/15',
        peakHoliday: '4/20',
        offSeasonHoliday: '5/25',
        peakRemainingNights:15,
        offRemainingNights: 10,
        lastMinuteRemainingNights: 6,
        offRemainingHolidayNights:1,
        peakRemainingHolidayNights:1,
        maximumStayLength: 14,
      },
    },
    propertyShare:3,

    maxGuestsAllowed: 4,
    maxPetsAllowed: 2,
    share: 0,
    peakSeasonStartDate: '2024-03-15',
    peakSeasonEndDate: '2024-11-15',
  },
  {
    id: 4,
    name: ' Adventure Lake ',
    address: '123 Mock Lane',
    image: imageBlueBearLake,
    details: {
      2024: {
        offSeason: '2/10',
        peakSeason: '3/15',
        peakHoliday: '4/20',
        offSeasonHoliday: '5/25',
        peakRemainingNights: 10,
        offRemainingNights: 10,
        lastMinuteRemainingNights: 6,       
        offRemainingHolidayNights:1,
        peakRemainingHolidayNights:1,
        maximumStayLength: 14,
      },
      2025: {
        offSeason: '32/10',
        peakSeason: '32/15',
        peakHoliday: '43/20',
        offSeasonHoliday: '5/25',
        peakRemainingNights: 10,
        offRemainingNights: 10,
        lastMinuteRemainingNights: 6,
        offRemainingHolidayNights:1,
        peakRemainingHolidayNights:1,
        maximumStayLength: 14,

      },
      2026: {
        offSeason: '2/10',
        peakSeason: '3/15',
        peakHoliday: '4/20',
        offSeasonHoliday: '5/25',
        peakRemainingNights:15,
        offRemainingNights: 10,
        lastMinuteRemainingNights: 6,
        offRemainingHolidayNights:1,
        peakRemainingHolidayNights:1,
        maximumStayLength: 14,
      },
    },
    propertyShare:3,

    maxGuestsAllowed: 4,
    maxPetsAllowed: 2,
    share: 0,
    peakSeasonStartDate: '2024-03-15',
    peakSeasonEndDate: '2024-11-15',
  },
  {
    id: 5,
    name: ' The Paradise Shores ',
    address: '123 Mock Lane',
    image: imageCrownJewel,
    details: {
      2024: {
        offSeason: '2/10',
        peakSeason: '3/15',
        peakHoliday: '4/20',
        offSeasonHoliday: '5/25',
        peakRemainingNights: 10,
        offRemainingNights: 10,
        lastMinuteRemainingNights: 6,      
        offRemainingHolidayNights:1,
        peakRemainingHolidayNights:1,
        maximumStayLength: 14,
      },
      2025: {
        offSeason: '32/10',
        peakSeason: '32/15',
        peakHoliday: '43/20',
        offSeasonHoliday: '5/25',
        peakRemainingNights: 10,
        offRemainingNights: 10,
        lastMinuteRemainingNights: 6,        
        offRemainingHolidayNights:1,
        peakRemainingHolidayNights:1,
        maximumStayLength: 14,

      },
      2026: {
        offSeason: '2/10',
        peakSeason: '3/15',
        peakHoliday: '4/20',
        offSeasonHoliday: '5/25',
        peakRemainingNights:15,
        offRemainingNights: 10,
        lastMinuteRemainingNights: 6,
        offRemainingHolidayNights:1,
        peakRemainingHolidayNights:1,
        maximumStayLength: 14,
      },
    },
    propertyShare:3,

    maxGuestsAllowed: 4,
    maxPetsAllowed: 2,
    share: 0,
    peakSeasonStartDate: '2024-03-15',
    peakSeasonEndDate: '2024-11-15',
  },
  // {
  //   id: 6,
  //   name: ' The Crown Jewel ',
  //   address: '123 Mock Lane',
  //   image: imageParadiseShores,
  //   details: {
  //     2024: {
  //       offSeason: '2/10',
  //       peakSeason: '3/15',
  //       peakHoliday: '4/20',
  //       offSeasonHoliday: '5/25',
  //       peakRemainingNights: 10,
  //       offRemainingNights: 10,
  //       lastMinuteRemainingNights: 6,
  //       maximumStayLength: 14,
  //     },
  //     2025: {
  //       offSeason: '32/10',
  //       peakSeason: '32/15',
  //       peakHoliday: '43/20',
  //       offSeasonHoliday: '5/25',
  //       peakRemainingNights: 10,
  //       offRemainingNights: 10,
  //       lastMinuteRemainingNights: 6,
  //       maximumStayLength: 14,

  //     },
  //     2026: {
  //       offSeason: '2/10',
  //       peakSeason: '3/15',
  //       peakHoliday: '4/20',
  //       offSeasonHoliday: '5/25',
  //       peakRemainingNights:15,
  //       offRemainingNights: 10,
  //       lastMinuteRemainingNights: 6,
  //       maximumStayLength: 14,
  //     },
  //   },
  //   propertyShare:3,

  //   maxGuestsAllowed: 4,
  //   maxPetsAllowed: 2,
  //   share: 0,
  //   peakSeasonStartDate: '2024-03-15',
  //   peakSeasonEndDate: '2024-11-15',
  // },
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
      peakRemainingNights: number;
      offRemainingNights: number;
      lastMinuteRemainingNights: number;
      offRemainingHolidayNights: number;
      peakRemainingHolidayNights: number;
      maximumStayLength: number;
    };
  };
  propertyShare:number,

  maxGuestsAllowed: number;
  maxPetsAllowed: number;
  share: number;
  peakSeasonStartDate: string;
  peakSeasonEndDate: string;
}

interface PropertyState {
  cards: Card[];
  loading: boolean;
  error: string | null;
  selectedYear: number;
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
  selectedYear: new Date().getFullYear(),
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
              peakRemainingNights: userProp.peakRemainingNights,
              offRemainingNights: userProp.offRemainingNights,
              lastMinuteRemainingNights: userProp.lastMinuteRemainingNights,
              offRemainingHolidayNights: userProp.offRemainingHolidayNights,
              peakRemainingHolidayNights: userProp.peakRemainingHolidayNights,
              maximumStayLength: userProp.maximumStayLength,
              peakSeasonStartDate: property.peakSeasonStartDate,
              peakSeasonEndDate: property.peakSeasonEndDate,
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
              peakRemainingNights: 0,
              offRemainingNights: 0,
              lastMinuteRemainingNights: 0,
              offRemainingHolidayNights:0,
              peakRemainingHolidayNights: 0,
              maximumStayLength: 0,
              peakSeasonStartDate: property.peakSeasonStartDate,
              peakSeasonEndDate: property.peakSeasonEndDate,
            };
          } else {
            details[year].peakSeasonStartDate = property.peakSeasonStartDate;
            details[year].peakSeasonEndDate = property.peakSeasonEndDate;
          }
        });

        return {
          id: property.propertyId,
          name: property.propertyName || 'Unknown Property',
          address: `${property.address || 'Unknown'}`,
          image: getImageForProperty(property.propertyId),
          share: shareMap[2024] || 0, 
          details,
          maxGuestsAllowed: property.noOfGuestsAllowed || 0,
          maxPetsAllowed: property.noOfPetsAllowed || 0,
          propertyShare:property.propertyShare,
          peakSeasonStartDate: property.peakSeasonStartDate,
          peakSeasonEndDate: property.peakSeasonEndDate,
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
      return imageBlueBearLake ; 
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
  const selectedProperty = state.properties.cards.find(card => card.id === state.properties.selectedPropertyId);
  if (selectedProperty) {
    const currentYear = new Date().getFullYear();
    const relevantYears = [currentYear, currentYear + 1, currentYear + 2];
    
    const dynamicDetails = relevantYears.reduce((acc, year) => {
      if (selectedProperty.details[year]) {
        acc[year] = {
          ...selectedProperty.details[year],
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
