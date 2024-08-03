import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../Redux/store/index'; 
import { login } from '../../Redux/slice/auth/authSlice';
import styles from './Login.module.css';
import logo from './fraxioned.png';
import background from './background.jpg';
import Loader from '../Loader/Loader'

import CustomizedSnackbars from '../CustomizedSnackbars/CustomizedSnackbars';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false)


  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9]+([._@][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setEmailError('Please fill in the Email ID');
      setPasswordError(false);
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email ID');
      setPasswordError(false);
    } else if (!password.trim()) {
      setPasswordError(true);
      setEmailError('');
    } else {
      setEmailError('');
      setPasswordError(false);
      setIsLoading(true)


      try {
        const resultAction = await dispatch(login({ email, password })).unwrap();
        if (resultAction.user && resultAction.session) {
          setSnackbarMessage('Login Successful');
          setSnackbarSeverity('success');
          setShowSnackbar(true);
          navigate('/dashboard');
          setIsLoading(false)

        }
      } catch (error) {
        setSnackbarMessage(error as string || 'Login failed. Please try again.');
        setSnackbarSeverity('error');
        setShowSnackbar(true);
        setIsLoading(false)


      }
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError('');
  };

  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setEmailError('Please enter a valid email id');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError(false);
  };

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  return (
    <div className={styles.outerContainer} style={{ backgroundImage: `url(${background})` }}>
      <div className={styles.innerContainer}>
        {isLoading && <div data-testid="loader"><Loader /></div>}
        <img src={logo} alt="Fraxioned Logo" className={styles.logo} />
        <div className={styles.formWrapper}>
          <h2 className={styles.login}>Login here</h2>
          <p className={styles.loginSubtext}>Please enter your details to sign in</p>
          {emailError && <div className={styles.errorMessage}>{emailError}</div>}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Email"
                value={email}
                autoFocus
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                className={emailError ? styles.errorInput : ''}
              />
            </div>
            <div className={styles.inputGroup}>
              {passwordError && (
                <div className={styles.errorMessage}>Please fill in the Password</div>
              )}
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                className={passwordError ? styles.errorInput : ''}
              />
            </div>
            <div className={styles.formFooter}>
              <label className={styles.remember}>
                <input type="checkbox" /> Remember me
              </label>
              <Link to="/forgot-password" className={styles.forgotPassword}>
                Forgot password?
              </Link>
            </div>
            <button type="submit" className={styles.signInButton}>
              Sign in
            </button>
          </form>
        </div>
      </div>
      <CustomizedSnackbars
        open={showSnackbar}
        handleClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </div>
  );
};

export default Login;
