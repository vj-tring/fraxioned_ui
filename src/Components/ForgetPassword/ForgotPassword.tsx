import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ForgotPassword.module.css';


const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className={styles['login-container']}>
      <div className={styles['welcome-section']}>
        <h1 className={styles['welcome-header']} >Welcome to Fraxioned</h1>
        <p className={styles['paragraph-header']}>CO-OWN YOUR DREAM VACATION HOME</p>
        <div className={styles['social-logins']}>
          <a href="https://www.facebook.com/fraxioned">
            <button className={`${styles['social-button']} ${styles.facebook}`}>Facebook</button>
          </a>
          <a href="https://x.com/Fraxioned_">
            <button className={`${styles['social-button']} ${styles.twitter}`}>Twitter</button>
          </a>
          <a href="https://www.fraxioned.com/">
            <button className={`${styles['social-button']} ${styles.google}`}>Google</button>
          </a>
        </div>
      </div>
      <div className={styles['login-form-section']}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles['fraxioned-header']}>Fraxioned</h2>
          <h3 className={styles['form-header']}>Recover your passowrd</h3>
          <div className={styles['form-group']}>
            <input
              type="email"
              placeholder="Email Address"
              role="presentation"
              autoComplete='off'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles['input-field']}
            />
          </div>
          <button type="submit" className={styles['login-button']}>Send Me Email</button>
          <p className={styles['register-link']}>
            Already a member? <Link to="/">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
