import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { forgotPassword } from './api'; // Import the API handler
import validationSchema from './validationSchema';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ForgotPassword.css';

const useForgotHandler = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('success');

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await forgotPassword(values);
        setSnackbarMessage('Password reset email sent successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        // Navigate to password reset page or display a success message
        navigate('/password-reset');
      } catch (error) {
        setSnackbarMessage('Error sending password reset email!');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    },
  });

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return {
    formik,
    openSnackbar,
    snackbarMessage,
    snackbarSeverity,
    handleSnackbarClose,
  };
};

export default useForgotHandler;
