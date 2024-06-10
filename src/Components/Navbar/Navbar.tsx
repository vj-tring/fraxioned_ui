import React, { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Image from 'react-bootstrap/Image';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import SendInvite from '../SendInvite/SendInvite';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';

interface CustomNavbarProps {
  logo: string;
  links: { name: string; href: string; onClick?: () => void }[];
  userImage?: string;
  userName: string;
}

const CustomNavbar: React.FC<CustomNavbarProps> = ({ logo, links, userImage, userName }) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);

  const handleOpenInviteModal = () => setShowInviteModal(true);
  const handleCloseInviteModal = () => setShowInviteModal(false);

  const handleShowLogoutModal = () => setShowLogoutModal(true);
  const handleCloseLogoutModal = () => setShowLogoutModal(false);

  const handleShowUserDetailsModal = () => setShowUserDetailsModal(true);
  const handleCloseUserDetailsModal = () => setShowUserDetailsModal(false);

  const navigate = useNavigate();
  const handleLogout = () => {
    console.log('User logged out');
    handleCloseLogoutModal();
    navigate('/login');
    localStorage.clear();
  };

  const userDetails = {
    name: userName,
    email: 'user@example.com',
    phone: '123-456-7890',
    mailingAddress: '123 Main St, Anytown, USA',
    secondaryEmail: 'user.secondary@example.com',
    secondaryPhone: '098-765-4321'
  };

  return (
    <>
      <Navbar bg="light" expand="lg" className="p-2">
        <Navbar.Brand href="#home" className="p-2">
          <img
            src={logo}
            height="40"
            width="160"
            className="d-inline-block align-top"
            alt="Logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {links.map((link, index) => (
              <Nav.Link key={index} href={link.href} onClick={link.onClick} className="nav-link-with-margin">
                {link.name}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
        <Nav className="ml-auto">
          {userImage && (
            <Image
              src={userImage}
              roundedCircle
              height="30"
              className="mr-2 responsive-image"
              alt="User"
              onClick={handleShowUserDetailsModal}
              style={{ cursor: 'pointer' }}
            />
          )}
          <Dropdown>
            <Dropdown.Toggle
              variant="light"
              id="dropdown-basic"
              className="username-dropdown-toggle"
            >
              <span>{userName}</span>
            </Dropdown.Toggle>

            <Dropdown.Menu className="Drop-menu">
              <Dropdown.Item className="Drop-item" onClick={handleOpenInviteModal}>Send Invite</Dropdown.Item>
              <Dropdown.Item className="Drop-item" onClick={handleShowLogoutModal}>Logout</Dropdown.Item>
              <Dropdown.Item className="Drop-item" href="#/action-3">Settings</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Navbar>

      <Modal show={showInviteModal} onHide={handleCloseInviteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Send Invite</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SendInvite />
        </Modal.Body>
      </Modal>

      <ConfirmationModal
        show={showLogoutModal}
        onHide={handleCloseLogoutModal}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmLabel="Logout"
        cancelLabel="Cancel"
      />

      <Modal show={showUserDetailsModal} onHide={handleCloseUserDetailsModal} centered>
        <Modal.Header closeButton style={{ backgroundColor: 'orange' }}>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: 'orange' }}>
          <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            {userImage && <Image src={userImage} roundedCircle height="60" className="mb-3" alt="User" />}
            <h5>{userDetails.name}</h5>
          </div>
          <p><strong>Email:</strong> {userDetails.email}</p>
          <p><strong>Phone:</strong> {userDetails.phone}</p>
          <p><strong>Mailing Address:</strong> {userDetails.mailingAddress}</p>
          <p><strong>Secondary Email:</strong> {userDetails.secondaryEmail}</p>
          <p><strong>Secondary Phone:</strong> {userDetails.secondaryPhone}</p>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CustomNavbar;
