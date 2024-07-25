import React, { useState } from 'react';
import styles from './Login1.module.css';
import { Link, useNavigate } from 'react-router-dom';
import logo from './fraxioned.png';
import axios from 'axios';
import { ApiUrl } from 'Components/config';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [apiError, setApiError] = useState('');
    const navigate = useNavigate();

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
            setApiError('');
            try {
                const response = await axios.post(`${ApiUrl}/authentication/login`, {
                    email,
                    password
                });

                const { user, session } = response.data;
                localStorage.setItem('userData', JSON.stringify({
                    ...user,
                }));
                localStorage.setItem('token', session.token);
                localStorage.setItem('expiredAt', session.expires_at);
                navigate('/dashboard');
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    setApiError(error.response.data.message || 'Login failed');
                } else {
                    setApiError('An error occurred. Please try again.');
                }
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

    return (
        <div className={styles.outerContainer}>
            <div className={styles.innerContainer}>
                <img src={logo} alt="Fraxioned Logo" className={styles.logo} />
                <div className={styles.formWrapper}>
                    <h2 className={styles.login}>Login here</h2>
                    <p className={styles.loginSubtext}>Please enter your details to sign in</p>
                    {apiError && <div className={styles.errorMessage}>{apiError}</div>}
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.inputGroup}>
                            {emailError && (
                                <div className={styles.errorMessage}>
                                    {emailError}
                                </div>
                            )}
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