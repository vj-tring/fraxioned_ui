import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'
import { PortURL } from '../../Components/config'
import { useFormik } from 'formik'
import validationSchema from './validationSchema'

const useSignupHandler= () => {
    const navigate = useNavigate()
    const location = useLocation();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('success');
  const [inviteToken, setInviteToken] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('inviteToken');
    setInviteToken(token);
  }, [location.search]);

    const formik = useFormik({
        initialValues: {
          name: '',
          phone: '',
          email: '',
          state: '',
          city: '',
          pincode: '',
          password: '',
          confirmPassword: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
          try {
            const payload = {
              ...values,
              inviteToken,
            };
    
            const response = await axios.post(`${PortURL}/authentication/register`, payload);
            setSnackbarMessage('Signup successful!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            localStorage.setItem("Phone", formik.values.phone);
            localStorage.setItem("Password", formik.values.password);
            navigate('/login');
          } catch (error) {
            if (axios.isAxiosError(error)) {
              setSnackbarMessage('Error submitting form: ' + (error.response?.data?.message || error.message));
            } else {
              setSnackbarMessage('An unknown error occurred');
            }
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            console.error('Error submitting form:', error);
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
    }
}

export default useSignupHandler;
