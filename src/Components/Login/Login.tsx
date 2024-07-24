import React, { useState } from 'react';
import styles from './Login1.module.css';
import { Link } from 'react-router-dom';
import logo from './fraxioned.png';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) {
            setEmailError(true);
            setPasswordError(false);
        } else if (!password.trim()) {
            setPasswordError(true);
            setEmailError(false);
        } else {
            setEmailError(false);
            setPasswordError(false);
            console.log('Login attempted with:', email, password);
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setEmailError(false);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setPasswordError(false);
    };

    return (
        <div className={styles.outerContainer}>
            <div className={styles.innerContainer}>
                <img src={logo} alt="Fraxioned Logo" className={styles.logo} />
                <div className={styles.formWrapper}>
                    <h2 className={styles.login}>Login here</h2>
                    <p className={styles.loginSubtext}>Please enter your details to sign in</p>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.inputGroup}>
                            {emailError && (
                                <div className={styles.errorMessage}>
                                    Please fill in the Email ID
                                </div>
                            )}
                            <input
                                type="text"
                                placeholder="Email"
                                value={email}
                                autoFocus
                                onChange={handleEmailChange}
                                className={emailError ? styles.errorInput : ''}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            {passwordError && (
                                <div className={styles.errorMessage}>
                                    Please fill in the Password
                                </div>
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
                            <Link to="/forgot-password" className={styles.forgotPassword}>Forgot password?</Link>
                        </div>
                        <button type="submit" className={styles.signInButton}>Sign in</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;