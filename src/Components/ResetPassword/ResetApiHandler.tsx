
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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
        const token = getTokenFromParams(); // Get token from URL params
        console.log(token);
        const response = await resetPassword(values, token);       
        setSnackbarMessage('Password reset successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        


        setTimeout(() => {
          navigate('/login');
        }, 3000); 
        
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