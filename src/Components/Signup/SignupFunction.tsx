import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import validationSchema from './validationSchema';
import { registerUser } from "../../Api/Register";

const useSignupHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

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
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      role:''
    },



    validationSchema: validationSchema,

    onSubmit: async (values) => {
      setLoading(true);
      console.log("Form submitted");
      try {
        const payload = {

          ...values,

          inviteToken,

        };
        



        const response = await registerUser(payload);
  



        if (response.status === 201) {
          setSnackbarMessage('Signup successful!');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);
          localStorage.setItem("Phone", formik.values.phone);
          navigate('/login');
          formik.resetForm();

        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error response:', error.response);
          console.error('Error message:', error.message);
          setSnackbarMessage(error.response?.data?.message || error.message);
          formik.resetForm();

          
        } else {
          console.error('Unknown error:', error);
          setSnackbarMessage('An unknown error occurred');
          formik.resetForm();

        }
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
    loading
  };
}

export default useSignupHandler;
