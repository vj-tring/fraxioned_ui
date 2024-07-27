// ContactModal.tsx

import React from 'react'
import Modal from 'react-bootstrap/Modal'
import Contact from '../ContactUs/Contact'
import 'bootstrap/dist/css/bootstrap.min.css'

interface ContactModalProps {
  show: boolean
  handleClose: () => void
}

const ContactModal: React.FC<ContactModalProps> = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} dialogClassName="modal-fullscreen">
      <Modal.Header closeButton>
        <Modal.Title>Contact Us</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Contact />
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  )
}

export default ContactModal
