import React from 'react';
import Modal from 'react-bootstrap/Modal';
import ResetPassword from 'Components/ResetPassword/ResetPassword';

interface ResetPasswordModalProps {
    show: boolean;
    onHide: () => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ show, onHide }) => {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Reset Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ResetPassword />
            </Modal.Body>
        </Modal>
    );
};

export default ResetPasswordModal;
