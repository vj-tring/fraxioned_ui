import { axiosInstance } from "../axiosSetup";

export const getPropertyDetailsbyId = (id: number) =>
  axiosInstance.get(`/property-details/property-detail/${id}`);

export const updatePropertyDetails = (id: number, data: any) =>
  axiosInstance.patch(`/property-details/property-detail/${id}`, data);
