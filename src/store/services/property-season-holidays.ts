import { axiosInstance } from "../axiosSetup";

export const getAllPropertySeasonHoliday = () =>
  axiosInstance.get("/property-season-holidays");

export const deletePropertySeasonHoliday = (id: number) =>
  axiosInstance.delete(
    `/property-season-holidays/property-season-holiday/${id}`
  );

export const getPropertySeasonHolidayByPropertyId = (propertyId: number) =>
  axiosInstance.get(`/property-season-holidays/property/${propertyId}`);
