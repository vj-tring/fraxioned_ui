// redux/propertyImagesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction, AsyncThunkAction  } from '@reduxjs/toolkit';
import { propertyImageapi } from '@/api/api-endpoints';
import { RootState } from '@/store/reducers';

interface PropertyImage {
  id: number;
  url: string;
  description: string;
  propertySpace: {
    id: number;
    instanceNumber: number;
    space: {
      id: number;
      name: string;
    };
  };
}

interface SpaceGroup {
  name: string;
  instances: {
    instanceNumber: number;
    images: PropertyImage[];
  }[];
}

interface PropertyImagesState {
  imagesBySpace: {
    [key: string]: SpaceGroup;
  };
  loading: boolean;
  error: string | null;
}

const initialState: PropertyImagesState = {
  imagesBySpace: {},
  loading: false,
  error: null,
};

// Async thunk to fetch property images
export const fetchPropertyImages = createAsyncThunk(
  'propertyImages/fetchPropertyImages',
  async (propertyId: number, { rejectWithValue }) => {
    try {
      const response = await propertyImageapi(propertyId);
      return response.data.data;
    } catch (error) {
      console.error("Fetching property images failed:", error);
      return rejectWithValue("Failed to fetch property images");
    }
  }
);

const propertyImagesSlice = createSlice({
  name: 'propertyImages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPropertyImages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPropertyImages.fulfilled, (state, action: PayloadAction<PropertyImage[]>) => {
        const allPhotos = action.payload;
        const groupedBySpace = allPhotos.reduce(
          (acc: { [key: string]: SpaceGroup }, img: PropertyImage) => {
            const spaceName = img.propertySpace.space.name;
            if (!acc[spaceName]) {
              acc[spaceName] = { name: spaceName, instances: [] };
            }

            let instance = acc[spaceName].instances.find(
              (i) => i.instanceNumber === img.propertySpace.instanceNumber
            );

            if (!instance) {
              instance = {
                instanceNumber: img.propertySpace.instanceNumber,
                images: [],
              };
              acc[spaceName].instances.push(instance);
            }

            instance.images.push(img);
            return acc;
          },
          {}
        );

        state.imagesBySpace = {
          "All Photos": {
            name: "All Photos",
            instances: [{ instanceNumber: 0, images: allPhotos }],
          },
          ...groupedBySpace,
        };
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchPropertyImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectPropertyImages = (state: RootState) => state.propertyImages.imagesBySpace;
export const selectLoading = (state: RootState) => state.propertyImages.loading;

export default propertyImagesSlice.reducer;