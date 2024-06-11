import React, { useState, useEffect } from 'react';
import { Routes } from 'react-router-dom';
import CustomNavbar from '../Navbar/Navbar';
import ContactModal from '../ContactModal/ContactModal';
import 'bootstrap/dist/css/bootstrap.min.css';
import fraxionedLogo from '../../assets/Fraxioned.png';
import Footer from '../../Footer/Footer';
import userImage from '../../assets/profile.jpeg';
import './Dashboard.css';
import Home from '../Home/Home';

const Dashboard: React.FC = () => {
  const [show, setShow] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      if (userData && userData.email) {
        setUserEmail(userData.email);
      }
    }
  }, []);
   
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const links = [ 
    { name: 'HOME', href: '/dashboard' },
    { name: 'BOOKING', href: 'https://www.airbnb.co.in/' },
    { name: 'PEAK SEASON', href: '/services' },
    { name: 'PAYEMENTS', href: 'https://payments.google.com/gp/w/home/paymentmethods?sctid=1592381138486457' },
    { name: 'FAQ', href: '/FAQ' },
  ];

  return (
    <div className="dashboard-container">
      <CustomNavbar
        logo={fraxionedLogo}
        links={links}
        userImage={userImage}
        userName={userEmail}
      />

      <Routes />
      

      <Home />
      
      <ContactModal show={show} handleClose={handleClose} />
      <Footer />
    </div>
  );
};


export default Dashboard;
