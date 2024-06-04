import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Image from 'react-bootstrap/Image';
import 'bootstrap/dist/css/bootstrap.min.css';

interface CustomNavbarProps {
  logo: string;
  links: { name: string; href: string }[];
  userImage?: string; // Make userImage optional
  userName: string;
}

const CustomNavbar: React.FC<CustomNavbarProps> = ({ logo, links, userImage, userName }) => {
  const defaultUserImage = 'path/to/default-image.png'; // Provide a path to a default image

  return (
    <Navbar bg="light" expand="lg" className="justify-content-between">
      <Navbar.Brand href="#home">
        <img
          src={logo}
          height="30"
          className="d-inline-block align-top"
          alt="Logo"
        />
      </Navbar.Brand>
      <Nav className="ml-auto">
        {links.map((link, index) => (
          <Nav.Link key={index} href={link.href}>
            {link.name}
          </Nav.Link>
        ))}
      </Nav>
      <Nav className="align-items-center">
        <Image
          src={userImage || defaultUserImage}
          roundedCircle
          height="30"
          className="mr-2"
          alt="User"
        />
        <span>{userName}</span>
      </Nav>
    </Navbar>
  );
};

export default CustomNavbar;
