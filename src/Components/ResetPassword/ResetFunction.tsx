import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useFormik } from 'formik';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ResetPassword.css';
import validationSchema from './validationSchema';
import { resetPassword } from '../../Api/Reset';

const useResetHandler = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('success');

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Function to extract token from URL params
  const getTokenFromParams = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('resetToken') || '';
  };

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);

        const token = getTokenFromParams(); // Get token from URL params
        console.log(token);
        const response = await resetPassword(values, token);

        if (response.status===200) {
          setSnackbarMessage('Password reset successfully!');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);

          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          const errorMessage = response.data.message;
          setSnackbarMessage(errorMessage);
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
        }
      } catch (error) {
        setSnackbarMessage('Error resetting password!');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
      setLoading(false);
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
    loading,
  };
};

export default useResetHandler;