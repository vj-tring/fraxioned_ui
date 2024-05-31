import React, { useState } from 'react';
import './ResetPassword.css';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [newPasswordError, setNewPasswordError] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const onButtonClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    setEmailError("");
    setNewPasswordError("");
    setConfirmPasswordError("");

    if (email === "") {
      setEmailError("Please enter your email");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (newPassword === "") {
      setNewPasswordError("Please enter a new password");
      return;
    }

    if (!validatePassword(newPassword)) {
      setNewPasswordError("Password must contain at least one uppercase letter, one lowercase letter, and one digit");
      return;
    }

    if (confirmPassword === "") {
      setConfirmPasswordError("Please confirm your new password");
      return;
    }

    if (newPassword!== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    // Send a request to the server to reset the password
    //...

    // Navigate to the dashboard page
    navigate("/dashboard");
  };

  return (
    <div className="login-box">
      <h2>Reset Password</h2>
      <form>
        <div className="user-box">
          <input
            value={email}
            placeholder="Email"
            onChange={ev => setEmail(ev.target.value)}
            className="user-box"
            type="email"
          />
          <label className="errorLabel">{emailError}</label>
        </div>
        <div className="user-box">
          <input
            value={newPassword}
            placeholder="New Password"
            onChange={ev => setNewPassword(ev.target.value)}
            className="user-box"
            type="password"
          />
          <label className="errorLabel">{newPasswordError}</label>
        </div>
        <div className="user-box">
          <input
            value={confirmPassword}
            placeholder="Confirm Password"
            onChange={ev => setConfirmPassword(ev.target.value)}
            className="user-box"
            type="password"
          />
          <label className="errorLabel">{confirmPasswordError}</label>
        </div>
        <Button
          onClick={onButtonClick}
          className="inputButton mt-3"
          type="button"
          variant="contained"
          color="primary"
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;