import React, { FC } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom'
import Login from './Components/Login/Login'
import Signup from './Components/Signup/Signup'
import ForgotPassword from './Components/ForgetPassword/ForgotPassword'
import ResetPassword from './Components/ResetPassword/ResetPassword'
import Dashboard from './Components/Dashboard/Dashboard'
import ResponsiveAppBar from './Components/NavbarMUI/NavbarUI'
import Booking from 'Components/Booking/Booking'
import Contact from 'Components/ContactUs/Contact'
import CustomizedAccordions from 'Components/CustomizedAccordions/CustomizedAccordions'

interface PrivateRouteProps {
  element: React.ComponentType
}

const PrivateRoute: FC<PrivateRouteProps> = ({ element: Element }) => {
  const token = localStorage.getItem('token')
  return token ? <Element /> : <Navigate to="/login" />
}

const App: FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/faq" element={<CustomizedAccordions />} />
        <Route path="/ResponsiveAppBar" element={<ResponsiveAppBar />} />
        <Route
          path="/dashboard/*"
          element={<PrivateRoute element={Dashboard} />}
        />
      </Routes>
    </Router>
  )
}

export default App
