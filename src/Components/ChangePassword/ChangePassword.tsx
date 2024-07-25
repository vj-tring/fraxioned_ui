import React, { useState } from 'react';
import styles from './ChangePassword.module.css';
import logo from '../Login/fraxioned.png';

const Change: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordError, setNewPasswordError] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPassword.trim()) {
            setNewPasswordError(true);
            setConfirmPasswordError(false);
        } else if (!confirmPassword.trim()) {
            setNewPasswordError(false);
            setConfirmPasswordError(true);
        } else if (newPassword !== confirmPassword) {
            setNewPasswordError(true);
            setConfirmPasswordError(true);
        } else {
            setNewPasswordError(false);
            setConfirmPasswordError(false);
            console.log('Password change attempted with:', newPassword);
        }
    };

    const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value);
        setNewPasswordError(false);
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        setConfirmPasswordError(false);
    };

    return (
        <div className={styles.outerContainer}>
            <div className={styles.innerContainer}>
                <img src={logo} alt="Fraxioned Logo" className={styles.logo} />
                <div className={styles.formWrapper}>
                    <h2 className={styles.login}>Change password</h2>
                    <p className={styles.loginSubtext}>Set your new password</p>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.inputGroup}>
                            {newPasswordError && (
                                <div className={styles.errorMessage}>
                                    Please enter a new password
                                </div>
                            )}
                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={handleNewPasswordChange}
                                className={newPasswordError ? styles.errorInput : ''}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            {confirmPasswordError && (
                                <div className={styles.errorMessage}>
                                    Please confirm your new password
                                </div>
                            )}
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                className={confirmPasswordError ? styles.errorInput : ''}
                            />
                        </div>
                        {newPasswordError && confirmPasswordError && (
                            <div className={styles.errorMessage}>
                                Passwords do not match
                            </div>
                        )}
                        <div className={styles.formFooter}>
                            <label className={styles.remember}>
                                <input type="checkbox" /> Remember me
                            </label>
                        </div>
                        <button type="submit" className={styles.signInButton}>Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Change;