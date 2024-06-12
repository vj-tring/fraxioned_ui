import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useFormik } from 'formik';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ResetPassword.css';
import validationSchema from './validationSchema';
import { resetPassword } from '../../Api/ResetApi';


const useResetHandler = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('success');

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        // const response = await resetPassword(values);
         await resetPassword(values);
        setSnackbarMessage('Password reset successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        // Navigate to dashboard on success
        navigate('/dashboard');
      } catch (error) {
        setSnackbarMessage('Error resetting password!');
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

export default useResetHandler;