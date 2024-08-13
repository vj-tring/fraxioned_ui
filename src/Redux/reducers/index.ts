/* eslint-disable @typescript-eslint/no-explicit-any */
import { combineReducers } from '@reduxjs/toolkit'
import authReducer from '../slice/auth/authSlice'
import registerReducer from '../slice/auth/registerSlice'

import forgotPasswordReducer from '../slice/auth/forgotPasswordSlice'

import propertyReducer from '../slice/auth/propertySlice';
import propertyGuestReducer  from  '../slice/auth/propertyGuestSlice'; 
const appReducer = combineReducers({
  auth: authReducer,
  register: registerReducer,

  forgotPassword: forgotPasswordReducer,
  properties: propertyReducer,
  limitSlice: propertyGuestReducer,

})

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: any
) => {
  if (action.type === 'auth/logout/fulfilled') {
    return appReducer(undefined, action)
  }
  return appReducer(state, action)
}

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
