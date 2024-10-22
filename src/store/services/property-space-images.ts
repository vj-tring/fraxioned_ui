import { axiosInstance } from "../axiosSetup";

// Get All Space Property Images
export const fetchAllPropertySpaceImages = () =>
  axiosInstance.get("/property-space-images");

// Upload Property Space Images (Create)
export const propertySpaceImageUpload = (formData: FormData) => {
  return axiosInstance.post(`/property-space-images`, formData, {});
};

// Get Property Space Images by Property ID
export const fetchPropertySpaceImagesByPropertyId = (propertyId: number) =>
  axiosInstance.get(`/property-space-images/property/${propertyId}/images`);

// Update Space Image Details with Image (Patch)
export const updatePropertySpaceImageById = (
  imageId: number,
  formData: FormData
) =>
  axiosInstance.patch(
    `/property-space-images/property-space-image/${imageId}`,
    formData
  );
// Delete Space Image by ID (Single)
export const deletePropertySpaceImageById = (id: number) =>
  axiosInstance.delete(`/property-space-images/property-space-images/${id}`);
// Delete Multiple Space Images (Batch Delete)
export const deleteMultiplePropertySpaceImages = (spaceImages: {
  ids: number[];
}) => axiosInstance.delete(`/property-space-images`, { data: spaceImages });
