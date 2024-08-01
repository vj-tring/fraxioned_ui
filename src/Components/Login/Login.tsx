import React, { useState } from 'react'
import styles from './Login.module.css'
import { Link, useNavigate } from 'react-router-dom'
import logo from './fraxioned.png'
import axios from 'axios'
import background from './background.jpg'
import { ApiUrl } from '../config'
import CustomizedSnackbars from '../CustomizedSnackbars/CustomizedSnackbars' // Import the Snackbar component

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [showSnackbar, setShowSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success')
  const navigate = useNavigate()

  const validateEmail = (email: string) => {
    const re =
      /^[a-zA-Z0-9]+([._@][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/
    return re.test(String(email).toLowerCase())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setEmailError('Please fill in the Email ID')
      setPasswordError(false)
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email ID')
      setPasswordError(false)
    } else if (!password.trim()) {
      setPasswordError(true)
      setEmailError('')
    } else {
      setEmailError('')
      setPasswordError(false)
      try {
        const response = await axios.post(`${ApiUrl}/authentication/login`, {
          email,
          password,
        })

        const { user, session } = response.data
        localStorage.setItem(
          'userData',
          JSON.stringify({
            ...user,
          })
        )
        localStorage.setItem('token', session.token)
        localStorage.setItem('expiredAt', session.expires_at)
        setSnackbarMessage('Login successful')
        setSnackbarSeverity('success')
        setShowSnackbar(true)
        setTimeout(() => navigate('/dashboard'), 1000)
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setSnackbarMessage(error.response.data.message || 'Login failed')
        } else {
          setSnackbarMessage('An error occurred. Please try again.')
        }
        setSnackbarSeverity('error')
        setShowSnackbar(true)
      }
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setEmailError('')
  }

  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setEmailError('Please enter a valid email id')
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setPasswordError(false)
  }

  const handleSnackbarClose = () => {
    setShowSnackbar(false)
  }

  return (
    <div
      className={styles.outerContainer}
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className={styles.innerContainer}>
        <img src={logo} alt="Fraxioned Logo" className={styles.logo} />
        <div className={styles.formWrapper}>
          <h2 className={styles.login}>Login here</h2>
          <p className={styles.loginSubtext}>
            Please enter your details to sign in
          </p>
          {emailError && <div className={styles.errorMessage}>{emailError}</div>}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
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
              <Link to="/forgot-password" className={styles.forgotPassword}>
                Forgot password?
              </Link>
            </div>
            <button type="submit" className={styles.signInButton}>
              Sign in
            </button>
          </form>
        </div>
      </div>

      <CustomizedSnackbars
        open={showSnackbar}
        handleClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </div>
  )
}

export default Login
