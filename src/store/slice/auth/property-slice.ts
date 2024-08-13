import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { propertywithDetails } from '../../../api/index';
import imageParadiseShores from '../../../assests/bear-lake-bluffs.jpg'
import imageBlueBearLake from '../../../assests/blue-bear-lake.jpg'
import imageCrownJewel from '../../../assests/crown-jewel.jpg'
import imageLakeEscape from '../../../assests/lake-escape.jpg'




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
}

interface PropertyState {
  cards: Card[];
  loading: boolean;
  error: string | null;
}

const initialState: PropertyState = {
  cards: [],
  loading: false,
  error: null,
};


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
    },
];

// Async thunk for fetching properties
export const fetchProperties = createAsyncThunk(
  'properties/fetchProperties',
  async (_, { rejectWithValue }) => {
    try {
      const response = await propertywithDetails();

      if (!Array.isArray(response.data)) {
        throw new Error("Unexpected data format");
      }

      if (response.data.length === 0) {
        return mockData;
      }

      const combinedData: Card[] = response.data.map((property: any) => {
        // Map property to Card format
        return {
          id: property.propertyId,
          name: property.propertyName || 'Unknown Property',
          address: `${property.address || 'Unknown'}, ${property.city || 'Unknown'}, ${property.state || 'Unknown'}, ${property.country || 'Unknown'}, ${property.zipcode || 'Unknown'}`,
          image: getImageForProperty(property.propertyId),
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
        };
      });

      return combinedData;
    } catch (error) {
      console.error("Fetching properties failed:", error);
      return mockData;  // Fallback to mock data
    }
  }
);

// Helper function to determine image for property
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
      return imageLakeEscape; // Default image
  }
};

// Create slice
const propertySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {},
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

export default propertySlice.reducer;