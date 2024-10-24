import { UpdateAmenityPayload } from "@/store/slice/auth/propertyamenities";
import { axiosInstance } from "../axiosSetup";
import { ContactMessage } from "@/store/model/contact-message";

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

interface EditPropertyCodePayload {
  property: number;
  propertyCodeCategory: number;
  updatedBy: number;
  propertyCode: string;
}

export interface Space {
  id?: number;
  name: string;
  isBedTypeAllowed: boolean;
  isBathroomTypeAllowed: boolean;
}

export interface AdminBookingData {
  user: { id: string };
  property: { id: string };
  createdBy: { id: string };
  checkinDate: string;
  checkoutDate: string;
  noOfGuests: number;
  noOfPets: number;
  isLastMinuteBooking: boolean;
  noOfAdults: number;
  noOfChildren: number;
  notes: string;
}




export const loginUser = (email: string, password: string) =>
  axiosInstance.post("/authentication/login", { email, password });

export const forgetPasswordApi = (email: string) =>
  axiosInstance.post("/authentication/forgotPassword", { email });

export const resetPasswordApi = (
  oldPassword: string,
  newPassword: string,
  userId: number
) =>
  axiosInstance.post("/authentication/resetPassword", {
    oldPassword,
    newPassword,
    userId,
  });

export const recoverPasswordApi = (newPassword: string) =>
  axiosInstance.post("/authentication/recoverPassword", { newPassword });

export const getProperties = () => axiosInstance.get("/properties");

export const getRoles = () => axiosInstance.get("/roles");

export const sendInvite = async (payload: any) =>
  axiosInstance.post("/authentication/invite", payload);

export const logoutUserApi = (token: string) =>
  axiosInstance.post("/authentication/logout", { sessionToken: token });

export const propertywithDetails = () =>
  axiosInstance.get("/properties/user-properties-with-details");

export const fetchHolidaysApi = () => axiosInstance.get("/holidays");

export const addHolidayApi = (holidayData: {
  name: string;
  year: number;
  startDate: string | undefined;
  endDate: string | undefined;
  createdBy: { id: number };
  properties: { id: number }[];
}) => axiosInstance.post("/holidays/holiday", holidayData);

export const updateHolidaysApi = (
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

export const deleteHolidayApi = (id: number) =>
  axiosInstance.delete(`/holidays/holiday/${id}`);

export const fetchpropertyHolidaysApi = (id: number) =>
  axiosInstance.get(`/holidays/holiday/${id}`);

export const deleteHolidaysApi = (id: number) =>
  axiosInstance.delete(`/holidays/holiday/${id}`);

export const propertyseasonholiday = () =>
  axiosInstance.get("/property-season-holidays");

export const propertyseasonholidaydelete = (id: number) =>
  axiosInstance.delete(
    `/property-season-holidays/property-season-holiday/${id}`
  );

export const getPropertySeasonHoliday = (propertyId: number) =>
  axiosInstance.get(`/property-season-holidays/property/${propertyId}`);

export const createBooking = (bookingData: void) =>
  axiosInstance.post(`/bookings/booking`, bookingData);

export const createAdminBooking = (bookingData: AdminBookingData) =>
  axiosInstance.post(`/bookings/admin-booking`, bookingData);

export const cancelBooking = (bookingId: number, userId: number) =>
  axiosInstance.post(`/bookings/${bookingId}/${userId}/cancel`);

export const modifyBooking = (bookingId: number, updatedBookingData: any) =>
  axiosInstance.patch(`/bookings/booking/${bookingId}`, updatedBookingData);

export const createBookingSummary = (bookingData: void) =>
  axiosInstance.post(`/bookings/booking/booking-summary`, bookingData);

export const getBookings = () => axiosInstance.get("/bookings");

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
}) => axiosInstance.post("/properties/property", propertyData);

export const updatePropertyImage = (id: number, formData: FormData) =>
  axiosInstance.patch(`/properties/property/${id}`, formData);

export const deletePropertyApi = (id: number) =>
  axiosInstance.delete(`/properties/property/${id}`);

export const getPropertyById = (id: number) =>
  axiosInstance.get(`/properties/property/${id}`);

export const fetchAllRoomDetailsByPropertyId = (propertyId: number) =>
  axiosInstance.get(`properties/property/${propertyId}/room-details`)

