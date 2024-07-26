// ProtectedRoute.js

import React from 'react'
import { Route, Navigate } from 'react-router-dom'
import { isAuthenticated } from './authService'

const ProtectedRoute = ({ element, ...props }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />
  }
  return <Route {...props} element={element} />
}

export default ProtectedRoute
