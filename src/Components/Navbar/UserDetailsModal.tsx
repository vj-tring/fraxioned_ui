import React from 'react';
import { Modal, Image } from 'react-bootstrap';


interface UserDetailsModalProps {
  show: boolean;
  onHide: () => void;
  userImage?: string;
  userDetails: {
    name: string;
    email: string;
    phone: string;
    mailingAddress: string;
    secondaryEmail: string;
    secondaryPhone: string;
  };
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ show, onHide, userImage, userDetails }) => {
  return (
    <Modal  show={show} onHide={onHide} centered>
      <Modal.Header closeButton style={{ backgroundColor: 'orange' }}>
        <Modal.Title>User Details</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: 'orange' }}>
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          {userImage && <Image src={userImage} roundedCircle height="60" className="mb-3" alt="User" />}
          <h5>{userDetails.name}</h5>
        </div>
        <p><strong>Email:</strong> {userDetails.email}</p>
        <p><strong>Phone:</strong> {userDetails.phone}</p>
        <p><strong>Mailing Address:</strong> {userDetails.mailingAddress}</p>
        <p><strong>Secondary Email:</strong> {userDetails.secondaryEmail}</p>
        <p><strong>Secondary Phone:</strong> {userDetails.secondaryPhone}</p>
      </Modal.Body>
    </Modal>
  );
};

export default UserDetailsModal;
