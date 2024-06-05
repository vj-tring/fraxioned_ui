import React, { useEffect } from 'react';
import './Signup.css'; 
import { useNavigate, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import axios from 'axios';
import validationSchema from './validationSchema'; 
import { Button } from '@mui/material';
import { PortURL } from '../../Components/config';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const inviteToken = params.get('inviteToken') || '';

  const formik = useFormik({
    initialValues: {
      username: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        console.log('Submitting values:', values);
        const response = await axios.post(`${PortURL}/authentication/register`, values);
        if (response.status === 201) {
          alert('Registration successful!');
          navigate('/login'); 
        }
      } catch (error) {
        alert('Registration failed!');
        console.error('Error during registration:', error);
        formik.resetForm();
      }
    },
  });

  useEffect(() => {
    if (inviteToken) {
      formik.setFieldValue('inviteToken', inviteToken);
    }
  }, [formik, inviteToken]);

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="signup-box shadow p-4 bg-white rounded">
        <h2 className="text-center">Sign Up</h2>
        <form onSubmit={formik.handleSubmit} className="row g-3">
          <div className="col-12 mt-4">
            <label htmlFor="username" className="form-label">
              {formik.touched.username && formik.errors.username ? (
                <span className="text-danger flex-end">{formik.errors.username}</span>
              ) : null}
            </label>
            <input
              name="username"
              type="text"
              placeholder="Enter your username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
              className={`form-control ${formik.touched.username && formik.errors.username ? 'is-invalid' : ''}`}
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
              type="tel"
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
