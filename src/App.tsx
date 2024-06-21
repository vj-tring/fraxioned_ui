import React, { FC, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Login from './Components/Login/Login';
import Signup from './Components/Signup/Signup';
import ForgotPassword from './Components/ForgetPassword/ForgotPassword';
import ResetPassword from './Components/ResetPassword/ResetPassword';
import Dashboard from './Components/Dashboard/Dashboard';
import ResponsiveAppBar from './Components/NavbarMUI/NavbarUI';
import PrivateRoute from './PrivateRoute';
import { isAuthenticated } from './authService';

const AuthWrapper: FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    } else {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        if (userData && userData.email) {
          // Set user email in state or context if needed
        }
      }
    }
  }, [navigate]);

  return <>{children}</>;
};

const App: FC = () => {
  return (
    <Router>
      <AuthWrapper>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/navbar" element={<ResponsiveAppBar />} />
          <Route path="/dashboard" element={<PrivateRoute element={Dashboard} />} />
          {/* Use PrivateRoute for all other routes that need to be protected */}
          <Route path="/*" element={<PrivateRoute element={Dashboard} />} />
        </Routes>
      </AuthWrapper>
    </Router>
  );
};

export default App;
