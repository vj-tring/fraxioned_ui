import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slice/auth/authentication';
import registerReducer from '../slice/auth/register';
import forgotPasswordReducer from '../slice/auth/forget-password';
import propertyReducer from '../slice/auth/property-slice';
import limitsReducer from '../slice/auth/propertyGuestSlice';
import editpropertyReducer from '../slice/auth/editproperty';
import addpropertyReducer from '../slice/auth/addproperty';
import propertySeasonHolidayReducer from '../slice/auth/propertySeasonHolidaySlice';
import bookingReducer from '../slice/auth/bookingSlice';
import datePickerReducer from '../slice/datePickerSlice';
import propertyDocumentsReducer from '../slice/propertyDocumentSlice';
import spaceReducer from '../slice/spaceSlice';
import spacePropertyReducer from '../slice/spacePropertySlice';
import ThingsToKnowReducer from '../slice/auth/ThingstoknowSlice';
import propertiesReducer from '../slice/auth/propertiesSlice';
import holidayReducer from '../slice/auth/holidaySlice';
import addAmenityReducer from '../slice/auth/addamenitySlice';
import amenityGroupsReducer from '../slice/auth/amenityGroups';
import propertyAmenitiesReducer from '../slice/auth/propertyamenities';
import amenitiesReducer from '../slice/auth/amenitySlice';
import amenitiesPageReducer from '../slice/auth/amenitiespageSlice';
import userDetailsReducer from '../slice/auth/userdetails';
import userpropertiesReducer from '../slice/auth/userproperties';
import userReducer from '../slice/user-slice';


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
  addAmenity: addAmenityReducer,
  amenityGroups: amenityGroupsReducer,
  propertyAmenities: propertyAmenitiesReducer,
  amenitiesPage: amenitiesPageReducer,
  amenities: amenitiesReducer,
  spaces: spaceReducer, // Add space reducer
  spaceProperties: spacePropertyReducer, // Add space property reducer
  userDetails: userDetailsReducer,
  userProperties: userpropertiesReducer,
  user: userReducer,
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: any
) => {
  if (action.type === 'auth/logout/fulfilled') {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export type RootState = ReturnType<typeof appReducer>;
export default rootReducer;