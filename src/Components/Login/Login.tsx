import { Button } from '@mui/material';
import React from 'react';
import CustomizedSnackbars from '../CustomizedSnackbars/CustomizedSnackbars';
import './Login.css';
import useLoginHandler from './LoginFunction';
import { Link } from 'react-router-dom';
import ResponsiveAppBar from '../NavbarMUI/NavbarUI';
import Loader from '../Loader/Loader';

const Login: React.FC = () => {
    const {
        formik,
        openSnackbar,
        snackbarMessage,
        snackbarSeverity,
        handleSnackbarClose,
        loading
    } = useLoginHandler();

    return (
        <div>
            <ResponsiveAppBar/>
          <div className="container1"> 
            <div className="login-main-container d-flex">
                <div    className="login-image-container1">       </div>
                
                <div className="login-container d-flex flex-column align-items-center justify-content-center">
                    <CustomizedSnackbars
                        open={openSnackbar}
                        handleClose={handleSnackbarClose}
                        message={snackbarMessage}
                        severity={snackbarSeverity}
                    />
                    <div className="login-box">
                    <h1 className='Hello'>Hello,</h1>
                    {/* <p className='Welcome'>Welcome Back!</p> */}
                    {/* <p className='Welcome'>The faster you fill up, the faster you get a house</p> */}

                        {/* <h2 className="text-center mt-1">Login</h2> */}
                        
                        <form onSubmit={formik.handleSubmit} className='Login-form'>
                            
                            <div className="form-group1 position-relative">
                                {formik.touched.email && formik.errors.email && (
                                    <div className="invalid-feedback d-block">
                                        {formik.errors.email}
                                    </div>
                                )}
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="youremail@gmail.com"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
                                    className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                                />
                            </div>
                            <div className="form-group1 position-relative">
                                {formik.touched.password && formik.errors.password && (
                                    <div className=" invalid-feedback d-block">
                                        {formik.errors.password}
                                    </div>
                                )}
                                <input
                                    id='password'
                                    name="password"
                                    type="password"
                                    placeholder="................"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password}
                                    className={  ` passinput form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                                />
                                <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
                            </div>
                            <Button
                                type="submit"
                                className="w-100 mt-5 loginbtn"
                                variant="contained"
                                color="primary"
                                disabled={loading}
                            >
                                {loading ? 'Loading...' : 'Sign In'}
                            </Button>
                        </form>
                        {loading && <Loader />}
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}

export default Login;
