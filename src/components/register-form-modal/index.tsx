import RegisterFormContent from '@/pages-admin/register-form'
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material'
import { X } from 'lucide-react'
import React from 'react'

interface FormDialogProps {
  open: boolean
  handleClose: () => void
}


const FormDialog: React.FC<FormDialogProps> = ({ open, handleClose }) => {

  const sendInviteHeader = {
    color: 'black',
    padding: '6px 24px',
    letterSpacing: '.18rem',
    fontSize: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '48px',
    border: '1px solid #ccc',
    background: '#f7f7f7'
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      keepMounted
      fullWidth
      PaperProps={{ sx: { borderRadius: 1, maxWidth: '75%', height: '80%' } }}
    >
      <DialogTitle
        sx={sendInviteHeader}
      >
        CREATE A NEW ACCOUNT
        <IconButton
          aria-label="close"
          sx={{ color: '#fff' }}
          onClick={handleClose}
        >
          <X size={18} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: 0 }}>
        <RegisterFormContent onClose={handleClose} />
      </DialogContent>
    </Dialog>
  )
}

export default FormDialog
