import { axiosInstance } from "../axiosSetup";

export const getAllUserProperties = () => axiosInstance.get("/user-properties");


export const createUserProperty = (createUserPropertyDto: any) =>
  axiosInstance.post("/user-property", createUserPropertyDto);

export const updateUserProperty = (id: number, updateUserPropertyDto: any) =>
  axiosInstance.patch(`/user-property/${id}`, updateUserPropertyDto);

export const deleteUserProperty = (userId: number, propertyId: number) =>
  axiosInstance.delete(`/user-property/user/${userId}/property/${propertyId}`);
