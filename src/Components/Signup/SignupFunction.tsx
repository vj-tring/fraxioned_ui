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
      username:'',
      firstName: '',
      lastName: '',
      phone: '',
      secondaryPhone: '',
      secondaryEmail: '',
      address1: '',
      address2: '',
      state: '',
      city: '',
      zip: '',
      imageUrl: null as File | null,  // Initialize imageUrl as null for file
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      console.log("Form submitted");
      try {
        const formData = new FormData();
        formData.append('username', values.username);
        formData.append('firstName', values.firstName);
        formData.append('lastName', values.lastName);
        formData.append('phone', values.phone);
        formData.append('secondaryPhone', values.secondaryPhone);
        formData.append('secondaryEmail', values.secondaryEmail);
        formData.append('address1', values.address1);
        formData.append('address2', values.address2);
        formData.append('state', values.state);
        formData.append('city', values.city);
        formData.append('zip', values.zip);
        
        if (values.imageUrl) {
          formData.append('imageUrl', values.imageUrl);
        }
     
        formData.append('password', values.password);
        formData.append('confirmPassword', values.confirmPassword);
        formData.append('inviteToken', inviteToken || '');  
  
        const response = await registerUser(formData);
  
        if (response.status === 201) {
          setSnackbarMessage('Signup successful!');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);
          localStorage.setItem("Phone", formik.values.phone);
          localStorage.setItem("Password", formik.values.password);
          navigate('/login');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error response:', error.response);
          console.error('Error message:', error.message);
          setSnackbarMessage(error.response?.data?.message || error.message);
        } else {
          console.error('Unknown error:', error);
          setSnackbarMessage('An unknown error occurred');
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
