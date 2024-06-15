import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./Components/Login/Login";
import Signup from './Components/Signup/Signup';
import ForgotPassword from './Components/ForgetPassword/ForgotPassword';
import ResetPassword from './Components/ResetPassword/ResetPassword';
import Dashboard from './Components/Dashboard/Dashboard';
import Contact from './Components/ContactUs/Contact';
import SendInvite from './Components/SendInvite/SendInvite';
import CustomizedAccordions from './Components/CustomizedAccordions/CustomizedAccordions';
import Home from './Components/Home/Home';
import UserDetails from './Components/UserDetails/UserDetails';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* <Route path="/user-details" element={<UserDetails/>} /> */}

        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
