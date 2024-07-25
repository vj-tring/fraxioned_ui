import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ForgotPassword.css';
import { Button } from '@mui/material';
import useForgotHandler from './ForgotFunction';
import CustomizedSnackbars from '../CustomizedSnackbars/CustomizedSnackbars';
import ResponsiveAppBar from '../NavbarMUI/NavbarUI'
import Loader from '../Loader/Loader';


const ForgotPassword: React.FC = () => {

  const {
    formik,
    openSnackbar,
    snackbarMessage,
    snackbarSeverity,
    handleSnackbarClose,
    loading
} = useForgotHandler()


  return (
    <div className="  ">

<ResponsiveAppBar/>

<div className="main-container4 d-flex">
        <div className="image-container4">
        </div>
        <div className="forgot-container ">

              <CustomizedSnackbars
                open={openSnackbar}
                handleClose={handleSnackbarClose}
                message={snackbarMessage}
                severity={snackbarSeverity}
            />
      <div className="forgot  rounded p-4">
        <h4 className="forgot-pass text-center mb-4">Forgot Password</h4>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group position-relative">
            {formik.touched.email && formik.errors.email ? (
              <div className="invalid-feedback1 d-block mb-2">{formik.errors.email}</div>
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
   {loading ? 'Loading...' : 'Submit'}

          </Button>
        </form>
        {loading && <Loader />}

      </div>
    </div>
    </div>
    </div>
  );
};



export default ForgotPassword;

