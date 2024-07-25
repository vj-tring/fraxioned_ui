import React from 'react';
import { Button } from '@mui/material';
import CustomizedSnackbars from '../CustomizedSnackbars/CustomizedSnackbars';
import useSignupHandler from './SignupFunction';
import './Signup.css';
import ResponsiveAppBar from '../NavbarMUI/NavbarUI';
import Loader from '../Loader/Loader';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';




const Signup: React.FC = () => {
  const {
    formik,
    openSnackbar,
    snackbarMessage,
    snackbarSeverity,
    handleSnackbarClose,
    loading
  } = useSignupHandler();

 

  return (
    <div>
      <ResponsiveAppBar />
      <div className="main-container1 d-flex">
        <div className="image-container3">
        </div>
        <div className="signup-container ">

          <CustomizedSnackbars
            open={openSnackbar}
            handleClose={handleSnackbarClose}
            message={snackbarMessage}
            severity={snackbarSeverity}
          />
                    <h3 className="text-center">Create a new Account</h3>

          <div className="signup-box  p-4 rounded">

            <form onSubmit={formik.handleSubmit} className="row signuprow g-3">
          
              <div className="col-12 ">
                <label htmlFor="firstName" className="form-label">
                  {formik.touched.firstName && formik.errors.firstName ? (
                    <span className="text-danger flex-end">{formik.errors.firstName}</span>
                  ) : null}
                  
                </label>
                <input
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.firstName}
                  className={`form-control ${formik.touched.firstName && formik.errors.firstName ? 'is-invalid' : ''}`}
                />
              </div>
              <div className="col-12 ">
                <label htmlFor="lastName" className="form-label">
                  {formik.touched.lastName && formik.errors.lastName ? (
                    <span className="text-danger fle     x-end">{formik.errors.lastName}</span>
                  ) : null}
                </label>
                <input
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.lastName}
                  className={`form-control ${formik.touched.lastName && formik.errors.lastName ? 'is-invalid' : ''}`}
                />
              </div>
              <div className="col-12 ">
                <label htmlFor="email" className="form-label">
                  {formik.touched.email && formik.errors.email ? (
                    <span className="text-danger">{formik.errors.email}</span>
                  ) : null}
                </label>
                <input
                  name="email"
                  type="Email"
                  placeholder="Email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                />
              </div>
              
              
{/*    
              <div className="col-12 ">
                <label htmlFor="password" className="form-label">
                  {formik.touched.password && formik.errors.password ? (
                    <span className="text-danger">{formik.errors.password}</span>
                  ) : null}
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                />
              </div> */}
              <div className="col-12 ">
                <label htmlFor="phone" className="form-label">
                  {formik.touched.phone && formik.errors.phone ? (
                    <span className="text-danger">{formik.errors.phone}</span>
                  ) : null}
                </label>
                <PhoneInput
                  country={'us'}
                  value={formik.values.phone}
                  placeholder='Phone'
                  onChange={(phone) => formik.setFieldValue('phone', phone)}
                  inputClass={`form-control ${formik.touched.phone && formik.errors.phone ? 'is-invalid' : ''}`}
                />
              </div>
              <div className="col-12">
                <Button
                  type="submit"
                  className="w-100 mt-3 signbtn"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Submit'}
                </Button>
              </div>
            </form>
            {loading && <Loader />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;


