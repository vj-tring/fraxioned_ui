import { axiosInstance } from "../axiosSetup";

export const fetchHolidays = () => axiosInstance.get("/holidays");

export const addHoliday = (holidayData: {
  name: string;
  year: number;
  startDate: string | undefined;
  endDate: string | undefined;
  createdBy: { id: number };
  properties: { id: number }[];
}) => axiosInstance.post("/holidays/holiday", holidayData);

export const updateHoliday = (
  id: number,
  updatedHolidayData: {
    name: string;
    year: number;
    startDate: string | undefined;
    endDate: string | undefined;
    properties: { id: number }[];
    updatedBy: { id: number };
  }
) => axiosInstance.patch(`/holidays/holiday/${id}`, updatedHolidayData);

export const fetchHolidayById = (id: number) =>
  axiosInstance.get(`/holidays/holiday/${id}`);

export const deleteHoliday = (id: number) =>
  axiosInstance.delete(`/holidays/holiday/${id}`);
