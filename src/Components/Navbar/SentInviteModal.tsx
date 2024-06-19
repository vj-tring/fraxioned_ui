import React from 'react';
import { Modal } from 'react-bootstrap';
import SendInvite from '../SendInvite/SendInvite';

interface InviteModalProps {
  show: boolean;
  onHide: () => void;
}

const InviteModal: React.FC<InviteModalProps> = ({ show, onHide }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Send Invite</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <SendInvite />
      </Modal.Body>
    </Modal>
  );
};

export default InviteModal;
