import React, { useState } from 'react'
import styles from './Login.module.css'
import { Link, useNavigate } from 'react-router-dom'
import logo from './fraxioned.png'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../Redux/store'
import { login } from '../../Redux/slice/auth/authSlice'
import CustomizedSnackbars from '../CustomizedSnackbars/CustomizedSnackbars'
import background from '../../assets/Login_image/login_image.jpg'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [showSnackbar, setShowSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
    'success'
  )

  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

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
        const resultAction = await dispatch(login({ email, password }))
        // navigate('/dashboard')

        if (login.fulfilled.match(resultAction)) {
          // Login was successful
          navigate('/dashboard')
        } else {
          // Handle the case where the login is rejected
          const message = resultAction.payload as string
          setSnackbarMessage(message || 'Login failed. Please try again.')
          setSnackbarSeverity('error')
          setShowSnackbar(true)
        }
      } catch (error) {
        // Handle unexpected errors
        setSnackbarMessage('An error occurred. Please try again.')
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
      setEmailError('Please enter a valid email ID')
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setPasswordError(false)
  }

  return (
    <div className={styles.outerContainer}>
      <div className={styles.leftContainer}>
        <img
          src={background}
          alt="Background"
          className={styles.backgroundImage}
        />
        <div className={styles.overlay}></div>
      </div>
      <div className={styles.rightContainer}>
        <img src={logo} alt="Fraxioned Logo" className={styles.logo} />
        <div className={styles.formWrapper}>
          <h2 className={styles.login}>Login here</h2>
          <p className={styles.loginSubtext}>
            Please enter your details to sign in
          </p>
          <form onSubmit={handleSubmit} className={styles.form}>
            {emailError && (
              <div className={styles.errorMessage}>{emailError}</div>
            )}
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
            {passwordError && (
              <div className={styles.errorMessage}>
                Please fill in the Password
              </div>
            )}
            <div className={styles.inputGroup}>
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
        handleClose={() => setShowSnackbar(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </div>
  )
}

export default Login
