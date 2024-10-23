import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  AsyncThunkAction,
} from "@reduxjs/toolkit";
import { fetchPropertySpaceImagesByPropertyId } from "@/api/api-endpoints";
import { RootState } from "@/store/reducers";

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
  "propertyImages/fetchPropertyImages",
  async (propertyId: number, { rejectWithValue }) => {
    try {
      const response = await fetchPropertySpaceImagesByPropertyId(propertyId);
      return response.data.data;
    } catch (error) {
      console.error("Fetching property images failed:", error);
      return rejectWithValue("Failed to fetch property images");
    }
  }
);

const propertyImagesSlice = createSlice({
  name: "propertyImages",
  initialState,
  reducers: {
    removeImageById: (state, action: PayloadAction<number>) => {
      const imageId = action.payload;
      Object.values(state.imagesBySpace).forEach((spaceGroup) => {
        spaceGroup.instances.forEach((instance) => {
          instance.images = instance.images.filter(
            (image) => image.id !== imageId
          );
        });
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPropertyImages.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchPropertyImages.fulfilled,
        (
          state,
          action: PayloadAction<{
            propertyAdditionalImages: PropertyImage[];
            propertySpaceImages: PropertyImage[];
          }>
        ) => {
          const { propertyAdditionalImages, propertySpaceImages } =
            action.payload;

          // Process property space images
          const groupedBySpace = propertySpaceImages.reduce(
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

          // Combine additional images with grouped images
          state.imagesBySpace = {
            "All Photos": {
              name: "All Photos",
              instances: [
                {
                  instanceNumber: 0,
                  images: [...propertyAdditionalImages, ...propertySpaceImages],
                },
              ],
            },
            ...groupedBySpace,
            
            "Additional Photos": {
              name: "Additional Photos",
              instances: [
                {
                  instanceNumber: 0,
                  images: [...propertyAdditionalImages], // Store only additional images here
                },
              ],
            },
          };
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(fetchPropertyImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectPropertyImages = (state: RootState) =>
  state.propertyImages.imagesBySpace;
export const selectLoading = (state: RootState) => state.propertyImages.loading;

export default propertyImagesSlice.reducer;
export const { removeImageById } = propertyImagesSlice.actions;
