import React from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

interface CustomizedSnackbarsProps {
  open: boolean
  handleClose: (event?: React.SyntheticEvent | Event, reason?: string) => void
  message: string
  severity: 'success' | 'info' | 'warning' | 'error'
}

const CustomizedSnackbars: React.FC<CustomizedSnackbarsProps> = ({
  open,
  handleClose,
  message,
  severity,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Change to top center
      sx={{ width: '80%', maxWidth: '800px' }} // Set the width and maximum width
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        <div>{message.toString()}</div>
      </Alert>
    </Snackbar>
  )
}

export default CustomizedSnackbars