export const updatePropertyapi = (id: number, data: any) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    if (key === "updatedBy") {
      formData.append(key, JSON.stringify(data[key]));
    } else if (key === "mailBannerFile" || key === "coverImageFile") {
      // Append null for these fields
      formData.append(key, "null");
    } else if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, data[key].toString());
    }
  });

  return axiosInstance.patch(`/properties/property/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const userdetails = () => axiosInstance.get("/users");

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

export const amenitiesapi = () => axiosInstance.get(`/amenities`);

export const getAmenitiesByPropertyId = (id: number) =>
  axiosInstance.get(`/property-space-amenities/property/${id}`);

export const getAmenitiesByPropertySpaceId = (propertySpaceId: number) =>
  axiosInstance.get(
    `/property-space-amenities/property-space/${propertySpaceId}`
  );

export const getAmenitiesById = (id: number) =>
  axiosInstance.get(`/property-space-amenities/property-space-amenity/${id}`);

export const getuserbyproperty = (id: number) =>
  axiosInstance.get(`/properties/property/${id}/details`);

export const addamenity = (data: FormData) =>
  axiosInstance.post("/amenities/amenity", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateamenityforproperty = (updateData: UpdateAmenityPayload) =>
  axiosInstance.patch(`/property-space-amenities`, updateData);

export const updateamenities = (id: number, updateData: FormData) =>
  axiosInstance.patch(`/amenities/amenity/${id}`, updateData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const propertyImageapi = (propertyId: number) =>
  axiosInstance.get(`/property-space-images/property/${propertyId}/images`);

export const deleteAmenity = (id: number) =>
  axiosInstance.delete(`/amenities/amenity/${id}`);

export const getpropertyImageById = (id: number) =>
  axiosInstance.get(`/property-images/property-image/${id}`);

export const propertyImageuploadapi = (formData: FormData) => {
  return axiosInstance.post(`/property-images`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "*/*",
    },
  });
};
export const propertyImageeditapi = (id: number, formData: FormData) => {
  return axiosInstance.patch(`/property-images/property-image/${id}`, formData);
};

export const deletetpropertyImageById = (id: number) =>
  axiosInstance.delete(`/property-space-images/property-space-image/${id}`);

export const getUserBookings = (userId: number) =>
  axiosInstance.get(`/bookings/user/${userId}`);

export const propertyspaceapi = () => axiosInstance.get(`/spaces`);

export const propertyspacetypesapi = () => axiosInstance.get(`/space-types`);

export const getPropertyDocuments = () =>
  axiosInstance.get("/property-documents");

export const getPropertyDocumentByProperty = (propertyId: number) =>
  axiosInstance.get(`/property-documents/property/${propertyId}`);

export const createPropertyDocuments = (formData: FormData) => {
  return axiosInstance.post("/property-documents", formData, {});
};

export const updatePropertyDocument = (id: number, formData: FormData) =>
  axiosInstance.patch(`/property-documents/property-document/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deletePropertyDocument = (id: number) =>
  axiosInstance.delete(`/property-documents/property-document/${id}`);

export const getpropertycodes = () => axiosInstance.get(`/property-codes`);

export const userbookingCancelapi = (id: number, user: number) => {
  return axiosInstance.post(`/bookings/${id}/${user}/cancel`);
};

export const addamenitygroup = (data: {
  createdBy: { id: number };
  name: string;
}) => axiosInstance.post("/amenity-groups/amenity-group", data);

export const getamenitygroup = () => axiosInstance.get(`/amenity-groups`);

export const getamenitygroupbyId = (id: number) =>
  axiosInstance.get(`/amenity-groups/amenity-group/${id}`);

export const createSpace = (spaceData: FormData) =>
  axiosInstance.post(`/spaces/space`, spaceData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getAllSpaces = () => axiosInstance.get(`/spaces`);

export const updateSpace = (id: number, spaceData: FormData) =>
  axiosInstance.patch(`/spaces/space/${id}`, spaceData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteSpace = (id: number) =>
  axiosInstance.delete(`/spaces/space/${id}`);

export const createSpaceProperty = (spacePropertyData: SpaceProperty) =>
  axiosInstance.post(`/property-spaces/property-space`, spacePropertyData);

export const getAllSpaceProperties = () =>
  axiosInstance.get(`/property-spaces`);

export const getAllSpacePropertiesById = (propertyId: number) =>
  axiosInstance.get(`/property-spaces/property/${propertyId}`);

export const deleteSpaceProperty = (id: number) =>
  axiosInstance.delete(`/property-spaces/property-space/${id}`);

export const propertySpaceImageuploadapi = (formData: FormData) => {
  return axiosInstance.post(`/property-space-images`, formData, {});
};

// Upload Property Space Images (Create)
export const uploadPropertySpaceImages = (formData: FormData) =>
  axiosInstance.post("/property-space-images", formData);

// Get All Space Property Images
export const fetchAllPropertySpaceImages = () =>
  axiosInstance.get("/property-space-images");

// Get Property Space Images by Property ID
export const fetchPropertyImagesByPropertyId = (propertyId: number) =>
  axiosInstance.get(`/property-space-images/property/${propertyId}/images`);

export const getAllSpacePropertyImageById = (propertyId: number) => {
  return axiosInstance.get(
    `/property-space-images/property/${propertyId}/images`
  );
};
// Get Space Image Details by Image ID
export const fetchSpaceImageDetailsById = (imageId: number) =>
  axiosInstance.get(`/property-space-images/property-space-image/${imageId}`);

export const fetchPropertyImagesByPropertySpaceId = (propertySpaceId: number) =>
  axiosInstance.get(
    `/property-space-images/property/${propertySpaceId}/images`
  );

// Update Space Image Details with Image (Patch)
export const updateSpaceImageById = (imageId: number, formData: FormData) =>
  axiosInstance.patch(
    `/property-space-images/property-space-image/${imageId}`,
    formData
  );

//for proeprty
export const getAllpropertycodes = () => axiosInstance.get(`/property-codes`);

//delete a  property code
export const deletePropertycode = (id: number) =>
  axiosInstance.delete(`/property-codes/property-code/${id}`);

//add for a property
export const postpropertycode = (payload: {
  property: number;
  propertyCodeCategory: number;
  createdBy: number;
  propertyCode: string;
}) => axiosInstance.post(`/property-codes/property-code`, payload);

export const getAllpropertycodecatogory = () =>
  axiosInstance.get(`/property-code-categories`);

export const editPropertyCode = (
  id: number,
  payload: EditPropertyCodePayload
) => axiosInstance.patch(`/property-codes/property-code/${id}`, payload);

export const createpropertycodecatogory = (data: {
  name: string;
  createdBy: { id: number };
}) => axiosInstance.post(`/property-code-categories`, data);

// Delete Space Image by ID (Single)
export const deleteSpaceImageById = (id: number) =>
  axiosInstance.delete(`/property-space-images/property-space-images/${id}`);

// Delete Multiple Space Images (Batch Delete)
export const deleteMultipleSpaceImages = (spaceImages: { ids: number[] }) =>
  axiosInstance.delete(`/property-space-images`, { data: spaceImages });

export const getCategories = () => axiosInstance.get(`/faq-categories`);


export const getQuestions = (selectedCategory: number) =>
  axiosInstance.get(`/faq-questions`);

export const getCategoryById = (id: number) =>
  axiosInstance.get(`/faq-categories/category/${id}`);

export const getQuestionsByCategoryId = (id: number) =>
  axiosInstance.get(`/faq-questions/question/${id}`);

export const createQuestion = (data: {
  question: string;
  answer: string;
  createdBy: { id: number };
}) => {
  return axiosInstance.post("/faq-questions/question", data);
};

export const createCategory = (data: {
  createdBy: { id: number };
  categoryName: string;
}) => {
  return axiosInstance.post("/faq-categories/category", data);
};

export const updateQuestion = (
  id: number,
  data: { question: string; answer: string; updatedBy: { id: number } }
) => {
  return axiosInstance.patch(`/faq-questions/question/${id}`, data);
};

export const deleteQuestion = (id: number) => {
  return axiosInstance.delete(`/faq-questions/question/${id}`);
};

export const fetchFaqs = () => {
  return axiosInstance.get("/faq-questions");
};

export const updateCategory = (id: number , data :any) =>{
  return axiosInstance.patch(`/faq-categories/category/${id}`, data);
};

export const deleteCategory =(id: number) => {
  return axiosInstance.delete(`/faq-categories/category/${id}`);
};

export const createUserPropertyDocuments = (formData: FormData) => 
    axiosInstance.post('/userPropertyDocuments/userPropertyDocument', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

export const getAllUserPropertyDocuments = () =>
  axiosInstance.get("/userPropertyDocuments");

export const getUserPropertyDocument = (id: number) =>
  axiosInstance.get(`/userPropertyDocuments/userPropertyDocument/${id}`);

export const getUserPropertyDocumentByUser = (userId: number) =>
  axiosInstance.get(`/userPropertyDocuments/user/${userId}`);

export const updateUserPropertyDocument = (id: number, formData: FormData) =>
  axiosInstance.patch(
    `/userPropertyDocuments/userPropertyDocument/${id}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

export const deleteUserPropertyDocument = (id: number) =>
  axiosInstance.delete(`/userPropertyDocuments/userPropertyDocument/${id}`);

export const sendContactMessage = (payload: ContactMessage) =>
  axiosInstance.post("/contact-us", payload);

export const createAddditionalImage = (data: FormData) =>
  axiosInstance.post(`/property-additional-images`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getAdditionalImageforProperty = (propertyId: number) => {
  return axiosInstance.get(
    `/property-additional-images/property/${propertyId}`
  );
};
