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
// import Booking from 'Components/Booking/Booking'
import Date from 'Components/Home/DatesContainer/Date'
// import MultipleSelect from 'Components/Home/DatesContainer/MultipleSelect'
// import Contact from 'Components/ContactUs/Contact'
// import BasicSelect from 'Components/Home/DatesContainer/PropertyItem'
import AccountMenu from 'Components/NavbarDropdown/AccountMenu'
import Calendar from 'Components/Calender/Calender'

import Change from 'Components/ChangePassword/ChangePassword'
import { Provider } from 'react-redux'
import store from '../src/Redux/store/index'
interface PrivateRouteProps {
  element: React.ComponentType
}

const PrivateRoute: FC<PrivateRouteProps> = ({ element: Element }) => {
  const token = localStorage.getItem('session')
  return token ? <Element /> : <Navigate to="/dashboard" />
}

const App: FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/recover" element={<Change />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* <Route path="/contact" element={<Contact />} /> */}
          {/* <Route path="/booking" element={<Booking />} /> */}
          <Route
            path="/reset-password"
            element={
              <ResetPassword
                onClose={() => {
                }}
              />
            }
          />{' '}
          <Route path="/ResponsiveAppBar" element={<ResponsiveAppBar />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/menu" element={<AccountMenu />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/date" element={<Date />} />
          <Route path="/*" element={<PrivateRoute element={Dashboard} />} />

          {/* <Route path="/multiselect" element={<MultipleSelect />} />
          <Route path="/basicselect" element={<BasicSelect />} /> */}
        </Routes>
      </Router>
    </Provider>
  )
}

export default App
