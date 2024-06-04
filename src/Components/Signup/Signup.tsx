import React from 'react';
import './Signup.css'; 
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import validationSchema from './validationSchema'; 
import { Button } from '@mui/material';

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      alert('Form submitted successfully!');
      localStorage.setItem("Email", formik.values.email);
      localStorage.setItem("Password", formik.values.password);
      console.log(values); // Do whatever you want with form values
      navigate('/login'); // Redirect to login page after successful submission
    },
  });

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
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
            <label htmlFor="email" className="form-label">
              {formik.touched.email && formik.errors.email ? (
                <span className="text-danger">{formik.errors.email}</span>
              ) : null}
            </label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
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
