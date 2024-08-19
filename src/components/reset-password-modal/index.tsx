import React from 'react'
import Modal from 'react-bootstrap/Modal'
import ResetPassword from '../../pages/reset-password'

interface ResetPasswordModalProps {
  show: boolean
  onHide: () => void
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  show,
  onHide,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Body>
        <ResetPassword onClose={onHide} />
      </Modal.Body>
    </Modal>
  )
}

export default ResetPasswordModal
