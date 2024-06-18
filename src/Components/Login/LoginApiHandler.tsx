import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
// import { useDispatch } from 'react-redux';
// import { setLogin } from '../../Redux/Features/loginSlice'

import validationSchema from './validationSchema';

import { login } from '../../Api/LoginApi';
const useLoginHandler = () => {
  // const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('success');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await login(values);
        if (response.status === 201) {
          const { data } = response;
          localStorage.setItem('userData', JSON.stringify(data.user));
          localStorage.setItem('token', data.session.token);
          localStorage.setItem('expiresAt', data.session.expiresAt);

          // dispatch(setLogin(values)); // Dispatch the setLogin action

          setSnackbarMessage('Login successful!');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);

          setTimeout(() => {
            navigate('/dashboard');
          }, 3000); 
        }
      } catch (error) {
        setSnackbarMessage('Invalid Credentials!');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        formik.resetForm();
      }
    },
  });

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
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

export default useLoginHandler;