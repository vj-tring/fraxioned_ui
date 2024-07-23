import React, { useState } from 'react';
import styles from './Signup.module.css';


const Signup: React.FC = () => {

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  // const navigate = useNavigate();


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempted with:', email, password, name);
  };

  return (
    <div className={styles['login-containers']}>
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
          <h3 className={styles['form-header']}>Create An Account</h3>
          <div className={styles['form-group']}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={styles['input-field']}
            />
          </div>
          <div className={styles['form-group']}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles['input-field']}
            />
          </div>
          <div className={styles['form-group']}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles['input-field']}
            />
          </div>
          <div className={styles['form-footer']}>
            <label className={styles['Remember-me']}>
              <input type="checkbox" /> I agree to the terms of service
            </label>
          </div>
          <button type="submit" className={styles['login-button']}>Register</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;