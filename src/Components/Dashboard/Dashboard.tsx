import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import CustomNavbar from '../Navbar/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import fraxionedLogo from '../../assets/Fraxioned.png';
import Footer from '../../Footer/Footer';
import userImage from '../../assets/profile.jpeg';
import './Dashboard.css';
import Home from '../Home/Home';
import CustomizedAccordions from '../CustomizedAccordions/CustomizedAccordions';
import Contact from '../ContactUs/Contact';
import UserDetails from '../UserDetails/UserDetails';

const Dashboard: React.FC = () => {
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate(); // Hook for programmatic navigation

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      if (userData && userData.email) {
        setUserEmail(userData.email);
      }
    }
  }, []);

  const links = [
    { name: 'HOME', href: '/dashboard' },
    { name: 'BOOKING', href: '/dashboard/booking' },
    { name: 'PEAK SEASON', href: '/dashboard/services' },
    { name: 'PAYEMENTS', href: '/dashboard/payements' },
    { name: 'FAQ', href: '/dashboard/FAQ' },
    { name: 'CONTACT', href: '/dashboard/contact' },

  ];

  return (
    <div className="dashboard-container">
      <CustomNavbar
        logo={fraxionedLogo}
        links={links}
        userImage={userImage}
        userName={userEmail}
        onUserImageClick={() => navigate('/dashboard/user-details')} // Directly navigate to user details page

      />

      <div className="content-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="FAQ" element={<CustomizedAccordions />} />
          <Route path="contact" element={<Contact />} />
          <Route path="user-details" element={<UserDetails />} />

        </Routes>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
