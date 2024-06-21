import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ForgotPassword.css';
import { Button } from '@mui/material';
import useForgotHandler from './ForgotFunction';
import CustomizedSnackbars from '../CustomizedSnackbars/CustomizedSnackbars';
import ResponsiveAppBar from '../NavbarMUI/NavbarUI'


const ForgotPassword: React.FC = () => {

  const {
    formik,
    openSnackbar,
    snackbarMessage,
    snackbarSeverity,
    handleSnackbarClose,
} = useForgotHandler()


  return (
    <div className=" d-flex flex-column justify-content-center align-items-center ">

<ResponsiveAppBar/>

              <CustomizedSnackbars
                open={openSnackbar}
                handleClose={handleSnackbarClose}
                message={snackbarMessage}
                severity={snackbarSeverity}
            />
      <div className="forgot shadow rounded p-4">
        <h4 className="forgot-pass text-center mb-5">Forgot Password</h4>
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
