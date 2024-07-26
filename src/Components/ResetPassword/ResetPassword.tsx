import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './ResetPassword.css'
import { Button } from '@mui/material'
import useResetHandler from './ResetFunction'
import CustomizedSnackbars from '../CustomizedSnackbars/CustomizedSnackbars'
import ResponsiveAppBar from '../NavbarMUI/NavbarUI'
import Loader from '../../Components/Loader/Loader'
const ResetPassword: React.FC = () => {
  const {
    formik,
    openSnackbar,
    handleSnackbarClose,
    snackbarMessage,
    snackbarSeverity,
    loading,
  } = useResetHandler()

  return (
    <div>
      <ResponsiveAppBar />

      <div className="container4">
        <div className="main-container d-flex">
          <div className="image-container4"> </div>
          <div className="reset-container ">
            <CustomizedSnackbars
              open={openSnackbar}
              handleClose={handleSnackbarClose}
              message={snackbarMessage}
              severity={snackbarSeverity}
            />

            <div className="reset   rounded">
              <h4 className="text-center ">Reset Password</h4>
              <form onSubmit={formik.handleSubmit}>
                <div className="form-group position-relative  ">
                  {formik.touched.newPassword && formik.errors.newPassword ? (
                    <div className="invalid-feedback d-block">
                      {formik.errors.newPassword}
                    </div>
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
                <div className="form-group position-relative ">
                  {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword ? (
                    <div className="invalid-feedback d-block">
                      {formik.errors.confirmPassword}
                    </div>
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
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
