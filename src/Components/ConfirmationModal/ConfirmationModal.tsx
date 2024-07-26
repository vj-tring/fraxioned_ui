import React from 'react'
import Modal from 'react-bootstrap/Modal'
import './ConfirmationModal.css'

interface ConfirmationModalProps {
  show: boolean
  onHide: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel: string
  cancelLabel: string
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  show,
  onHide,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered className="modal">
      <Modal.Header closeButton className="modal-header">
        <Modal.Title className="title">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="message">{message}</Modal.Body>
      <Modal.Footer className="modal-footer-custom">
        <button className="success" onClick={onHide}>
          {cancelLabel}
        </button>
        <button className="primary" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </Modal.Footer>
    </Modal>
  )
}

export default ConfirmationModal
