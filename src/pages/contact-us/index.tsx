import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import 'bootstrap/dist/css/bootstrap.min.css'
import { handleSubmit } from './contact-function'
import fraxionedIcon from '../../assets/images/fraxioned-icon.png'
import './contact.css'
import CustomizedSnackbars from '../../components/customized-snackbar'

const Contact: React.FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  return (
    <div className="contact-container">
      <Row className="contactrow">
        <Col md={6} className="contact-left">
          <div className="contact-header">
            <img className="contact-icon" src={fraxionedIcon} alt="Icon" loading="lazy" />
            <h2 className="contact-title">HI THERE!</h2>
          </div>
          <p className="contact-text">
            The Owner Services team at Fraxioned is here to help! Please use
            this form to send us an email, and I’ll get back to you as soon as
            possible.
          </p>
          <h5 className="contact-thanks">THANKS FOR REACHING OUT!</h5>
        </Col>
        <Col md={6} className="contact-right">
          <Form
            onSubmit={(event) =>
              handleSubmit(
                event,
                name,
                email,
                subject,
                message,
                setSnackbarMessage,
                setOpenSnackbar,
                setName,
                setEmail,
                setSubject,
                setMessage
              )
            }
          >
            <Form.Group controlId="formLabel" className="contact-form-group">
              <Form.Label className="contact-form-label">
                EMAILING OWNERS@FRAXIONED.COM
              </Form.Label>
            </Form.Group>
            <Form.Group controlId="formName" className="contact-form-group">
              <Form.Control
                type="text"
                placeholder="NAME"
                className="contact-form-control"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formSubject" className="contact-form-group">
              <Form.Control
                type="text"
                placeholder="SUBJECT"
                className="contact-form-control"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
              />
            </Form.Group>
            {/* <Form.Group controlId="formEmail" className="contact-form-group">
              <Form.Control
                type="email"
                placeholder="EMAIL"
                className="contact-form-control"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Form.Group> */}
            <Form.Group controlId="formMessage" className="contact-form-group">
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter your message"
                className="contact-form-control"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </Form.Group>
            <Button
              variant="outline-light"
              type="submit"
              className="contact-send-btn"
            >
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
  )
}

export default Contact
