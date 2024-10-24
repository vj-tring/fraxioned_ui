import { axiosInstance } from "../axiosSetup";

export const getBookingsReport = (requestData: any) =>
  axiosInstance.post("/bookings-report", requestData, {
    responseType: "blob",
  });
