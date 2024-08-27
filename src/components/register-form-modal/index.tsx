import RegisterFormContent from '@/pages-admin/register-form'
import React from 'react'
import Modal from 'react-bootstrap/Modal'


interface FormDialogProps {
  open: boolean
  handleClose: () => void
}

const FormDialog: React.FC<FormDialogProps> = ({ open, handleClose }) => {
  return (
    <Modal show={open} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter" centered size='xl'>
      <Modal.Body>
        <RegisterFormContent onClose={handleClose} />
      </Modal.Body>
    </Modal>
  )
}

export default FormDialog
