import React, { useState } from 'react';
import './ForgotPassword.css';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(email);
  };

  const onButtonClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    setEmailError("");

    if (email === "") {
      setEmailError("Please enter your email");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    
    navigate("/dashboard");
  };

  return (
    <div className="login-box">
      <h2>Forgot Password</h2>
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

export default ForgotPassword;