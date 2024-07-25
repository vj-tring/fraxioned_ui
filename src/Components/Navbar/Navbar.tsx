import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Image from 'react-bootstrap/Image';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
// import InviteModal from './SentInviteModal';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
// import useNavbarHandler from "./NavbarFunction";
import './Navbar.css';

interface CustomNavbarProps {
  logo: string;
  links: {
    disabled: boolean | undefined; name: string; href: string; onClick?: () => void 
}[];
  userImage?: string;
  userName: string;
  onUserImageClick?: () => void; 
}

const CustomNavbar: React.FC<CustomNavbarProps> = ({ logo, links, userImage, userName, onUserImageClick }) => {
  // const {
  //   showInviteModal,
  //   showLogoutModal,
  //   handleOpenInviteModal,
  //   handleCloseInviteModal,
  //   handleShowLogoutModal,
  //   handleCloseLogoutModal,
  
  //   handleLogout,
  // } = useNavbarHandler();


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
              <Nav.Link
                key={index}
                href={link.href}
                onClick={link.onClick}
                className="nav-link-with-margin"
                disabled={link.disabled} // Add disabled attribute
              >
                {link.name}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
        <Nav className="ml-auto">
          {userImage && (
            <Image
              src={userImage || '../../assets/profile.jpeg'}
              roundedCircle
              height="30"
              className="mr-2 responsive-image"
              alt="User"
              style={{ cursor: 'pointer' }}
              onClick={onUserImageClick} // Add onClick event handler to the user image
            />
          )}
          <Dropdown>
            <Dropdown.Toggle variant="light" id="dropdown-basic" className="username-dropdown-toggle">
              <span>{userName}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu className="Drop-menu">
              {/* <Dropdown.Item className="Drop-item" onClick={handleOpenInviteModal}>Send Invite</Dropdown.Item> */}
              {/* <Dropdown.Item className="Drop-item" onClick={handleShowLogoutModal}>Logout</Dropdown.Item> */}
              {/* <Dropdown.Item className="Drop-item" href="#/action-3">Settings</Dropdown.Item> */}
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Navbar>

      {/* <InviteModal show={showInviteModal} onHide={handleCloseInviteModal} /> */}
      {/* <ConfirmationModal
        // show={showLogoutModal}
        onHide={handleCloseLogoutModal}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmLabel="Logout"
        cancelLabel="Cancel"
      /> */}
    </>
  );
};

export default CustomNavbar;
