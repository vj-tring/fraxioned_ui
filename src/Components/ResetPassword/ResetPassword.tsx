import React, { useState, useEffect } from 'react'
import styles from './ResetPassword.module.css'
import axios from 'axios'
import logo from '../Login/fraxioned.png'
import Modal from 'react-bootstrap/Modal';
import { ApiUrl } from '../config'

const ResetPassword: React.FC = () => {
  const [oldPassword, setOldPassword] = useState('')
  const [oldPasswordError, setOldPasswordError] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordError, setNewPasswordError] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState(false)
  const [passwordMismatch, setPasswordMismatch] = useState(false)
  const [userId, setUserId] = useState<number | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem('userData')
    if (userData) {
      const user = JSON.parse(userData)
      setUserId(user.id)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError(null)

    if (!oldPassword.trim()) {
      setOldPasswordError(true)
    } else if (!newPassword.trim()) {
      setNewPasswordError(true)
    } else if (!confirmPassword.trim()) {
      setConfirmPasswordError(true)
    } else if (newPassword !== confirmPassword) {
      setPasswordMismatch(true)
    } else if (userId === null) {
      setApiError('User ID not found.')
    } else {
      try {
        const response = await axios.post(
          `${ApiUrl}/authentication/resetPassword`,
          {
            oldPassword,
            newPassword,
            userId,
          }
        )
        console.log(response)
        setSuccessMessage('Password reset successfully!')
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setApiError(error.response.data.message || 'Password reset failed')
        } else {
          setApiError('An error occurred. Please try again.')
        }
      }
    }
  }

  const handleOldPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOldPassword(e.target.value)
    setOldPasswordError(false)
  }

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value)
    setNewPasswordError(false)
    setPasswordMismatch(false)
  }

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value)
    setConfirmPasswordError(false)
    setPasswordMismatch(false)
  }

  return (
    <div className={styles.modalContent}>
      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}
      <h2 className={styles.login}>Reset password</h2>
      <p className={styles.loginSubtext}>Set your new password here</p>
      <form onSubmit={handleSubmit} className={styles.form}>
        {apiError && <div className={styles.errorMessage}>{apiError}</div>}
        {passwordMismatch && (
          <div className={styles.errorMessage}>New passwords do not match</div>
        )}
        <div className={styles.inputGroup}>
          {oldPasswordError && (
            <div className={styles.errorMessage}>Please enter your old password</div>
          )}
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
            <div className={styles.errorMessage}>Please enter a new password</div>
          )}
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
            <div className={styles.errorMessage}>Please confirm your new password</div>
          )}
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className={confirmPasswordError ? styles.errorInput : ''}
          />
        </div>
        <button type="submit" className={styles.signInButton}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;

