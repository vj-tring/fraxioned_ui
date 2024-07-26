import React, { useState } from 'react';
import styles from './ResetPassword.module.css';
import logo from '../Login/fraxioned.png';

const ResetPassword: React.FC = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [oldPasswordError, setOldPasswordError] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordError, setNewPasswordError] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [passwordMismatch, setPasswordMismatch] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!oldPassword.trim()) {
            setOldPasswordError(true);
            setNewPasswordError(false);
            setConfirmPasswordError(false);
            setPasswordMismatch(false);
        } else if (!newPassword.trim()) {
            setOldPasswordError(false);
            setNewPasswordError(true);
            setConfirmPasswordError(false);
            setPasswordMismatch(false);
        } else if (!confirmPassword.trim()) {
            setOldPasswordError(false);
            setNewPasswordError(false);
            setConfirmPasswordError(true);
            setPasswordMismatch(false);
        } else if (newPassword !== confirmPassword) {
            setOldPasswordError(false);
            setNewPasswordError(false);
            setConfirmPasswordError(false);
            setPasswordMismatch(true);
        } else {
            setOldPasswordError(false);
            setNewPasswordError(false);
            setConfirmPasswordError(false);
            setPasswordMismatch(false);
            console.log('Password change attempted with:', oldPassword, newPassword);
        }
    };

    const handleOldPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOldPassword(e.target.value);
        setOldPasswordError(false);
    };

    const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value);
        setNewPasswordError(false);
        setPasswordMismatch(false);
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        setConfirmPasswordError(false);
        setPasswordMismatch(false);
    };

    return (
        <div className={styles.outerContainer}>
            <div className={styles.innerContainer}>
                <img src={logo} alt="Fraxioned Logo" className={styles.logo} />
                <div className={styles.formWrapper}>
                    <h2 className={styles.login}>Reset password</h2>
                    <p className={styles.loginSubtext}>Set your new password here</p>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        {passwordMismatch && (
                            <div className={styles.errorMessage}>
                                New passwords do not match
                            </div>
                        )}
                        <div className={styles.inputGroup}>
                            {oldPasswordError && (
                                <div className={styles.errorMessage}>
                                    Please enter your old password
                                </div>
                            )}
                            <label htmlFor="oldPassword"></label>
                            <input
                                id="oldPassword"
                                type="password"
                                placeholder="Old Password"
                                value={oldPassword}
                                onChange={handleOldPasswordChange}
                                className={oldPasswordError ? styles.errorInput : ''}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            {newPasswordError && (
                                <div className={styles.errorMessage}>
                                    Please enter a new password
                                </div>
                            )}
                            <label htmlFor="newPassword"></label>
                            <input
                                id="newPassword"
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
                            <label htmlFor="confirmPassword"></label>
                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                className={confirmPasswordError ? styles.errorInput : ''}
                            />
                        </div>
                        <button type="submit" className={styles.signInButton}>Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;