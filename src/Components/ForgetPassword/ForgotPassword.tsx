import React, { useState } from 'react';
import styles from './ForgotPassword.module.css';
import { Link } from 'react-router-dom';
import logo from './fraxioned.png'

const ForgetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9]+([.@][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please fill in the Email ID');
    } else if (!validateEmail(email)) {
      setError('Please enter a valid email ID');
    } else {
      setError('');
      console.log('Password reset requested for:', email);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError('');
  };

  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setError('Please enter a valid email ID');
    }
  };

  return (
    <div className={styles.outerContainer}>
      <div className={styles.innerContainer}>
        <img src={logo} alt="Fraxioned Logo" className={styles.logo} />
        <div className={styles.formWrapper}>
          <h2 className={styles.login}>Reset here</h2>
          <p className={styles.loginSubtext}>Recover your password</p>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              {error && <div className={styles.errorMessage}>{error}</div>}
              <input
                type="text"
                placeholder="Email"
                value={email}
                autoFocus
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                className={`${styles.input} ${error ? styles.errorInput : ''}`}
              />
            </div>
            <div className={styles.formFooter}>
              <label className={styles.remember}>
                <input type="checkbox" /> Remember password?
              </label>
              <Link to="/" className={styles.forgotPassword}>Login here!</Link>
            </div>
            <button type="submit" className={styles.signInButton}>Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;