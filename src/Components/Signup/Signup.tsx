import React from 'react';
import { Button } from '@mui/material';
import CustomizedSnackbars from '../CustomizedSnackbars/CustomizedSnackbars';
import useSignupHandler from './SignupApiHandler';
import './Signup.css';

const Signup: React.FC = () => {
  const {
    formik,
    openSnackbar,
    snackbarMessage,
    snackbarSeverity,
    handleSnackbarClose,
  } = useSignupHandler();

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <CustomizedSnackbars
        open={openSnackbar}
        handleClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />

      <div className="signup-box shadow p-4 bg-white rounded mt-5">
        <h2 className="text-center">Sign Up</h2>
        <form onSubmit={formik.handleSubmit} className="row g-3">
          <div className="col-6 mt-2">
            <label htmlFor="username" className="form-label">
              {formik.touched.username && formik.errors.username ? (
                <span className="text-danger flex-end">{formik.errors.username}</span>
              ) : null}
            </label>
            <input
              name="username"
              type="text"
              placeholder=" Username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
              className={`form-control ${formik.touched.username && formik.errors.username ? 'is-invalid' : ''}`}
            />
          </div>
          <div className="col-6 mt-2">
            <label htmlFor="phone" className="form-label">
              {formik.touched.phone && formik.errors.phone ? (
                <span className="text-danger">{formik.errors.phone}</span>
              ) : null}
            </label>
            <input
              name="phone"
              type="text"
              placeholder=" phone number"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phone}
              className={`form-control ${formik.touched.phone && formik.errors.phone ? 'is-invalid' : ''}`}
            />
          </div>
          <div className="col-6 mt-2">
            <label htmlFor="secondaryPhone" className="form-label">
              {formik.touched.secondaryPhone && formik.errors.secondaryPhone ? (
                <span className="text-danger">{formik.errors.secondaryPhone}</span>
              ) : null}
            </label>
            <input
              name="secondaryPhone"
              type="text"
              placeholder=" secondary phone number"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.secondaryPhone}
              className={`form-control ${formik.touched.secondaryPhone && formik.errors.secondaryPhone ? 'is-invalid' : ''}`}
            />
          </div>
         
          <div className="col-6 mt-2">
            <label htmlFor="secondaryEmail" className="form-label">
              {formik.touched.secondaryEmail && formik.errors.secondaryEmail ? (
                <span className="text-danger">{formik.errors.secondaryEmail}</span>
              ) : null}
            </label>
            <input
              name="secondaryEmail"
              type="email"
              placeholder=" secondary email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.secondaryEmail}
              className={`form-control ${formik.touched.secondaryEmail && formik.errors.secondaryEmail ? 'is-invalid' : ''}`}
            />
          </div>
          <div className="col-6 mt-2">
            <label htmlFor="address1" className="form-label">
              {formik.touched.address1 && formik.errors.address1 ? (
                <span className="text-danger">{formik.errors.address1}</span>
              ) : null}
            </label>
            <input
              name="address1"
              type="text"
              placeholder=" address line 1"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.address1}
              className={`form-control ${formik.touched.address1 && formik.errors.address1 ? 'is-invalid' : ''}`}
            />
          </div>
          <div className="col-6 mt-2">
            <label htmlFor="address2" className="form-label">
              {formik.touched.address2 && formik.errors.address2 ? (
                <span className="text-danger">{formik.errors.address2}</span>
              ) : null}
            </label>
            <input
              name="address2"
              type="text"
              placeholder=" address line 2"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.address2}
              className={`form-control ${formik.touched.address2 && formik.errors.address2 ? 'is-invalid' : ''}`}
            />
          </div>
          <div className="col-6 mt-2">
            <label htmlFor="state" className="form-label">
              {formik.touched.state && formik.errors.state ? (
                <span className="text-danger">{formik.errors.state}</span>
              ) : null}
            </label>
            <input
              name="state"
              type="text"
              placeholder=" state"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.state}
              className={`form-control ${formik.touched.state && formik.errors.state ? 'is-invalid' : ''}`}
            />
          </div>
          <div className="col-6 mt-2">
            <label htmlFor="city" className="form-label">
              {formik.touched.city && formik.errors.city ? (
                <span className="text-danger">{formik.errors.city}</span>
              ) : null}
            </label>
            <input
              name="city"
              type="text"
              placeholder=" city"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.city}
              className={`form-control ${formik.touched.city && formik.errors.city ? 'is-invalid' : ''}`}
            />
          </div>
          <div className="col-6 mt-2">
            <label htmlFor="zip" className="form-label">
              {formik.touched.zip && formik.errors.zip ? (
                <span className="text-danger">{formik.errors.zip}</span>
              ) : null}
            </label>
            <input
              name="zip"
              type="text"
              placeholder=" zip code"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.zip}
              className={`form-control ${formik.touched.zip && formik.errors.zip ? 'is-invalid' : ''}`}
            />
            </div>
          <div className="col-6 mt-2">
            <label htmlFor="imageUrl" className="form-label">
              {formik.touched.imageUrl && formik.errors.imageUrl ? (
                <span className="text-danger">{formik.errors.imageUrl}</span>
              ) : null}
            </label>
            <input
              name="imageUrl"
              type="text"
              placeholder="Enter image URL"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.imageUrl}
              className={`form-control ${formik.touched.imageUrl && formik.errors.imageUrl ? 'is-invalid' : ''}`}
            />
          </div>
          <div className="col-6 mt-2">
            <label htmlFor="password" className="form-label">
              {formik.touched.password && formik.errors.password ? (
                <span className="text-danger">{formik.errors.password}</span>
              ) : null}
            </label>
            <input
              name="password"
              type="password"
              placeholder=" password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
            />
          </div>
          <div className="col-6 mt-2">
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
              className="w-100 mt-3 signbtn"
              variant="contained"
              color="primary"
            >
              Submit
            </Button>
          </div>
        </form>
        <a href='/login' className='backlogin'>Back to login?</a>
      </div>
    </div>
  );
};

export default Signup;
