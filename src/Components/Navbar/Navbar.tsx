import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Image from 'react-bootstrap/Image';
import 'bootstrap/dist/css/bootstrap.min.css';

interface CustomNavbarProps {
  logo: string;
  links: { name: string; href: string; onClick?: () => void }[];
  userImage?: string;
  userName: string;
}

const CustomNavbar: React.FC<CustomNavbarProps> = ({ logo, links, userImage, userName }) => {
  return (
    <Navbar bg="light" expand="lg" className="p-2">
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
        <Image
          src={userImage}
          roundedCircle
          height="30"
          className="mr-2"
          alt="User"
        />
        <span style={{ marginLeft: '15px' }}>{userName}</span>
      </Nav>
    </Navbar>
  );
};

export default CustomNavbar;
