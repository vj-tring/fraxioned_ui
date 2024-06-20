import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./Components/Login/Login";
import Signup from './Components/Signup/Signup';
import ForgotPassword from './Components/ForgetPassword/ForgotPassword';
import ResetPassword from './Components/ResetPassword/ResetPassword';
import Dashboard from './Components/Dashboard/Dashboard';
import ResponsiveAppBar from './Components/NavbarMUI/NavbarUI';
import { Provider } from 'react-redux';
// import store from '../src/Redux/store'

const App: React.FC = () => {
  return (
    // <Provider store={store}>

    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* <Route path="/user-details" element={<UserDetails/>} /> */}
        

        <Route path="/ResponsiveAppBar" element={<ResponsiveAppBar />} />

        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </Router>
    // </Provider>

  );
};

export default App;
