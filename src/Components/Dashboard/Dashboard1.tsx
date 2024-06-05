import React, { useState } from 'react';
import { Routes } from 'react-router-dom';
import CustomNavbar from '../Navbar/Navbar';
import Contact from '../ContactUs/Contact';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import fraxionedLogo from '../../assets/Fraxioned.png';
import Footer from '../../Footer/Footer';
import userImage from '../../assets/user.png'; 
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [show, setShow] = useState(false);
  
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const links = [
    { name: 'HOME', href: '/' },
    { name: 'BOOKING', href: '/contact', onClick: handleShow },
    { name: 'SERVICES', href: '/services' },
    { name: 'CONTACT', href: '#', onClick: handleShow }, // Ensure the correct onClick handler
  ];

  return (
    <div>
      <CustomNavbar
        logo={fraxionedLogo}
        links={links}
        userImage={userImage}
        userName="John Doe"
      />
      <Routes>
        {/* Define your routes here */}
      </Routes>

      <Modal show={show} onHide={handleClose} dialogClassName="modal-fullscreen">
        <Modal.Header closeButton>
          <Modal.Title>Contact Us</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Contact />
        </Modal.Body>
      </Modal>
      <Footer/>
    </div>
  );
};

export default Dashboard;
