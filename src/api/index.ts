import { axiosInstance } from "./axiosSetup";

export interface SpaceProperty {
    space: {
        id: number;
    };
    property: {
        id: number;
    };
    createdBy: {
        id: number;
    };
}

export interface Space {
    id?: number; // Optional for create and update
    name: string;
    isBedTypeAllowed: boolean;
    isBathroomTypeAllowed: boolean;
}

// login api
export const loginUser = (email: string, password: string) =>
    axiosInstance.post('/authentication/login', { email, password });

// forgetpassword api
export const forgetPasswordApi = (email: string) =>
    axiosInstance.post('/authentication/forgotPassword', { email });

// resetpassword
export const resetPasswordApi = (oldPassword: string, newPassword: string, userId: number) =>
    axiosInstance.post('/authentication/resetPassword', { oldPassword, newPassword, userId })

// recoverpassword
export const recoverPasswordApi = (newPassword: string) =>
    axiosInstance.post('/authentication/recoverPassword', { newPassword });

//  properties api
export const getProperties = () =>
    axiosInstance.get('/properties');

// roles api
export const getRoles = () =>
    axiosInstance.get('/roles');


//sendinvite api
export const sendInvite = async (payload: any) =>
    axiosInstance.post('/authentication/invite', payload);

//logout api
export const logoutUserApi = (token: string) =>
    axiosInstance.post('/authentication/logout', { sessionToken: token });

export const propertywithDetails = () =>
    axiosInstance.get('/properties/user-properties-with-details');

export const fetchHolidaysApi = () =>
    axiosInstance.get('/holidays');

//adding holiday api
export const addHolidayApi = (holidayData: {
    name: string;
    year: number;
    startDate: string | undefined;
    endDate: string | undefined;
    createdBy: { id: number };
    properties: { id: number }[];
}) => axiosInstance.post('/holidays/holiday', holidayData);

//updating holiday api
export const updateHolidaysApi = (id: number, updatedHolidayData: { name: string; year: number; startDate: string | undefined; endDate: string | undefined; properties: { id: number; }[]; updatedBy: { id: number; }; }) =>
    axiosInstance.patch(`/holidays/holiday/${id}`, updatedHolidayData);


//deleting holiday api
export const deleteHolidayApi = (id: number) =>
    axiosInstance.delete(`/holidays/holiday/${id}`);

//fetching proeprty in edit 
export const fetchpropertyHolidaysApi = (id: number) =>
    axiosInstance.get(`/holidays/holiday/${id}`);

//delete the holiday which has no mapping
export const deleteHolidaysApi = (id: number) =>
    axiosInstance.delete(`/holidays/holiday/${id}`);

//propertyholiday api
export const propertyseasonholiday = () =>
    axiosInstance.get('/property-season-holidays');

//propertyholiday delete api
export const propertyseasonholidaydelete = (id: number) =>
    axiosInstance.delete(`/property-season-holidays/property-season-holiday/${id}`);

export const getPropertySeasonHoliday = (propertyId: number) =>
    axiosInstance.get(`/property-season-holidays/property/${propertyId}`);

//create booking
export const createBooking = (bookingData: void) =>
    axiosInstance.post(`/bookings/booking`, bookingData);

//cancel Booking
export const cancelBooking = (bookingId: number, userId: number) =>
    axiosInstance.post(`/bookings/${bookingId}/${userId}/cancel`);

//modify Booking

export const modifyBooking = (bookingId: number, updatedBookingData: any) =>
    axiosInstance.patch(`/bookings/booking/${bookingId}`, updatedBookingData);

//transaction details
export const createBookingSummary = (bookingData: void) =>
    axiosInstance.post(`/bookings/booking/booking-summary`, bookingData);

//get all bookings
export const getBookings = () =>
    axiosInstance.get('/bookings');

export const getUserProperties = (id: number) =>
    axiosInstance.get(`/properties/${id}/user-properties-with-details`);

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
}) => axiosInstance.post('/properties/property', propertyData);

export const updatePropertyImage = (id: number, formData: FormData) =>
    axiosInstance.patch(`/properties/property/${id}`, formData);

export const deletePropertyApi = (id: number) =>
    axiosInstance.delete(`/properties/property/${id}`);

//fetching property basic details by id
export const getPropertyById = (id: number) =>
    axiosInstance.get(`/properties/property/${id}`);

export const updatePropertyapi = (id: number, data: any) =>
    axiosInstance.patch(`/properties/property/${id}`, data);

export const userdetails = () =>
    axiosInstance.get('/users');

//propertydetails by id api
export const getProperrtDetailsbyId = (id: number) =>
    axiosInstance.get(`/property-details/property-detail/${id}`);

export const updaterulesapi = (id: number, data: any) =>
    axiosInstance.patch(`/property-details/property-detail/${id}`, data);

export const deleteUserApi = (id: number) =>
    axiosInstance.delete(`/users/user/${id}`);

export const getUserById = (id: number) =>
    axiosInstance.get(`/users/user/${id}`);

export const updateuserapi = (id: number, data: any) =>
    axiosInstance.patch(`/users/user/${id}`, data);

export const propertydetailsapi = () =>
    axiosInstance.get(`/properties/properties-with-details`);

export const amenitiesapi = () =>
    axiosInstance.get(`/amenities`);

