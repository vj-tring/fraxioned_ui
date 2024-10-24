import { axiosInstance } from "../axiosSetup";

export const getProperties = () => axiosInstance.get("/properties");

export const getUserProperties = (id: number) =>
  axiosInstance.get(`/properties/${id}/user-properties-with-details`);

export const createProperty = (propertyData: {
  createdBy: { id: number };
  propertyName: string;
  ownerRezPropId: number;
  address: string;
  city: string;
  state: string;
  country: string;
  zipcode: number;
  houseDescription: string;
  isExclusive: boolean;
  propertyShare: number;
  latitude: number;
  longitude: number;
  isActive: boolean;
  displayOrder: number;
}) => axiosInstance.post("/properties/property", propertyData);

export const updatePropertyImage = (id: number, formData: FormData) =>
  axiosInstance.patch(`/properties/property/${id}`, formData);

export const deleteProperty = (id: number) =>
  axiosInstance.delete(`/properties/property/${id}`);

export const getPropertyById = (id: number) =>
  axiosInstance.get(`/properties/property/${id}`);

export const getPropertyWithDetails = () =>
  axiosInstance.get(`/properties/properties-with-details`);

export const getUserByProperty = (id: number) =>
  axiosInstance.get(`/properties/property/${id}/details`);
