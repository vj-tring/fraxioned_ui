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
import { Navigate, redirect, useNavigate } from 'react-router-dom';

interface CustomNavbarProps {
  logo: string;
  links: { name: string; href: string; onClick?: () => void }[];
  userImage?: string;
  userName: string;
}

const CustomNavbar: React.FC<CustomNavbarProps> = ({ logo, links, userImage, userName }) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleOpenInviteModal = () => setShowInviteModal(true);
  const handleCloseInviteModal = () => setShowInviteModal(false);

  const handleShowLogoutModal = () => setShowLogoutModal(true);
  const handleCloseLogoutModal = () => setShowLogoutModal(false);
 const navigate=useNavigate();
  const handleLogout = () => {
    // Perform logout action here
    console.log('User logged out');
    handleCloseLogoutModal();
    navigate('/login');
  };

  return (
    <>
      <Navbar  bg="light" expand="lg" className="p-2 ">
        <Navbar.Brand href="#home" className="p-2">
          <img
            src={logo}
            height="30"
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
              className="mr-2"
              alt="User"
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

            <Dropdown.Menu>
              <Dropdown.Item onClick={handleOpenInviteModal}>Send Invite</Dropdown.Item>
              <Dropdown.Item onClick={handleShowLogoutModal}>Logout</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Settings</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Navbar>

      <Modal show={showInviteModal} onHide={handleCloseInviteModal} centered>
        <Modal.Header closeButton >
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
    </>
  );
};

export default CustomNavbar;
