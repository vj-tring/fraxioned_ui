import './Signup.css';
import { Button } from '@mui/material';
import CustomizedSnackbars from '../CustomizedSnackbars/CustomizedSnackbars';

import useSignupHandler from './SignupApiHandler';


const Signup: React.FC = () => {

  const {
    formik,
    openSnackbar,
    snackbarMessage,
    snackbarSeverity,
    handleSnackbarClose,
} = useSignupHandler()


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
          <div className="col-12 mt-2">
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
          <div className="col-12 mt-2">
            <label htmlFor="phone" className="form-label">
              {formik.touched.phone && formik.errors.phone ? (
                <span className="text-danger">{formik.errors.phone}</span>
              ) : null}
            </label>
            <input
              name="phone"
              type="text"
              placeholder="Enter your phone number"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phone}
              className={`form-control ${formik.touched.phone && formik.errors.phone ? 'is-invalid' : ''}`}
            />
          </div>
          <div className="col-12 mt-2">
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
          <div className="col-6 mt-2">
            <label htmlFor="state" className="form-label">
              {formik.touched.state && formik.errors.state ? (
                <span className="text-danger">{formik.errors.state}</span>
              ) : null}
            </label>
            <input
              name="state"
              type="text"
              placeholder="Enter your state"
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
              placeholder="Enter your city"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.city}
              className={`form-control ${formik.touched.city && formik.errors.city ? 'is-invalid' : ''}`}
            />
          </div>
          <div className="col-12 mt-2">
            <label htmlFor="pincode" className="form-label">
              {formik.touched.pincode && formik.errors.pincode ? (
                <span className="text-danger">{formik.errors.pincode}</span>
              ) : null}
            </label>
            <input
              name="pincode"
              type="text"
              placeholder="Enter your pincode"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.pincode}
              className={`form-control ${formik.touched.pincode && formik.errors.pincode ? 'is-invalid' : ''}`}
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
              placeholder="Enter your password"
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