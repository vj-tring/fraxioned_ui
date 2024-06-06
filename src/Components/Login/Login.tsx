import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { useFormik } from 'formik';
import axios from 'axios';
import validationSchema from './validationSchema';
import { PortURL } from '../../Components/config';
import CustomizedSnackbars from '../CustomizedSnackbars/CustomizedSnackbars';

const Login: React.FC = () => {
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
        const response = await axios.post(`${PortURL}/authentication/login`, values);
        if (response.status === 200) {
          const { data } = response;
           console.log("dataresponse",data);
          localStorage.setItem('email', data.email);
          localStorage.setItem('userData', JSON.stringify(data)); // Store the entire data object

          setSnackbarMessage('Login successful!');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);
          navigate('/dashboard');
          
        }
      } catch (error) {
        setSnackbarMessage('Invalid Credentials!');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        formik.resetForm();
      }
    },
  });

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <CustomizedSnackbars
        open={openSnackbar}
        handleClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
      <div className="login-box shadow p-4 bg-white rounded">
        <h2 className="text-center mb-5">Login</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group position-relative">
            {formik.touched.email && formik.errors.email && (
              <div className="invalid-feedback d-block">{formik.errors.email}</div>
            )}
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
            />
          </div>
          <div className="form-group position-relative">
            {formik.touched.password && formik.errors.password && (
              <div className="invalid-feedback d-block">{formik.errors.password}</div>
            )}
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
            />
          </div>
          <Button
            type="submit"
            className="w-100 mt-3"
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
