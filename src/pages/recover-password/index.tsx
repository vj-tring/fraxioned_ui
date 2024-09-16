import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import background from '../../assets/images/background.png'
import styles from './recover.module.css'
import logo from '../../assets/images/fraxioned.png'
import Loader from '../../components/loader'
import { recoverPasswordApi } from '../../api'

const Change: React.FC = () => {
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordError, setNewPasswordError] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState(false)
  const [passwordMismatch, setPasswordMismatch] = useState(false)
  const [resetToken, setResetToken] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const token = searchParams.get('resetToken')
    if (token) {
      setResetToken(token)
      console.log(token)
    } else {
      setGeneralError(
        'Invalid reset link. Please request a new password reset link.'
      )
    }
  }, [location])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPassword.trim()) {
      setNewPasswordError(true)
      setConfirmPasswordError(false)
      setPasswordMismatch(false)
    } else if (!confirmPassword.trim()) {
      setNewPasswordError(false)
      setConfirmPasswordError(true)
      setPasswordMismatch(false)
    } else if (newPassword !== confirmPassword) {
      setNewPasswordError(false)
      setConfirmPasswordError(false)
      setPasswordMismatch(true)
    } else {
      setNewPasswordError(false)
      setConfirmPasswordError(false)
      setPasswordMismatch(false)
      setIsLoading(true)

      try {
        const response = await recoverPasswordApi(newPassword)
        console.log('Password change successful:', response.data)
        setIsLoading(false)
        navigate('/login')
      } catch (error) {
        console.error('Error changing password:', error)
        setGeneralError('Failed to change password. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
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

  if (!resetToken) {
    return (
      <div
        className={styles.outerContainer}
        style={{ backgroundImage: `url(${background})` }}
      >        <div className={styles.innerContainer}>
          <div className={styles.errorMessage}>{generalError}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.outerContainer}>
      <div className={styles.innerContainer}>
        {isLoading && <Loader />}
        <img src={logo} alt="Fraxioned Logo" className={styles.logo} loading="lazy" />
        <div className={styles.formWrapper}>
          <h2 className={styles.login}>Change password</h2>
          <p className={styles.loginSubtext}>Set your new password here</p>
          <form onSubmit={handleSubmit} className={styles.form}>
            {passwordMismatch && (
              <div className={styles.errorMessage}>Passwords do not match</div>
            )}
            {generalError && (
              <div className={styles.errorMessage}>{generalError}</div>
            )}
            <div className={styles.inputGroup3}>
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
            <div className={styles.inputGroup3}>
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
            <button
              type="submit"
              className={styles.signInButton}
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Change
