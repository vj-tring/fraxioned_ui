import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import CustomNavbar from '../../components/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import fraxionedLogo from '../../assets/images/fraxioned-owners.png';
import Footer from '../../components/footer';
import userImage from '../../assets/images/profile.jpeg';
import './dashboard.css';
import CustomizedAccordions from '../../components/customized-accordians';
import Contact from '../../pages/contact-us';
import UserDetails from '../../pages/user-details';
import ComingSoon from '../../components/coming-soon';
import { isAuthenticated } from '../../authService';
import Home from '../../pages/home';
import Booking from '../../pages/booking';

const Dashboard: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();
  useEffect(() => {

    if (!isAuthenticated()) { 
      navigate('/login')
    }
  }, [navigate]);


  const links = [
    { name: 'HOME', href: '/dashboard', disabled: false },
    { name: 'BOOKINGS', href: '/dashboard/booking', disabled: true },
    { name: 'DOCUMENTS', href: '/dashboard/peak-season', disabled: true },
    { name: 'PAYMENTS', href: '/dashboard/payments', disabled: true },
    { name: 'MORE', href: '/dashboard/faq', disabled: true }, 
    
  ]

  return (
    <div className="dashboard-container">
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
            <Route path="/" element={<Home />} />
            <Route path="/faq" element={<CustomizedAccordions />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/user-details" element={<UserDetails />} />
            <Route path="/booking" element={<Booking />} /> 
            <Route path="/peak-season" element={<ComingSoon />} />
            <Route path="/payments" element={<ComingSoon />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  
  );
};
export default Dashboard;