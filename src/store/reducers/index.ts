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

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;