import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CustomNavbar from '../../Components/Navbar/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import fraxionedLogo from '../../assets/images/BB - Owners.png';
import Footer from '../../Footer/Footer';
import userImage from '../../assets/profile.jpeg';
import './Dashboard.css';
import CustomizedAccordions from '../CustomizedAccordions/CustomizedAccordions';
import Contact from '../ContactUs/Contact';
import UserDetails from '../UserDetails/UserDetails';
import ComingSoon from '../ComingSoon/ComingSoon';
import { isAuthenticated } from '../../authService';
import PermanentDrawerLeft from 'Components/UserRoles/adminSidebar';
import Home from 'Components/Home/Home';
import Booking from 'Components/Booking/Booking';
import { selectIsAdmin } from '../../Redux/slice/auth/authSlice';
const Dashboard: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();
  const isAdmin = useSelector(selectIsAdmin);
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);
  const links = [
    { name: 'HOME', href: '/dashboard', disabled: false },
    { name: 'BOOKING', href: '/booking', disabled: false },
    { name: 'PEAK SEASON', href: '/peak-season', disabled: false },
    { name: 'PAYEMENTS', href: '/payements', disabled: false },
    { name: 'FAQ', href: '/faq', disabled: false },
  ]
  return (
    <div className="dashboard-container">
      {isAdmin && <PermanentDrawerLeft />}
      <CustomNavbar
        logo={fraxionedLogo}
        links={links}
        userImage={userImage}
        userName={userEmail}
        onUserImageClick={() => navigate('/user-details')}
      />
      <div className="content-container">
        <div className="content-wrapper">
          <Routes>
            <Route path="/dashboard" element={<Home />} />
            <Route path="/faq" element={<CustomizedAccordions />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/user-details" element={<UserDetails />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/peak-season" element={<ComingSoon />} />
            <Route path="/payements" element={<ComingSoon />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default Dashboard;