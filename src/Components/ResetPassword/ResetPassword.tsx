import React from 'react';
import { useFormik } from 'formik';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ResetPassword.css';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import validationSchema from './validationSchema'; 

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: values => {

      navigate('/dashboard');
    },
  });

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="reset shadow p-4 mt-3 bg-white rounded">
        <h2 className="text-center mb-5">Reset Password</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group position-relative mb-5 ">
            {formik.touched.newPassword && formik.errors.newPassword ? (
              <div className="invalid-feedback d-block">{formik.errors.newPassword}</div>
            ) : null}
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="New Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.newPassword}
              className={`form-control  ${formik.touched.newPassword && formik.errors.newPassword ? 'is-invalid' : ''}`}
            />
          </div>
          <div className="form-group position-relative mb-3">
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className="invalid-feedback d-block">{formik.errors.confirmPassword}</div>
            ) : null}
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
              className={`form-control ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'is-invalid' : ''}`}
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

export default ResetPassword;
