import { axiosInstance } from "../axiosSetup";
import { UpdateAmenityPayload } from "../slice/auth/propertyamenities";

export const getPropertyAmenitiesByPropertyId = (id: number) =>
  axiosInstance.get(`/property-space-amenities/property/${id}`);

export const getAmenitiesByPropertySpaceId = (propertySpaceId: number) =>
  axiosInstance.get(
    `/property-space-amenities/property-space/${propertySpaceId}`
  );

export const updateAmenitiesForProperty = (updateData: UpdateAmenityPayload) =>
  axiosInstance.patch(`/property-space-amenities`, updateData);
