import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import validationSchema from './validationSchema';
import { registerUser } from "../../Api/Register";

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

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
      username: '',
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
        // Convert image file to base64 string
        const imageUrl = "string";
        
        const payload = {
          ...values,
          // imageUrl, // Use base64 string
          inviteToken,
        };
        
        const response = await registerUser(payload);
  
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
