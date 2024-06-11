import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
// import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Contact from "../Components/ContactUs/Contact";
import './Footer.css';

const Footer: React.FC = () => {
  const [showContactModal, setShowContactModal] = useState(false);

  const handleShowContactModal = () => setShowContactModal(true);
  const handleCloseContactModal = () => setShowContactModal(false);

  return (
    <>
      <footer className='footer'>
        <div className='row'>
          <div className='col-md-3'>
            <div className='logo'></div>
          </div>
          <div className='col-md-2'>
            <ul>
              <li><a href='/' className='no-underline'>Home</a></li>
              <li><a href='/booking' className='no-underline'>Booking</a></li>
              <li><a href='/peak-season' className='no-underline'>Peak Season</a></li>
            </ul>
          </div>
          <div className='col-md-2'>
            <ul>
              <li><a href='/payments' className='no-underline'>Payments</a></li>
              <li><a href='/faq' className='no-underline'>FAQ</a></li>
              <li><a href='/account' className='no-underline'>Account</a></li>
            </ul>
          </div>
          <div className='col-md-2'>
            <ul>
              <li><a href='/documents' className='no-underline'>Documents</a></li>
              <li><a href='/contact' className='no-underline'>Contact</a></li>
            </ul>
          </div>
          <div className='col-md-3'>
            <button className='contact-us' onClick={handleShowContactModal}>
              Contact Us <span className="arrow">&#8594;</span>
            </button>
          </div>
        </div>
      </footer>

      <Modal show={showContactModal} onHide={handleCloseContactModal} dialogClassName="modal-fullscreen" centered>
        <Modal.Header closeButton>
          <Modal.Title>Contact Us</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Contact />
        </Modal.Body>
        <Modal.Footer>
          
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Footer;
