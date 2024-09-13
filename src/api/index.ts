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
    axiosInstance.get('/v1/properties/user-properties-with-details');

export const fetchHolidaysApi = () =>
    axiosInstance.get('/v1/holidays');

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

//delete the holiday which has no mapping
export const deleteHolidaysApi = (id: number) =>
    axiosInstance.delete(`/v1/holidays/holiday/${id}`);

//propertyholiday api
export const propertyseasonholiday = (p0?: string) =>
    axiosInstance.get('/v1/property-season-holidays');

//propertyholiday delete api
export const propertyseasonholidaydelete = (id: number) =>
    axiosInstance.delete(`/v1/property-season-holidays/property-season-holiday/${id}`);

export const getPropertySeasonHoliday = (propertyId: number) =>
    axiosInstance.get(`/v1/property-season-holidays/property/${propertyId}`);

export const createBooking = (bookingData: void) =>
    axiosInstance.post(`/v1/bookings/booking`, bookingData);

export const createBookingSummary = (bookingData: void) =>
    axiosInstance.post(`/v1/bookings/booking/booking-summary`, bookingData);

export const getBookings = () =>
    axiosInstance.get('/v1/bookings');

export const getUserProperties = (id: number) =>
    axiosInstance.get(`/v1/properties/${id}/user-properties-with-details`);

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

//fetching property basic details by id
export const getPropertyById = (id: number) =>
    axiosInstance.get(`/v1/properties/property/${id}`);

export const updatePropertyapi = (id: number, data: any) =>
    axiosInstance.patch(`/v1/properties/property/${id}`, data);

export const userdetails = () =>
    axiosInstance.get('/v1/users');

//propertydetails by id api
export const getProperrtDetailsbyId = (id: number) =>
    axiosInstance.get(`/v1/property-details/property-detail/${id}`);

export const updaterulesapi = (id: number, data: any) =>
    axiosInstance.patch(`/v1/property-details/property-detail/${id}`, data);

export const deleteUserApi = (id: number) =>
    axiosInstance.delete(`/v1/users/user/${id}`);

export const getUserById = (id: number) =>
    axiosInstance.get(`/v1/users/user/${id}`);

export const updateuserapi = (id: number, data: any) =>
    axiosInstance.patch(`/v1/users/user/${id}`, data);

export const propertydetailsapi = () =>
    axiosInstance.get(`/v1/properties/properties-with-details`);

export const amenitiesapi = () =>
    axiosInstance.get(`/v1/amenities`);

export const getpropertyamenityByid = () =>
    axiosInstance.get(`/v1/property-amenities`);

export const getAmenitiesById = (id: number) =>
    axiosInstance.get(`/v1/property-amenities/property/${id}`);

export const addamenity = (data: {
    createdBy: { id: number };
    amenityName: string;
    amenityDescription: string;
    amenityType: string;
}) => axiosInstance.post('/v1/amenities/amenity', data);

export const updateamenityforproperty = (updateData: { property: { id: number; }; amenities: { id: number; }[]; updatedBy: { id: number; }; }) =>
    axiosInstance.patch(`/v1/property-amenities`, updateData);

export const updateamenities = (id: number, updateData: {
    updatedBy: { id: number };
    amenityName: string;
    amenityDescription: string;
    amenityType: string;
}) => axiosInstance.patch(`/v1/amenities/amenity/${id}`, updateData);

export const propertyImageapi = () =>
    axiosInstance.get(`/v1/propertyImages`);

export const deleteAmenity = (id: number) =>
    axiosInstance.delete(`/v1/amenities/amenity/${id}`);

export const getpropertyImageById = (id: number) =>
    axiosInstance.get(`/v1/propertyImages/propertyImage/${id}`);

export const propertyImageuploadapi = (formData: FormData) => {
    console.log('to backend', formData)
    return axiosInstance.post(`/v1/propertyImages`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': '*/*'
        }
    });
};
export const propertyImageeditapi = (id: number, formData: FormData) => {
    console.log('to backend', formData);
    return axiosInstance.patch(`/v1/propertyImages/propertyImage/${id}`, formData);
};

export const deletetpropertyImageById = (id: number) =>
    axiosInstance.delete(`/v1/propertyImages/propertyImage/${id}`);

export const getUserBookings = (userId: number) =>
    axiosInstance.get(`/v1/bookings/user/${userId}`);

export const propertyspaceapi = () =>
    axiosInstance.get(`/v1/spaces`);

export const propertyspacetypesapi = () =>
    axiosInstance.get(`/v1/space-types`);

