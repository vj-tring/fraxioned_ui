import React from 'react';
import { useFormik } from 'formik';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ForgotPassword.css';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import validationSchema from './validationSchema'; 

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      // Send a request to the server to handle forgot password logic
      //...

      // Navigate to the dashboard page
      navigate('/dashboard');
    },
  });

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="forgot shadow bg-white rounded p-4">
        <h2 className="text-center mb-5">Forgot Password</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group position-relative">
            {formik.touched.email && formik.errors.email ? (
              <div className="invalid-feedback d-block mb-2">{formik.errors.email}</div>
            ) : null}
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
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

export default ForgotPassword;
