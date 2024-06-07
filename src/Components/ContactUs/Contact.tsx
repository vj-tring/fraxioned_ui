import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';
import { PortURL } from '../config';
import './Contact.css';
import CustomizedSnackbars from '../CustomizedSnackbars/CustomizedSnackbars';

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${PortURL}/contact-us`, {
        name,
        subject,
        
        message,
      });
      console.log(response.data);
      setSnackbarMessage('Message sent successfully!');
      setOpenSnackbar(true);
      setName('');
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error(error);
      // Handle error response
      setSnackbarMessage('Error sending message. Please try again.');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="container1 ">
      <Row>
        <Col md={6} className="leftside">
          <div className="d-flex flex-column mb-3 textarea  ">
            <FaMapMarkerAlt size={60} className="me-2 mb-4" />
            <h2 className="HT ">HI THERE!</h2>
          </div>
          <p className="contacttext  mb-5">
            The Owner services team at fraxioned, is here to help! Please use this form to send us an email. I'll get back to you soon as possible.
            The Owner services team at fraxioned, is here to help! Please use this form to send us an email. I'll get back to you soon as possible.
            The Owner services team at fraxioned, is here to help! Please use this form to send us an email. I'll get back to you soon as possible.
          </p>
          <h5 className="mt-4  TFW">
            THANKS FOR
            REACHING OUT!
          </h5>
        </Col>
        <Col md={6}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formLabel">
              <Form.Label className="form-label1 mt-5">
                EMAILING OWNERS@FRAXIONED.COM
              </Form.Label>
            </Form.Group>
            <Form.Group controlId="formName" className="mt-3">
              <Form.Control
                type="text"
                placeholder="Enter your name"
                className="orange-border"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formSubject" className="mt-3">
              <Form.Control
                type="text"
                placeholder="Enter the subject"
                className="orange-border"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formMessage" className="mt-3">
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter your message"
                className="orange-border"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </Form.Group>
            <Button variant="outline-light" type="submit" className="mt-3 sendBtn" style={{ backgroundColor: 'orange' }}>
              SEND
            </Button>
          </Form>
        </Col>
      </Row>
      <CustomizedSnackbars
        open={openSnackbar}
        handleClose={handleCloseSnackbar}
        message={snackbarMessage}
        severity="success"
      />
    </div>
  );
};

export default Contact;