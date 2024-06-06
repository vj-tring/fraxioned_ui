import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaMapMarkerAlt } from 'react-icons/fa'; 

import './Contact.css';

const Contact: React.FC = () => {
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
          <Form>
            <Form.Group controlId="formLabel">
              <Form.Label className="form-label1 mt-5">
                EMAILING OWNERS@FRAXIONED.COM
              </Form.Label>
            </Form.Group>
            <Form.Group controlId="formName" className="mt-3">
              <Form.Control type="text" placeholder="Enter your name" className="orange-border" />
            </Form.Group>
            <Form.Group controlId="formSubject" className="mt-3">
              <Form.Control type="text" placeholder="Enter the subject" className="orange-border" />
            </Form.Group>
            <Form.Group controlId="formMessage" className="mt-3">
              <Form.Control as="textarea" rows={4} placeholder="Enter your message" className="orange-border" />
            </Form.Group>
            <Button variant="outline-light" type="submit" className="mt-3 sendBtn" style={{ backgroundColor: 'orange' }}>
              SEND
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Contact;
