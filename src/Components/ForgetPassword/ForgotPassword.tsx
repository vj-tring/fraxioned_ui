import React from 'react';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ForgotPassword.css';
// import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import useForgotHandler from './ForgotApiHandler';
import CustomizedSnackbars from '../CustomizedSnackbars/CustomizedSnackbars';


const ForgotPassword: React.FC = () => {

  const {
    formik,
    openSnackbar,
    snackbarMessage,
    snackbarSeverity,
    handleSnackbarClose,
} = useForgotHandler()


  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
       <CustomizedSnackbars
                open={openSnackbar}
                handleClose={handleSnackbarClose}
                message={snackbarMessage}
                severity={snackbarSeverity}
            />
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
