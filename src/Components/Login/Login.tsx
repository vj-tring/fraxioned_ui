import React from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { useFormik } from 'formik';
import axios from 'axios';
import validationSchema from './validationSchema';
import { PortURL } from '../../Components/config';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(`${PortURL}/login`, values);
        if (response.status === 200) {
          const { data } = response;
          localStorage.setItem('email', data.email);
          navigate('/dashboard');
        }
      } catch (error) {
        alert('Invalid Credentials!');
        formik.resetForm();
      }
    },
  });

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="login-box shadow p-4 bg-white rounded">
        <h2 className="text-center mb-5">Login</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group position-relative">
            {formik.touched.email && formik.errors.email ? (
              <div className="invalid-feedback d-block">{formik.errors.email}</div>
            ) : null}
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
            {formik.touched.password && formik.errors.password ? (
              <div className="invalid-feedback d-block">{formik.errors.password}</div>
            ) : null}
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
