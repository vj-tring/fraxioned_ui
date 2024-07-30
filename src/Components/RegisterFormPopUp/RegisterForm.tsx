import React, { useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CustomizedSnackbars from '../CustomizedSnackbars/CustomizedSnackbars'
import "../RegisterFormPopUp/RegisterForm.css"
import { SelectChangeEvent } from '@mui/material/Select'
import { useDispatch } from 'react-redux'
import { registerUser } from '../../Redux/slice/auth/registerSlice'
import { AppDispatch } from '../../Redux/store'

interface FormDialogProps {
  open: boolean
  handleClose: () => void
}

const FormDialog: React.FC<FormDialogProps> = ({ open, handleClose }) => {
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    addressLine1: '',
    phoneNumber: '',
    roleId: 0,
    propertyID: 0,
  })

  const dispatch = useDispatch<AppDispatch>()

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    addressLine1: '',
    phoneNumber: '',
    roleId: '',
    propertyID: '',
  })

  const [showSnackbar, setShowSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success')

  // Handle text field change
  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormValues({
      ...formValues,
      [name]: value,
    })
  }

  // Handle select field change
  const handleSelectChange = (event: SelectChangeEvent<number>) => {
    const { name, value } = event.target
    const parsedValue = typeof value === 'string' ? value : value.toString();
    setFormValues({
        ...formValues,
        [name]: parseInt(parsedValue, 10).toString(),
    })
}
  const validate = () => {
    let hasErrors = false
    const newErrors: any = {}

    if (!formValues.firstName) {
      newErrors.firstName = 'First name is required'
      hasErrors = true
    }
    if (!formValues.lastName) {
      newErrors.lastName = 'Last name is required'
      hasErrors = true
    }
    if (!formValues.email) {
      newErrors.email = 'Email is required'
      hasErrors = true
    }
    if (!formValues.addressLine1) {
      newErrors.addressLine1 = 'Address Line 1 is required'
      hasErrors = true
    }
    if (!formValues.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required'
      hasErrors = true
    }
    if (formValues.roleId === 0) {
      newErrors.roleId = 'Role is required'
      hasErrors = true
    }
    if (formValues.propertyID === 0) {
      newErrors.propertyID = 'Property ID is required'
      hasErrors = true
    }

    setErrors(newErrors)
    return !hasErrors
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validate()) {
      const payload = {
        email: formValues.email.trim().toLowerCase(),
        firstName: formValues.firstName.trim(),
        lastName: formValues.lastName.trim(),
        addressLine1: formValues.addressLine1.trim(),
        addressLine2: '', // Default value
        state: '', // Default value
        country: '', // Default value
        city: '', // Default value
        zipcode: '', // Default value
        phoneNumber: formValues.phoneNumber.trim(),
        roleId: formValues.roleId,
        updated_by: 0, // Default value
        created_by: 0, // Default value
        userPropertyDetails: {
          propertyID: formValues.propertyID,
          noOfShares: '', // Default value
          acquisitionDate: new Date().toISOString(), // Default to current date
        }
      }

      console.log('Payload:', payload) // Log payload data

      try {
        await dispatch(registerUser(payload)).unwrap();
        setSnackbarMessage('Registration successful');
        setSnackbarSeverity('success');
        setShowSnackbar(true);
        handleClose();  // Close the dialog on successful registration
      } catch (error) {
        console.error('Registration Error:', error); // Log the error
        setSnackbarMessage('Registration failed. Please try again.');
        setSnackbarSeverity('error');
        setShowSnackbar(true);
      }
    } else {
      setSnackbarMessage('Please correct the errors');
      setSnackbarSeverity('error');
      setShowSnackbar(true);
    }
  }

  const theme = createTheme({
    typography: {
      fontFamily: 'Montserrat, sans-serif',
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        className='DialogRegister'
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(68deg, rgb(30, 134, 144) 0%, rgba(44,157,167,1) 35%, rgb(47, 158, 168) 100%)',
            color: 'white',
          }}
        >
          Create a New Account
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon sx={{ color: 'white' }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ marginTop: '10px' }}>
          <TextField
            autoFocus
            required
            margin="dense"
            id="firstName"
            name="firstName"
            label="First Name"
            type="text"
            fullWidth
            value={formValues.firstName}
            onChange={handleTextFieldChange}
            error={Boolean(errors.firstName)}
            helperText={errors.firstName}
          />
          <TextField
            required
            margin="dense"
            id="lastName"
            name="lastName"
            label="Last Name"
            type="text"
            fullWidth
            value={formValues.lastName}
            onChange={handleTextFieldChange}
            error={Boolean(errors.lastName)}
            helperText={errors.lastName}
          />
          <TextField
            required
            margin="dense"
            id="email"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            value={formValues.email}
            onChange={handleTextFieldChange}
            error={Boolean(errors.email)}
            helperText={errors.email}
          />
          <TextField
            required
            margin="dense"
            id="addressLine1"
            name="addressLine1"
            label="Address Line 1"
            type="text"
            fullWidth
            value={formValues.addressLine1}
            onChange={handleTextFieldChange}
            error={Boolean(errors.addressLine1)}
            helperText={errors.addressLine1}
          />
          <TextField
            margin="dense"
            id="phoneNumber"
            name="phoneNumber"
            label="Phone Number"
            type="text"
            fullWidth
            value={formValues.phoneNumber}
            onChange={handleTextFieldChange}
            error={Boolean(errors.phoneNumber)}
            helperText={errors.phoneNumber}
          />
          <FormControl fullWidth sx={{ marginTop: 3 }}>
            <InputLabel id="roleId-label">Role</InputLabel>
            <Select
              labelId="roleId-label"
              id="roleId"
              name="roleId"
              value={formValues.roleId}
              onChange={handleSelectChange}
              label="Role"
            >
              <MenuItem value={1}>Admin</MenuItem>
              <MenuItem value={2}>User</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ marginTop: 3 }}>
            <InputLabel id="propertyID-label">Property</InputLabel>
            <Select
              labelId="propertyID-label"
              id="propertyID"
              name="propertyID"
              value={formValues.propertyID}
              onChange={handleSelectChange}
              label="Property"
            >
              <MenuItem value={1}>House</MenuItem>
              <MenuItem value={2}>Apartment</MenuItem>
              <MenuItem value={3}>Condo</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} className='RegisterCancel'>Cancel</Button>
          <Button type="submit" className='RegisterSubmit'>Register</Button>
        </DialogActions>
        <CustomizedSnackbars
          open={showSnackbar}
          handleClose={() => setShowSnackbar(false)}
          message={snackbarMessage}
          severity={snackbarSeverity}
        />
      </Dialog>
    </ThemeProvider>
  )
}

export default FormDialog
