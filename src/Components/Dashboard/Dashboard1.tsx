import React, { useState } from 'react';
import { Routes } from 'react-router-dom';
import CustomNavbar from '../Navbar/Navbar';
import ContactModal from '../ContactModal/ContactModal';
import 'bootstrap/dist/css/bootstrap.min.css';
import fraxionedLogo from '../../assets/Fraxioned.png';
import Footer from '../../Footer/Footer';
import userImage from '../../assets/user.png';
import backgroundImage from '../../assets/building.jpg'; // import the background image
import './Dashboard.css';

const Dashboard: React.FC = () => {
  
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const links = [ 
    { name: 'HOME', href: '/' },
    { name: 'BOOKING', href: '#' },
    { name: 'SERVICES', href: '/services' },
    { name: 'CONTACT', href: '#', onClick: handleShow },
  ];

  return (
    <div className="dashboard-container">
      <CustomNavbar
        logo={fraxionedLogo}
        links={links}
        userImage={userImage}
        userName="John Doe"
      />
      <Routes>
        {/* Define your routes here */}
      </Routes>
      <div className="background-img">
        {/* Other content can go here */}
      </div>
      <ContactModal show={show} handleClose={handleClose} />
      <Footer />
    </div>
  );
};

export default Dashboard;
