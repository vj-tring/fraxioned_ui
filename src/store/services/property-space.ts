import { axiosInstance } from "../axiosSetup";
import { SpaceProperty } from "../model";

export const createSpaceProperty = (spacePropertyData: SpaceProperty) =>
    axiosInstance.post(`/property-spaces/property-space`, spacePropertyData);

export const getAllSpaceProperties = () =>
    axiosInstance.get(`/property-spaces`);

export const getAllSpacePropertiesById = (propertyId: number) =>
    axiosInstance.get(`/property-spaces/property/${propertyId}`);

export const deleteSpaceProperty = (id: number) =>
    axiosInstance.delete(`/property-spaces/property-space/${id}`);