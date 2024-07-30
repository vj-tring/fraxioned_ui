import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import styles from './ForgotPassword.module.css';
import logo from '../Login/fraxioned.png';
import {
  forgotPassword,
  clearState,
} from '../../Redux/slice/auth/forgotPasswordSlice';
import { RootState } from '../../Redux/reducers';
import { AppDispatch } from '../../Redux/store';
import SnackbarComponent from '../Snackbar/Snackbar';

const ForgetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'success'>('error');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading, successMessage, errorMessage } = useSelector(
    (state: RootState) => state.forgotPassword
  );

  useEffect(() => {
    if (successMessage) {
      setSnackbarMessage(successMessage);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      const timer = setTimeout(() => {
        dispatch(clearState());
        navigate('/');
      }, 3000);
      return () => clearTimeout(timer);
    } else if (errorMessage) {
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [successMessage, errorMessage, dispatch, navigate]);

  const validateEmail = (email: string) => {
    const re =
      /^[a-zA-Z0-9]+([.@][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) {
      setSnackbarMessage('Please fill in the Email ID');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    if (!validateEmail(email)) {
      setSnackbarMessage('Please enter a valid email ID');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    dispatch(forgotPassword(email));
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    dispatch(clearState());
  };

  return (
    <div className={styles.outerContainer}>
      <div className={styles.innerContainer}>
        <img src={logo} alt="Fraxioned Logo" className={styles.logo} />
        <div className={styles.formWrapper}>
          <h2 className={styles.login}>Forget Password</h2>
          <p className={styles.loginSubtext}>Recover your password here</p>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup1}>
              <input
                type="text"
                placeholder="Email"
                value={email}
                autoFocus
                onChange={handleEmailChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formFooter}>
              <label className={styles.remember}>
                <input type="checkbox" /> Remember password?
              </label>
              <Link to="/" className={styles.forgotPassword}>
                Login here!
              </Link>
            </div>
            <button
              type="submit"
              className={styles.signInButton}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
      <SnackbarComponent
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
        severity={snackbarSeverity}
        style={{ backgroundColor: snackbarSeverity === 'success' ? '#54B471' : '#DE5242', color: '#FEF9FD' }}
      />
    </div>
  );
};

export default ForgetPassword;
