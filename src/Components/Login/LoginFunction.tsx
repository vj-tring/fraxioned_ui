import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { login } from '../../Api/Login';
import validationSchema from './validationSchema';
// import { useDispatch, useSelector } from 'react-redux';
// import { loginUser } from '../../Redux/actions/loginActions';

const useLoginHandler = () => {
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('success');

  const navigate = useNavigate();
 
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await login(values);
        if (response.status === 201) {
          const { data } = response;


















          
          localStorage.setItem('userData', JSON.stringify(data.user));
          localStorage.setItem('token', data.session.token);
          localStorage.setItem('expiresAt', data.session.expiresAt);
          // dispatch(loginUser(values));

          setSnackbarMessage('Login successful!');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);

          setTimeout(() => {
            navigate('/dashboard');
          });
        }
      } catch (error) {
        setSnackbarMessage('Invalid Credentials!');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        formik.resetForm();
      } finally {
        setLoading(false);
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
    loading,
  };
};

export default useLoginHandler;