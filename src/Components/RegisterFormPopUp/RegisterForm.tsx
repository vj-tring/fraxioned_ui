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
import useSignupHandler from '../Signup/SignupFunction'
import CustomizedSnackbars from '../CustomizedSnackbars/CustomizedSnackbars'
import CloseIcon from '@mui/icons-material/Close' // Import Close icon
import IconButton from '@mui/material/IconButton' // Import IconButton
import { createTheme, ThemeProvider } from '@mui/material/styles'

interface FormDialogProps {
    open: boolean
    handleClose: () => void
}

const FormDialog: React.FC<FormDialogProps> = ({ open, handleClose }) => {
    const {
        formik,
        openSnackbar,
        snackbarMessage,
        snackbarSeverity,
        handleSnackbarClose,
    } = useSignupHandler()

    const [showSnackbar, setShowSnackbar] = useState(false)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        await formik.handleSubmit() // Ensure formik's handleSubmit completes
        setShowSnackbar(true) // Show Snackbar after form submission
    }

    const theme = createTheme({
        typography: {
            fontFamily: 'Montserrat, sans-serif',
        },
    })

    return (
        <ThemeProvider theme={theme}>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: handleSubmit,
                }}
            >
                <DialogTitle>
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
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="firstName"
                        name="firstName"
                        label="First Name"
                        type="text"
                        fullWidth
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.firstName &&
                            Boolean(formik.errors.firstName)
                        }
                        helperText={
                            formik.touched.firstName && formik.errors.firstName
                        }
                    />
                    <TextField
                        required
                        margin="dense"
                        id="lastName"
                        name="lastName"
                        label="Last Name"
                        type="text"
                        fullWidth
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.lastName &&
                            Boolean(formik.errors.lastName)
                        }
                        helperText={
                            formik.touched.lastName && formik.errors.lastName
                        }
                    />
                    <TextField
                        required
                        margin="dense"
                        id="email"
                        name="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.email && Boolean(formik.errors.email)
                        }
                        helperText={formik.touched.email && formik.errors.email}
                    />
                    <TextField
                        required
                        margin="dense"
                        id="phone"
                        name="phone"
                        label="Phone Number"
                        type="text"
                        fullWidth
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.phone && Boolean(formik.errors.phone)
                        }
                        helperText={formik.touched.phone && formik.errors.phone}
                    />
                    <FormControl fullWidth sx={{ marginTop: 3 }}>
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select
                            labelId="role-label"
                            id="role"
                            name="role"
                            value={formik.values.role}
                            onChange={formik.handleChange}
                            label="Role"
                        >
                            <MenuItem value="Admin">Admin</MenuItem>
                            <MenuItem value="User">User</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Register</Button>
                </DialogActions>
                <CustomizedSnackbars
                    open={showSnackbar && openSnackbar}
                    handleClose={() => {
                        handleSnackbarClose()
                        setShowSnackbar(false)
                    }}
                    message={snackbarMessage}
                    severity={snackbarSeverity}
                />
            </Dialog>
        </ThemeProvider>
    )
}

export default FormDialog