export const propertyAmenitiesapi = (id: number) =>
    axiosInstance.get(`/property-space-amenities/property/${id}`);

export const getpropertyamenityByid = () =>
    axiosInstance.get(`/property-amenities`);

export const getAmenitiesById = (id: number) =>
    axiosInstance.get(`/property-space-amenities/property-space-amenity/${id}`);

export const getuserbyproperty = (id: number) =>
    axiosInstance.get(`/properties/property/${id}/details`);

export const addamenity = (data: {
    amenityGroup: { id: number };
    createdBy: { id: number };
    amenityName: string;
    amenityDescription: string;
}) => axiosInstance.post('/amenities/amenity', data);

export const updateamenityforproperty = (updateData: {
    property: {
        id: number;
    };
    propertySpace: {
        id: null;
    };
    amenities: {
        id: number;
    }[];
    updatedBy: {
        id: number;
    };
}) => axiosInstance.patch(`/property-amenities`, updateData);


export const updateamenities = (id: number, updateData: {
    updatedBy: { id: number };
    amenityName: string;
    amenityDescription: string;
    amenityGroup: { id: number };
}) => axiosInstance.patch(`/amenities/amenity/${id}`, updateData);

export const propertyImageapi = (propertyId: number) =>
    axiosInstance.get(`/property-space-images/property/${propertyId}/images`);

export const deleteAmenity = (id: number) =>
    axiosInstance.delete(`/amenities/amenity/${id}`);

export const getpropertyImageById = (id: number) =>
    axiosInstance.get(`/property-images/property-image/${id}`);

export const propertyImageuploadapi = (formData: FormData) => {
    console.log('to backend', formData)
    return axiosInstance.post(`/property-images`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': '*/*'
        }
    });
};
export const propertyImageeditapi = (id: number, formData: FormData) => {
    console.log('to backend', formData);
    return axiosInstance.patch(`/property-images/property-image/${id}`, formData);
};

export const deletetpropertyImageById = (id: number) =>
    axiosInstance.delete(`/property-images/property-image/${id}`);

export const getUserBookings = (userId: number) =>
    axiosInstance.get(`/bookings/user/${userId}`);

export const propertyspaceapi = () =>
    axiosInstance.get(`/spaces`);

export const propertyspacetypesapi = () =>
    axiosInstance.get(`/space-types`);

export const getPropertyDocuments = () =>
    axiosInstance.get('/propertyDocuments');

export const getPropertyDocument = (id: number) =>
    axiosInstance.get(`/propertyDocuments/propertyDocument/${id}`);

export const createPropertyDocument = (formData: FormData) =>
    axiosInstance.post('/propertyDocuments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

export const updatePropertyDocument = (id: number, formData: FormData) =>
    axiosInstance.patch(`/propertyDocuments/propertyDocument/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

export const deletePropertyDocument = (id: number) =>
    axiosInstance.delete(`/propertyDocuments/propertyDocument/${id}`);

export const getpropertycodes = () =>
    axiosInstance.get(`/property-codes`);

export const userbookingCancelapi = (id: number, user: number) => {
    return axiosInstance.post(`/bookings/${id}/${user}/cancel`);
};

//add amenity group
export const addamenitygroup = (data: {
    createdBy: { id: number };
    name: string;
}) => axiosInstance.post('/amenity-groups/amenity-group', data);

//get all amenity groups
export const getamenitygroup = () =>
    axiosInstance.get(`/amenity-groups`);


export const getamenitygroupbyId = (id: number) =>
    axiosInstance.get(`/amenity-groups/amenity-group/${id}`);


// Space CRUD API's

// Create Space API
export const createSpace = (spaceData: FormData) =>
    axiosInstance.post(`/spaces/space`, spaceData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

// Get all spaces
export const getAllSpaces = () =>
    axiosInstance.get(`/spaces`);

// Update a space by ID
export const updateSpace = (id: number, spaceData: FormData) =>
    axiosInstance.put(`/spaces/space/${id}`, spaceData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

// Delete a space by ID
export const deleteSpace = (id: number) =>
    axiosInstance.delete(`/spaces/space/${id}`);

// Space-Property CRUD API's

// Create Space Property API
export const createSpaceProperty = (spacePropertyData: SpaceProperty) =>
    axiosInstance.post(`/property-spaces/property-space`, spacePropertyData);

// Get All Space Properties API
export const getAllSpaceProperties = () =>
    axiosInstance.get(`/property-spaces`);

// Get Property Space by PropertyID

export const getAllSpacePropertiesById = (propertyId: number) =>
    axiosInstance.get(`/property-spaces/property/${propertyId}`);

// Delete Space Property API
export const deleteSpaceProperty = (id: number) =>
    axiosInstance.delete(`/property-spaces/property-space/${id}`);

// Property Space CRUD

// Create Property Space Image

export const propertySpaceImageuploadapi = (formData: FormData) => {
    return axiosInstance.post(`/property-space-images`, formData, {
    });
};

export const getAllSpacePropertyImages = () => {
    return axiosInstance.get(`/property-space-images`)
};

export const getAllSpacePropertyImageById = (propertyId: number) => {
    return axiosInstance.get(`/property-space-images/property/${propertyId}/images`)
};


