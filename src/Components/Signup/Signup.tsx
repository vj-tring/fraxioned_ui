import React, { useState, useEffect } from 'react';
import './Signup.css'; 
import { useNavigate, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import axios from 'axios';
import { Button } from '@mui/material';
import { PortURL } from '../config';
import validationSchema from './validationSchema';
import CustomizedSnackbars from '../CustomizedSnackbars/CustomizedSnackbars';

const Signup: React.FC = () => {
  const navigate = useNavigate();
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

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <CustomizedSnackbars
        open={openSnackbar}
        handleClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
      <div className="signup-box shadow p-4 bg-white rounded">
        <h2 className="text-center">Sign Up</h2>
        <form onSubmit={formik.handleSubmit} className="row g-3">
          <div className="col-12 mt-4">
            <label htmlFor="name" className="form-label">
              {formik.touched.name && formik.errors.name ? (
                <span className="text-danger flex-end">{formik.errors.name}</span>
              ) : null}
            </label>
            <input
              name="name"
              type="text"
              placeholder="Enter your name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className={`form-control ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
            />
          </div>
          <div className="col-12 mt-4">
            <label htmlFor="phone" className="form-label">
              {formik.touched.phone && formik.errors.phone ? (
                <span className="text-danger">{formik.errors.phone}</span>
              ) : null}
            </label>
            <input
              name="phone"
              type="text"
              placeholder="Enter your phone number"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phone}
              className={`form-control ${formik.touched.phone && formik.errors.phone ? 'is-invalid' : ''}`}
            />
          </div>
          <div className="col-12 mt-4">
            <label htmlFor="password" className="form-label">
              {formik.touched.password && formik.errors.password ? (
                <span className="text-danger">{formik.errors.password}</span>
              ) : null}
            </label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
            />
          </div>
          <div className="col-12 mt-4">
            <label htmlFor="confirmPassword" className="form-label">
              {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                <span className="text-danger">{formik.errors.confirmPassword}</span>
              ) : null}
            </label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
              className={`form-control ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'is-invalid' : ''}`}
            />
          </div>
          <div className="col-12">
            <Button
              type="submit"
              className="w-100 mt-3"
              variant="contained"
              color="primary"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
