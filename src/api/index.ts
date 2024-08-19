import axiosInstance from "./axiosSetup";

// login api
export const loginUser = (email: string, password: string) =>
    axiosInstance.post('/v1/authentication/login', { email, password });

// forgetpassword api
export const forgetPasswordApi = (email: string) =>
    axiosInstance.post('/v1/authentication/forgotPassword', { email });

// resetpassword
export const resetPasswordApi = (oldPassword: string, newPassword: string, userId: number) =>
    axiosInstance.post('/v1/authentication/resetPassword', { oldPassword, newPassword, userId })

// recoverpassword
export const recoverPasswordApi = (newPassword: string) =>
    axiosInstance.post('/v1/authentication/recoverPassword', { newPassword });

//  properties api
export const getProperties = () =>
    axiosInstance.get('/v1/properties');

// roles api
export const getRoles = () =>
    axiosInstance.get('/v1/roles');

//sendinvite api
export const sendInvite = async (payload: any) =>
    axiosInstance.post('/v1/authentication/invite', payload);

//logout api
export const logoutUserApi = (token: string) =>
    axiosInstance.post('/v1/authentication/logout', { sessionToken: token });

export const propertywithDetails = () =>
    axiosInstance.get('/v1/properties/properties-with-details');

export const fetchHolidaysApi = () =>
    axiosInstance.get('/v1/holidays/holiday');

//adding holiday api
export const addHolidayApi = (holidayData: { name: string; year: number; startDate: string | undefined; endDate: string | undefined; createdBy: { id: number; }; }) =>
    axiosInstance.post('/v1/holidays/holiday', holidayData);

//updating holiday api
export const updateHolidaysApi = (id: number, updatedHolidayData: { name: string; year: number; startDate: string | undefined; endDate: string | undefined; properties: { id: number; }[]; updatedBy: { id: number; }; }) =>
    axiosInstance.patch(`/v1/holidays/holiday/${id}`, updatedHolidayData);

//deleting holiday api
export const deleteHolidayApi = (id: number) =>
    axiosInstance.delete(`/v1/holidays/holiday/${id}`);

//fetching proeprty in edit 
export const fetchpropertyHolidaysApi = (id: number) =>
    axiosInstance.get(`/v1/holidays/holiday/${id}`);

//propertyholiday api
export const propertyseasonholiday = () =>
    axiosInstance.get('/v1/property-season-holidays/property-season-holiday');

//propertyholiday delete api
export const propertyseasonholidaydelete = (id: number) =>
    axiosInstance.delete(`/v1/property-season-holidays/property-season-holiday/${id}`);

export const getUserProperties = (id: number) =>
    axiosInstance.get(`/v1/properties/${id}/properties-with-details`);

export const addPropertyApi = (propertyData: {
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
}) => axiosInstance.post('/v1/properties/property', propertyData);

export const deletePropertyApi = (id: number) =>
    axiosInstance.delete(`/v1/properties/property/${id}`);



