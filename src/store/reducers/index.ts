import { combineReducers } from "@reduxjs/toolkit";
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
import spaceReducer from "../slice/space";
import spacePropertyReducer from "../slice/space/property";
import ThingsToKnowReducer from "../slice/auth/ThingstoknowSlice";
import propertiesReducer from "../slice/auth/propertiesSlice";
import holidayReducer from "../slice/auth/holidaySlice";
import amenityGroupsReducer from "../slice/amenity/group";
import propertyAmenitiesReducer from "../slice/auth/propertyamenities";
import amenitiesReducer from "../slice/amenity";
import userDetailsReducer from "../slice/auth/userdetails";
import userpropertiesReducer from "../slice/auth/userproperties";
import userReducer from "../slice/user-slice";
import userpropertyReducer from "../slice/auth/userpropertiesSlice";
import rolesReducer from "../slice/roles";
import spaceImageReducer from "../slice/space/images";

const appReducer = combineReducers({
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
