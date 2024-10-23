import { Reducer, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slice/authentication";
import registerReducer from "../slice/auth/register";
import forgotPasswordReducer from "../slice/auth/forget-password";
import propertyReducer from "../slice/auth/property-slice";
import limitsReducer from "../slice/auth/propertyGuestSlice";
import editpropertyReducer from "../slice/auth/editproperty";
import addpropertyReducer from "../slice/auth/addproperty";
import propertySeasonHolidayReducer from "../slice/auth/propertySeasonHolidaySlice";
import bookingReducer from "../slice/auth/bookingSlice";
import datePickerReducer from "../slice/datepicker";
import propertyDocumentsReducer from "../slice/property-document";
import spaceReducer from '../slice/space';
import spacePropertyReducer from '../slice/space/property';
import spaceImageReducer from '../slice/space/images'
import ThingsToKnowReducer from '../slice/auth/ThingstoknowSlice';
import propertiesReducer from '../slice/auth/propertiesSlice';
import holidayReducer from '../slice/auth/holidaySlice';
import amenityGroupsReducer from '../slice/amenity/group'
import propertyAmenitiesReducer from '../slice/auth/propertyamenities';
import amenitiesReducer from '../slice/amenity'
import userDetailsReducer from '../slice/auth/userdetails';
import userpropertiesReducer from '../slice/user-properties';
import userReducer from '../slice/user-slice';
import userpropertyReducer from '../slice/auth/userproperties';
import rolesReducer from '../slice/roles';
import addQuestionReducer from '../slice/auth/addfaqSlice';
import faqPageReducer from '../slice/auth/faqpageSlice';
import addCategoryReducer from '../slice/auth/addcategorySlice';
import bedReducer from '../slice/bedSlice';
import propertydetailReducer from '../slice/auth/property-detail'
import bathroomReducer from '../slice/bathroom-slice';
import amenityReducer from '../slice/amenity';
import userDocumentsReducer from '../slice/user-document';
import propertyImagesReducer from '../slice/auth/additional-image'
import { propertycodecatogoryReducer } from '../slice/auth/propertycodeCatogorySlice';
import { propertyCodesReducer } from '../slice/auth/propertycodeSlice';
import propertyAllRoomsSpaceReducer from '../slice/properties/propertyallrooms';
import PropertyImageReducer from "../slice/additional-image";
import PropertyReducer from "../slice/property";
import usersReducer from "../slice/user";

const appReducer: Reducer = combineReducers({
  auth: authReducer,
  register: registerReducer,
  forgotPassword: forgotPasswordReducer,
  addProperty: addpropertyReducer,
  properties: propertyReducer,
  editProperty: editpropertyReducer,
  limits: limitsReducer,
  propertySeasonHoliday: propertySeasonHolidayReducer,
  bookings: bookingReducer,
  datePicker: datePickerReducer,
  propertyDocuments: propertyDocumentsReducer,
  property: propertiesReducer,
  propertyAllRooms: propertyAllRoomsSpaceReducer,
  thingsToKnow: ThingsToKnowReducer,
  holiday: holidayReducer,
  amenityGroups: amenityGroupsReducer,
  propertyAmenities: propertyAmenitiesReducer,
  amenities: amenitiesReducer,
  spaceImage: spaceImageReducer,
  spaces: spaceReducer,
  spaceProperties: spacePropertyReducer,
  userDetails: userDetailsReducer,
  userProperties: userpropertiesReducer,
  user: userReducer,
  userProperty: userpropertyReducer,
  roles: rolesReducer,
  propertycodecatogory: propertycodecatogoryReducer,
  propertycode: propertyCodesReducer,
  propertydetail: propertydetailReducer,
  bed: bedReducer,
  bathroom: bathroomReducer,
  amenitiesID: amenityReducer,
  addQuestion: addQuestionReducer,
  faqPage: faqPageReducer,
  addCategory: addCategoryReducer,
  userDocuments: userDocumentsReducer,
  propertyImages: propertyImagesReducer,
  PropertyImage: PropertyImageReducer,
  Property: PropertyReducer,
  Users: usersReducer,
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: any
) => {
  if (action.type === "auth/logout/fulfilled") {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export type RootState = ReturnType<typeof appReducer>;
export default rootReducer;
