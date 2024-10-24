import { axiosInstance } from "../axiosSetup";
import {
    CreateOrDeletePropertySpaceBathroomsDto,
    CreatePropertySpaceBathroomDto,
    UpdatePropertySpaceBathroomDto,
} from '../model'

export const createPropertySpaceBathroom = (
  data: CreatePropertySpaceBathroomDto
) =>
  axiosInstance.post("/property-space-bathrooms/property-space-bathroom", data);

export const getAllPropertySpaceBathroom = () =>
  axiosInstance.get("/property-space-bathrooms");

export const getAllPropertySpaceBathroomsByPropertySpace = (
  propertySpaceId: number
) =>
  axiosInstance.get(
    `/property-space-bathrooms/property-space/${propertySpaceId}/bathrooms`
  );

export const getPropertySpaceBathroomById = (id: number) =>
  axiosInstance.get(`/property-space-bathrooms/property-space-bathroom/${id}`);

export const updatePropertySpaceBathroomById = (
  id: number,
  data: UpdatePropertySpaceBathroomDto
) =>
  axiosInstance.patch(
    `/property-space-bathrooms/property-space-bathroom/${id}`,
    data
  );

export const deletePropertySpaceBathroomById = (id: number) =>
  axiosInstance.delete(
    `/property-space-bathrooms/property-space-bathroom/${id}`
  );

export const createOrDeletePropertySpaceBathrooms = (
  data: CreateOrDeletePropertySpaceBathroomsDto
) => axiosInstance.patch("/property-space-bathrooms", data);
