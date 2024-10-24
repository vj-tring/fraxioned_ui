import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PropertyImage, PropertyImagesState, SpaceGroup } from "@/store/model/property-images.types";
import { fetchPropertyImages } from "./action";
import { RootState } from "@/store/reducers";

const initialState: PropertyImagesState = {
  imagesBySpace: {},
  loading: false,
  error: null,
};

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
                  images: [...propertyAdditionalImages],
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

// Selectors
export const selectPropertyImages = (state: RootState) =>
  state.propertyImages.imagesBySpace;
export const selectLoading = (state: RootState) => state.propertyImages.loading;

export const { removeImageById } = propertyImagesSlice.actions;
export default propertyImagesSlice.reducer;