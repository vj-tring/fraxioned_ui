import { axiosInstance } from "../axiosSetup";

export const getUserProperties = () => 
  axiosInstance.get('/user-properties');

export const getUserPropertiesWithDetailsByUser = (userId: number) =>
  axiosInstance.get(`/properties/${userId}/user-properties-with-details`);

export const createUserProperty = (createUserPropertyDto: any) =>
  axiosInstance.post('/user-properties/user-property', createUserPropertyDto);

export const updateUserProperty = (id: number, updateUserPropertyDto: any) =>
  axiosInstance.patch(`/user-properties/user-property/${id}`, updateUserPropertyDto);

export const deleteUserProperty = (userId: number, propertyId: number) =>
  axiosInstance.delete(`/user-properties/user-property/user/${userId}/property/${propertyId}`);