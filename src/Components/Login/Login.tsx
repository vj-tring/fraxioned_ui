
import { Button } from '@mui/material'
import React from 'react'
import CustomizedSnackbars from '../CustomizedSnackbars/CustomizedSnackbars'
import './Login.css'
import useLoginHandler from './LoginFunction'
import { Link } from 'react-router-dom';
import ResponsiveAppBar from '../NavbarMUI/NavbarUI'
import Loader from '../Loader/Loader';

const Login: React.FC = () => {
    const {
        formik,
        openSnackbar,
        snackbarMessage,
        snackbarSeverity,
        handleSnackbarClose,
        loading 
    } = useLoginHandler()

    return (
        
        <div className=" d-flex justify-content-center flex-column align-items-center">
            
          <ResponsiveAppBar/>

            <CustomizedSnackbars
                open={openSnackbar}
                handleClose={handleSnackbarClose}
                message={snackbarMessage}
                severity={snackbarSeverity}
            />

            <div className="login-box shadow p-4 rounded ">
                <h2 className="text-center mt-1">Login</h2>
                <form onSubmit={formik.handleSubmit}>
                    <div className="form-group position-relative">
                        {formik.touched.email && formik.errors.email && (
                            <div className="invalid-feedback d-block">
                                {formik.errors.email}
                            </div>
                        )}
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                            className={`form-control ${
                                formik.touched.email && formik.errors.email
                                    ? 'is-invalid'
                                    : ''
                            }`}
                        />
                    </div>
                    <div className="form-group position-relative">
                        {formik.touched.password && formik.errors.password && (
                            <div className="invalid-feedback d-block">
                                {formik.errors.password}
                            </div>
                        )}
                        <input
                            id='password'
                            name="password"
                            type="password"
                            placeholder="Password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                            className={`form-control ${
                                formik.touched.password &&
                                formik.errors.password
                                    ? 'is-invalid'
                                    : ''
                            }`}
                        />
                         <Link to="/forgot-password" className="forgot-password">
        Forgot Password?
    </Link>
                    </div>
                    <Button
                        type="submit"
                        className="w-100 mt-3"
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
    )
}

export default Login
