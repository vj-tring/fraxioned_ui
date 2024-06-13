import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./Components/Login/Login";
import Signup from './Components/Signup/Signup';
import ForgotPassword from './Components/ForgetPassword/ForgotPassword';
import ResetPassword from './Components/ResetPassword/ResetPassword';
import Dashboard from './Components/Dashboard/Dashboard1';
import Contact from './Components/ContactUs/Contact';
import SendInvite from './Components/SendInvite/SendInvite';
import CustomizedAccordions from './Components/CustomizedAccordions/CustomizedAccordions';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/Reset-password" element={<ResetPassword />} />      
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/send-invite" element={<SendInvite />} />
        <Route path="/FAQ" element={<CustomizedAccordions />} />
      </Routes>
    </Router>
  );
};

export default App;