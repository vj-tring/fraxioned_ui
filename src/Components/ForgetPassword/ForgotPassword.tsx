import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ForgotPassword.module.css';
import { Link } from 'react-router-dom';
import { ApiUrl } from 'Components/config';
import logo from '../Login/fraxioned.png';
import axios from 'axios';

const ForgetPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email: string) => {
        const re = /^[a-zA-Z0-9]+([.@][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) {
            setError('Please fill in the Email ID');
        } else if (!validateEmail(email)) {
            setError('Please enter a valid email ID');
        } else {
            setError('');
            setIsLoading(true);
            try {
                const response = await axios.post(`${ApiUrl}/authentication/forgotPassword`, { email });
                console.log('Password reset requested for:', email);
                console.log('Server response:', response.data);
                navigate('/');
            } catch (error) {
                console.error('Error requesting password reset:', error);
                setError('Failed to request password reset. Please try again.');
            } finally {
                setIsLoading(false);
            }
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
                    <h2 className={styles.login}>Forget password</h2>
                    <p className={styles.loginSubtext}>Recover your password here</p>
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
                        <button type="submit" className={styles.signInButton} disabled={isLoading}>
                            {isLoading ? 'Submitting...' : 'Submit'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;