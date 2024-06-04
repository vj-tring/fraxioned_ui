import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CustomNavbar from '../Navbar/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';

const Dashboard: React.FC = () => {
  const links = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <div>
      <CustomNavbar
        logo="path/to/logo.png"
        links={links}
        userImage="path/to/user-image.jpg" // or leave empty to use the default image
        userName="John Doe"
      />
     
    </div>
  );
}

export default Dashboard;
