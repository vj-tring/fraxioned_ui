import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getUserProperties } from '../../../api/index';
import imageParadiseShores from '../../../assests/bear-lake-bluffs.jpg';
import imageBlueBearLake from '../../../assests/blue-bear-lake.jpg';
import imageCrownJewel from '../../../assests/crown-jewel.jpg';
import imageLakeEscape from '../../../assests/lake-escape.jpg';

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

const mockData: Card[] = [
  {
    id: 1,
    name: "Paradise Shores (tenths)",
    address: "5367 S. Cyan Lane, St. George, Utah, United States, 84790",
    image: imageParadiseShores,
    details: {
      2024: {
        offSeason: "4/10",
        peakSeason: "2/33",
        peakHoliday: "1/1",
        offSeasonHoliday: "0/0",
      },
      2025: {
        offSeason: "0",
        peakSeason: "0",
        peakHoliday: "0",
        offSeasonHoliday: "0",
      },
      2026: {
        offSeason: "0",
        peakSeason: "0",
        peakHoliday: "0",
        offSeasonHoliday: "0",
      },
    },
    maxGuestsAllowed: 10,  // Example mock data
    maxPetsAllowed: 2,     // Example mock data
  },
  {
    id: 2,
    name: "Blue Bear Lake",
    address: "5367 S. Cyan Lane, St. George, Utah, United States, 84790",
    image: imageBlueBearLake,
    details: {
      2024: {
        offSeason: "3/10",
        peakSeason: "2/33",
        peakHoliday: "1/1",
        offSeasonHoliday: "0/0",
      },
      2025: {
        offSeason: "0",
        peakSeason: "0",
        peakHoliday: "0",
        offSeasonHoliday: "0",
      },
      2026: {
        offSeason: "0",
        peakSeason: "0",
        peakHoliday: "0",
        offSeasonHoliday: "0",
      },
    },
    maxGuestsAllowed: 10,  // Example mock data
    maxPetsAllowed: 2,  
  },

    {
      id: 3,
      name: "Lake Escape",
      address: "5367 S. Cyan Lane, St. George, Utah, United States, 84790",
      image: imageLakeEscape,
      details: {
        2024: {
          offSeason: "3/10",
          peakSeason: "2/33",
          peakHoliday: "1/1",
          offSeasonHoliday: "0/0",
        },
        2025: {
          offSeason: "0",
          peakSeason: "0",
          peakHoliday: "0",
          offSeasonHoliday: "0",
        },
        2026: {
          offSeason: "0",
          peakSeason: "0",
          peakHoliday: "0",
          offSeasonHoliday: "0",
        },
      },
      maxGuestsAllowed: 10,  // Example mock data
      maxPetsAllowed: 2,  
    },
    {
      id: 4,
      name: "The Crown Jewel",
      address: "5367 S. Cyan Lane, St. George, Utah, United States, 84790",
      image: imageCrownJewel,
      details: {
        2024: {
          offSeason: "3/10",
          peakSeason: "2/33",
          peakHoliday: "1/1",
          offSeasonHoliday: "0/0",
        },
        2025: {
          offSeason: "0",
          peakSeason: "0",
          peakHoliday: "0",
          offSeasonHoliday: "0",
        },
        2026: {
          offSeason: "0",
          peakSeason: "0",
          peakHoliday: "0",
          offSeasonHoliday: "0",
        },
        
      },
      maxGuestsAllowed: 10,  // Example mock data
      maxPetsAllowed: 2,  
    },
  
  // Add mock data for other properties if needed
];

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
      if (!Array.isArray(response.data)) {
        throw new Error("Unexpected data format");
      }

      const combinedData: Card[] = response.data.map((property: any) => {
        return {
          id: property.propertyId,
          name: property.propertyName || 'Unknown Property',
          address: `${property.address || 'Unknown'}, ${property.city || 'Unknown'}, ${property.state || 'Unknown'}, ${property.country || 'Unknown'}, ${property.zipcode || 'Unknown'}`,
          image: getRandomImage(),
          share:property.propertyShare.toString(),
          details: {
            2024: {
              offSeason: (property.offSeasonAllottedNights || '0/0').toString(),
              peakSeason: (property.peakSeasonAllottedNights || '0/0').toString(),
              peakHoliday: (property.peakSeasonAllottedHolidayNights || '0/0').toString(),
              offSeasonHoliday: (property.offSeasonAllottedHolidayNights || '0/0').toString(),
            },
            2025: {
              offSeason: (property.offSeasonAllottedNights || '0/0').toString(),
              peakSeason: (property.peakSeasonAllottedNights || '0/0').toString(),
              peakHoliday: (property.peakSeasonAllottedHolidayNights || '0/0').toString(),
              offSeasonHoliday: (property.offSeasonAllottedHolidayNights || '0/0').toString(),
            },
            2026: {
              offSeason: (property.offSeasonAllottedNights || '0/0').toString(),
              peakSeason: (property.peakSeasonAllottedNights || '0/0').toString(),
              peakHoliday: (property.peakSeasonAllottedHolidayNights || '0/0').toString(),
              offSeasonHoliday: (property.offSeasonAllottedHolidayNights || '0/0').toString(),
            },
          },
          maxGuestsAllowed: property.noOfGuestsAllowed || 0,
          maxPetsAllowed: property.noOfPetsAllowed
          || 0,
        };
      });

      return combinedData;
    } catch (error) {
      console.error("Fetching properties failed:", error);
      return mockData;  
    }
  }
);
const getRandomImage = (): string => {
  const images = [
    imageParadiseShores,
    imageBlueBearLake,
    imageCrownJewel,
    imageLakeEscape
  ];
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
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
