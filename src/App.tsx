import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./Components/Login/Login";
import Signup from './Components/Signup/Signup';
import ForgotPassword from './Components/ForgetPassword/ForgotPassword';
import ResetPassword from './Components/ResetPassword/ResetPassword';
import { Dashboard } from './Components/Dashboard/Dashboard1';

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

      </Routes>
    </Router>
  );
};

export default App;