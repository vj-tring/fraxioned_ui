import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ResetPassword.css';
import { Button } from '@mui/material';
import useResetHandler from './ResetFunction';
import CustomizedSnackbars from '../CustomizedSnackbars/CustomizedSnackbars';
import ResponsiveAppBar from '../NavbarMUI/NavbarUI'
import Loader from '../../Components/Loader/Loader';
const ResetPassword: React.FC = () => {
  const {
    formik,
    openSnackbar,
    handleSnackbarClose,
    snackbarMessage,
    snackbarSeverity,
    loading

} = useResetHandler()


  return (
    <div className=" d-flex  flex-column justify-content-center align-items-center ">
                <ResponsiveAppBar/>

       <CustomizedSnackbars
        open={openSnackbar}
        handleClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
      
      <div className="reset shadow p-4 rounded">
        <h4 className="text-center mb-5">Reset Password</h4>
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
          <div className="form-group position-relative mb-5">
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
            disabled={loading}

          >
                        {loading ? 'Loading...' : 'Submit'}
                        </Button>
        </form>
        {loading && <Loader />}

      </div>
    </div>
  );
};

export default ResetPassword;