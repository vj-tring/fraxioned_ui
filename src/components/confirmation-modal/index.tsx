import React from 'react';
import Modal from 'react-bootstrap/Modal';
import './confirmation-modal.css';

interface ConfirmationModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  children: React.ReactNode;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  show,
  onHide,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel,
  children,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered className="confirmation-modal">
      {/* <div className="modal-content"> */}
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="modal-message">{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn-cancel" onClick={onHide}>
          {cancelLabel}
        </button>
        <button className="btn-confirm" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </Modal.Footer>
      {/* </div> */}
    </Modal>
  );
};

export default ConfirmationModal;